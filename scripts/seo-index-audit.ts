/**
 * SEO Indexability Audit
 *
 * Measures every unit and lesson the app can actually serve, scores it against the
 * gate in `src/lib/seo/indexable.ts`, and prints what is publishable today plus the
 * shortest path to publishing more.
 *
 *   npx tsx scripts/seo-index-audit.ts            report only, changes nothing
 *   npx tsx scripts/seo-index-audit.ts --write    regenerate the checked-in manifest
 *   npx tsx scripts/seo-index-audit.ts --check    exit 1 if the manifest is stale (CI)
 *
 * Content is read through `loadUnitData`, the same loader the app uses, so the audit
 * can never score a stale copy the runtime does not serve.
 */

import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import { getCourseMetaForProfession, loadUnitData } from '../src/data/course/course-meta';
import type { Lesson, Unit } from '../src/data/course/types';
import { PROFESSIONS } from '../src/data/professions';
import { runContentQA, type QAViolation } from '../src/lib/content-qa';
import {
  evaluatePage,
  MAX_WARNINGS,
  MAX_WARNINGS_PER_QUESTION,
  MIN_PAGE_WORDS,
  MIN_SECTION_SHARE,
  MIN_SECTION_UNITS,
  MIN_TEACHING_CARDS,
  type CourseQuality,
  type IndexabilityManifest,
  type PageQuality,
} from '../src/lib/seo/indexable';

const MANIFEST_PATH = path.resolve(__dirname, '../src/lib/seo/indexability-manifest.json');
const MANIFEST_VERSION = 1;
const UNLOCK_QUEUE_SIZE = 20;

// ─── Measurement ───────────────────────────────────────────

function words(text: string | undefined): number {
  if (!text) return 0;
  return text.replace(/<svg[\s\S]*?<\/svg>/gi, '').trim().split(/\s+/).filter(Boolean).length;
}

/** Prose a lesson contributes to a page: its blurb plus the text of its teaching cards. */
function lessonWords(lesson: Lesson): number {
  return lesson.questions
    .filter((q) => q.type === 'teaching')
    .reduce((sum, q) => sum + words(q.question) + words(q.explanation) + words(q.hint), words(lesson.description));
}

function teachingCards(lesson: Lesson): number {
  return lesson.questions.filter((q) => q.type === 'teaching').length;
}

// ─── Violation attribution ─────────────────────────────────

interface Tally {
  errors: number;
  warnings: number;
}

function emptyTally(): Tally {
  return { errors: 0, warnings: 0 };
}

function add(tally: Map<string, Tally>, key: string, violation: QAViolation): void {
  const entry = tally.get(key) ?? emptyTally();
  if (violation.severity === 'error') entry.errors++;
  else entry.warnings++;
  tally.set(key, entry);
}

/**
 * Maps every id a violation can be filed under (question, speed question, lesson, unit)
 * back to its owning lesson and unit. `QAViolation` carries only titles, and titles
 * collide across a 544-unit course, so ids are the only safe join key.
 */
function buildOwnerIndex(units: Unit[]): Map<string, { unitId: string; lessonId?: string }> {
  const owners = new Map<string, { unitId: string; lessonId?: string }>();
  for (const unit of units) {
    owners.set(unit.id, { unitId: unit.id });
    for (const lesson of unit.lessons) {
      const owner = { unitId: unit.id, lessonId: lesson.id };
      owners.set(lesson.id, owner);
      for (const q of lesson.questions) owners.set(q.id, owner);
      for (const sq of lesson.speedQuestions ?? []) owners.set(sq.id, owner);
    }
  }
  return owners;
}

// ─── Course scoring ────────────────────────────────────────

interface CourseAudit {
  courseId: string;
  courseName: string;
  units: PageQuality[];
  lessons: PageQuality[];
  course: CourseQuality;
  violations: number;
}

async function loadUnits(courseId: string): Promise<Unit[]> {
  const meta = getCourseMetaForProfession(courseId);
  const units: Unit[] = [];
  for (let i = 0; i < meta.length; i++) units.push(await loadUnitData(i, courseId));
  return units;
}

function scoreCourse(courseId: string, courseName: string, units: Unit[]): CourseAudit {
  const violations = runContentQA([{ id: courseId, name: courseName, units }]);
  const owners = buildOwnerIndex(units);
  const byUnit = new Map<string, Tally>();
  const byLesson = new Map<string, Tally>();
  let courseWide = 0;

  for (const violation of violations) {
    const owner = owners.get(violation.questionId);
    if (!owner) {
      courseWide++;
      continue;
    }
    add(byUnit, owner.unitId, violation);
    if (owner.lessonId) add(byLesson, owner.lessonId, violation);
  }

  const unitPages: PageQuality[] = [];
  const lessonPages: PageQuality[] = [];

  for (const unit of units) {
    const sectionIndex = unit.sectionIndex ?? 0;
    for (const lesson of unit.lessons) {
      lessonPages.push({
        courseId, sectionIndex, unitId: unit.id, lessonId: lesson.id,
        questions: lesson.questions.length,
        pageWords: lessonWords(lesson),
        teachingCards: teachingCards(lesson),
        ...(byLesson.get(lesson.id) ?? emptyTally()),
      });
    }
    unitPages.push({
      courseId, sectionIndex, unitId: unit.id,
      questions: unit.lessons.reduce((n, l) => n + l.questions.length, 0),
      pageWords: unit.lessons.reduce((n, l) => n + lessonWords(l), words(unit.description)),
      teachingCards: unit.lessons.reduce((n, l) => n + teachingCards(l), 0),
      ...(byUnit.get(unit.id) ?? emptyTally()),
    });
  }

  return {
    courseId,
    courseName,
    units: unitPages,
    lessons: lessonPages,
    course: { courseId, courseWideViolations: courseWide },
    violations: violations.length,
  };
}

// ─── Manifest ──────────────────────────────────────────────

function buildManifest(audits: CourseAudit[]): IndexabilityManifest {
  const courses: Record<string, CourseQuality> = {};
  const units: Record<string, PageQuality> = {};
  const lessons: Record<string, PageQuality> = {};

  // Every unit gets a record so a unit URL can always be explained. Lessons are only
  // recorded once they clear the thin-content floors, which keeps 2,800 foregone
  // conclusions out of a file the server parses on boot. Absent means not indexable.
  for (const audit of audits) {
    courses[audit.courseId] = audit.course;
    for (const unit of audit.units) units[`${unit.courseId}/${unit.unitId}`] = unit;
    for (const lesson of audit.lessons.filter((l) => !isThin(l))) {
      lessons[`${lesson.courseId}/${lesson.lessonId}`] = lesson;
    }
  }

  const body = { courses, units, lessons };
  const contentHash = createHash('sha1').update(JSON.stringify(body)).digest('hex').slice(0, 16);
  return { version: MANIFEST_VERSION, generatedAt: new Date().toISOString(), contentHash, ...body };
}

function readManifest(): IndexabilityManifest | null {
  if (!fs.existsSync(MANIFEST_PATH)) return null;
  const parsed: unknown = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  return parsed as IndexabilityManifest;
}

function writeManifest(manifest: IndexabilityManifest): void {
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

// ─── Gap analysis ──────────────────────────────────────────

/** Warnings a page may carry before the gate trips. */
function warningAllowance(page: PageQuality): number {
  return Math.min(MAX_WARNINGS, Math.floor(page.questions * MAX_WARNINGS_PER_QUESTION));
}

/** Violations that must be cleared before this page could be indexed. */
function violationGap(page: PageQuality): number {
  return page.errors + Math.max(0, page.warnings - warningAllowance(page));
}

function isThin(page: PageQuality): boolean {
  return page.pageWords < MIN_PAGE_WORDS || page.teachingCards < MIN_TEACHING_CARDS;
}

function sectionKey(page: PageQuality): string {
  return `${page.courseId}/${page.sectionIndex}`;
}

interface SectionRoll {
  courseId: string;
  sectionIndex: number;
  titles: Set<string>;
  total: number;
  indexable: number;
  gap: number;
}

function rollUpSections(audits: CourseAudit[], titles: Map<string, string>): SectionRoll[] {
  const rolls = new Map<string, SectionRoll>();
  for (const audit of audits) {
    for (const unit of audit.units) {
      const key = sectionKey(unit);
      const roll = rolls.get(key) ?? {
        courseId: unit.courseId,
        sectionIndex: unit.sectionIndex,
        titles: new Set<string>(),
        total: 0, indexable: 0, gap: 0,
      };
      roll.titles.add(titles.get(`${unit.courseId}/${unit.unitId}`) ?? '(untitled)');
      roll.total++;
      if (evaluatePage(unit).indexable) roll.indexable++;
      if (!isThin(unit)) roll.gap += violationGap(unit);
      rolls.set(key, roll);
    }
  }
  return [...rolls.values()];
}

function sectionLabel(roll: SectionRoll): string {
  if (roll.sectionIndex === 0) return '(ungrouped)';
  return [...roll.titles].join(' + ');
}

function isSectionIndexable(roll: SectionRoll): boolean {
  return roll.indexable >= MIN_SECTION_UNITS && roll.indexable / roll.total >= MIN_SECTION_SHARE;
}

// ─── Report ────────────────────────────────────────────────

function pct(part: number, total: number): string {
  return total === 0 ? '0.0%' : `${((part / total) * 100).toFixed(1)}%`;
}

function pad(value: string | number, width: number): string {
  return String(value).padEnd(width);
}

function printGate(): void {
  console.log('=== Octokeen SEO Indexability Audit ===\n');
  console.log('Gate for one page:');
  console.log(`  >= ${MIN_PAGE_WORDS} words of its own prose`);
  console.log(`  >= ${MIN_TEACHING_CARDS} teaching cards`);
  console.log('  0 QA violations of severity error');
  console.log(`  <= ${MAX_WARNINGS} warnings, and <= ${MAX_WARNINGS_PER_QUESTION} per question`);
  console.log(`Section hub: >= ${MIN_SECTION_UNITS} indexable units and >= ${pct(MIN_SECTION_SHARE, 1)} of them`);
  console.log('Course hub: no course-wide violations and at least one indexable section\n');
}

function printTotals(audits: CourseAudit[], sections: SectionRoll[]): void {
  const units = audits.flatMap((a) => a.units);
  const lessons = audits.flatMap((a) => a.lessons);
  const indexableUnits = units.filter((u) => evaluatePage(u).indexable);
  const indexableLessons = lessons.filter((l) => evaluatePage(l).indexable);
  const indexableSections = sections.filter(isSectionIndexable);

  console.log('--- Content totals ---');
  console.log(`  courses ${audits.length} | sections ${sections.length} | units ${units.length} | lessons ${lessons.length}`);
  console.log(`  questions ${units.reduce((n, u) => n + u.questions, 0)}`);
  console.log(`  QA violations ${audits.reduce((n, a) => n + a.violations, 0)}`);
  console.log(`    errors ${units.reduce((n, u) => n + u.errors, 0)} | warnings ${units.reduce((n, u) => n + u.warnings, 0)}\n`);

  console.log('--- Publishable today ---');
  console.log(`  units     ${pad(`${indexableUnits.length} / ${units.length}`, 14)} ${pct(indexableUnits.length, units.length)}`);
  console.log(`  sections  ${pad(`${indexableSections.length} / ${sections.length}`, 14)} ${pct(indexableSections.length, sections.length)}`);
  console.log(`  lessons   ${pad(`${indexableLessons.length} / ${lessons.length}`, 14)} ${pct(indexableLessons.length, lessons.length)}`);
  console.log(`  A lesson holds at most 3 teaching cards, so no lesson URL can ever clear the gate.\n`);
}

function printCourses(audits: CourseAudit[]): void {
  console.log('--- By course ---');
  console.log(`  ${pad('course', 26)}${pad('units', 8)}${pad('indexable', 12)}${pad('violations', 12)}${pad('thin units', 12)}`);
  for (const audit of audits) {
    const indexable = audit.units.filter((u) => evaluatePage(u).indexable).length;
    console.log(
      `  ${pad(audit.courseId, 26)}${pad(audit.units.length, 8)}${pad(indexable, 12)}` +
      `${pad(audit.violations, 12)}${pad(audit.units.filter(isThin).length, 12)}`,
    );
  }
  console.log('');
}

function printSections(sections: SectionRoll[]): void {
  console.log('--- By section (gap = violations to clear to publish every non-thin unit) ---');
  console.log(`  ${pad('course', 24)}${pad('sec', 5)}${pad('title', 40)}${pad('units', 7)}${pad('idx', 5)}${pad('gap', 7)}`);
  const ordered = [...sections].sort((a, b) => a.courseId.localeCompare(b.courseId) || a.sectionIndex - b.sectionIndex);
  for (const roll of ordered) {
    const flag = isSectionIndexable(roll) ? 'PUBLISHABLE' : '';
    console.log(
      `  ${pad(roll.courseId, 24)}${pad(roll.sectionIndex, 5)}${pad(sectionLabel(roll).slice(0, 38), 40)}` +
      `${pad(roll.total, 7)}${pad(roll.indexable, 5)}${pad(roll.gap, 7)}${flag}`,
    );
  }

  const merged = ordered.filter((r) => r.sectionIndex > 0 && r.titles.size > 1);
  for (const roll of merged) {
    console.log(`  NOTE ${roll.courseId} sectionIndex ${roll.sectionIndex} spans ${roll.titles.size} sectionTitles, so one section URL would merge them.`);
  }
  console.log('');
}

function printUnlockQueue(audits: CourseAudit[]): void {
  const all = audits.flatMap((a) => a.units);
  const thin = all.filter(isThin);
  const fixable = all.filter((u) => !evaluatePage(u).indexable && !isThin(u));
  const indexable = all.length - thin.length - fixable.length;
  const totalGap = fixable.reduce((n, u) => n + violationGap(u), 0);

  console.log('--- What it would take ---');
  console.log(`  ${totalGap} violations stand between ${fixable.length} units and publication.`);
  console.log(`  Clearing all of them moves ${indexable} / ${all.length} indexable units to ${all.length - thin.length} / ${all.length}.`);
  console.log(`  The other ${thin.length} units are too thin to publish at any QA score; they need writing, not fixing.\n`);

  const candidates = [...fixable]
    .sort((a, b) => violationGap(a) - violationGap(b))
    .slice(0, UNLOCK_QUEUE_SIZE);

  console.log(`--- Cheapest ${UNLOCK_QUEUE_SIZE} units to unlock (fix these first) ---`);
  console.log(`  ${pad('unit', 22)}${pad('course', 20)}${pad('violations to clear', 22)}${pad('words', 8)}`);
  for (const unit of candidates) {
    console.log(`  ${pad(unit.unitId, 22)}${pad(unit.courseId, 20)}${pad(violationGap(unit), 22)}${pad(unit.pageWords, 8)}`);
  }
  console.log('');
}

// ─── Main ──────────────────────────────────────────────────

async function main(): Promise<void> {
  const write = process.argv.includes('--write');
  const check = process.argv.includes('--check');

  const audits: CourseAudit[] = [];
  const unitTitles = new Map<string, string>();

  for (const profession of PROFESSIONS) {
    const units = await loadUnits(profession.id);
    for (const unit of units) unitTitles.set(`${profession.id}/${unit.id}`, unit.sectionTitle ?? unit.title);
    audits.push(scoreCourse(profession.id, profession.name, units));
  }

  const manifest = buildManifest(audits);
  const sections = rollUpSections(audits, unitTitles);

  printGate();
  printTotals(audits, sections);
  printCourses(audits);
  printSections(sections);
  printUnlockQueue(audits);

  const existing = readManifest();
  const stale = existing?.contentHash !== manifest.contentHash;

  if (write) {
    writeManifest(manifest);
    console.log(`Manifest written: ${MANIFEST_PATH} (hash ${manifest.contentHash})`);
    return;
  }

  console.log(`Manifest hash on disk: ${existing?.contentHash ?? 'missing'} | measured: ${manifest.contentHash}`);
  if (stale) {
    console.log('Manifest is STALE. Run: npx tsx scripts/seo-index-audit.ts --write');
    if (check) process.exit(1);
  }
}

main().catch((err) => {
  console.error('SEO index audit failed:', err);
  process.exit(1);
});
