/**
 * Content QA Automation Script
 *
 * Checks all course content for violations of the writing guide rules.
 * Run with: npx tsx scripts/qa-content.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { course } from '../src/data/course';
import type { Unit } from '../src/data/course/types';
import { runContentQA, type QAViolation, type CourseInput } from '../src/lib/content-qa';

// ─── Types ──────────────────────────────────────────────────

interface CourseEntry {
  id: string;
  name: string;
  units: Unit[];
  dir: string;
}

// ─── Load courses ───────────────────────────────────────────

function isUnit(val: unknown): val is Unit {
  return (
    typeof val === 'object' &&
    val !== null &&
    'id' in val &&
    'title' in val &&
    'lessons' in val &&
    Array.isArray((val as Unit).lessons)
  );
}

/**
 * Orders `section-<n>-<name>-part<n>.ts` by section number, then part number, so QA
 * walks a course in the order a learner does.
 */
function compareSectionFiles(a: string, b: string): number {
  const parse = (f: string) => ({
    section: parseInt(f.match(/section-(\d+)/)?.[1] ?? '0', 10),
    part: parseInt(f.match(/part(\d+)/)?.[1] ?? '0', 10),
  });
  const pa = parse(a);
  const pb = parse(b);
  return pa.section - pb.section || pa.part - pb.part || a.localeCompare(b);
}

function compareUnitFiles(a: string, b: string): number {
  const num = (f: string) => parseInt(f.match(/unit-(\d+)/)?.[1] ?? '0', 10);
  return num(a) - num(b);
}

/**
 * Loads a course's units from disk.
 *
 * Courses ship their content one of two ways: legacy `unit-<n>.ts` files that each
 * export a single Unit, or `section-<n>-<name>-part<n>.ts` files that export an array
 * of Units. Where both exist the section files are the live content — `course-meta.ts`
 * imports only those, and the `unit-<n>.ts` files are abandoned earlier drafts. Scanning
 * the stale ones instead of the live ones silently reports a clean bill of health for
 * content nobody is checking, so prefer section files whenever a course has them.
 */
async function loadProfessionUnits(professionDir: string, sourceByUnitId: Map<string, string>): Promise<Unit[]> {
  const unitsDir = path.join(professionDir, 'units');
  if (!fs.existsSync(unitsDir)) return [];

  const allFiles = fs.readdirSync(unitsDir).filter(f => f.endsWith('.ts'));
  const sectionFiles = allFiles.filter(f => f.startsWith('section-')).sort(compareSectionFiles);
  const contentFiles = sectionFiles.length > 0
    ? sectionFiles
    : allFiles.filter(f => f.startsWith('unit-')).sort(compareUnitFiles);

  const units: Unit[] = [];
  for (const file of contentFiles) {
    const filePath = path.join(unitsDir, file);
    const mod = await import(pathToFileURL(filePath).href);

    for (const key of Object.keys(mod)) {
      const exported = mod[key];
      const found = Array.isArray(exported)
        ? exported.filter(isUnit)
        : isUnit(exported) ? [exported] : [];

      for (const unit of found) {
        units.push(unit);
        sourceByUnitId.set(unit.id, filePath);
      }
    }
  }
  return units;
}

function discoverProfessions(): { id: string; name: string; dir: string }[] {
  const professionsDir = path.resolve(__dirname, '../src/data/course/professions');
  if (!fs.existsSync(professionsDir)) return [];

  return fs.readdirSync(professionsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => ({
      id: d.name,
      name: d.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      dir: path.join(professionsDir, d.name),
    }));
}

async function loadAllCourses(sourceByUnitId: Map<string, string>): Promise<CourseEntry[]> {
  const courses: CourseEntry[] = [];

  // ME course (main)
  courses.push({
    id: 'mechanical-engineering',
    name: 'ME',
    units: course,
    dir: path.resolve(__dirname, '../src/data/course/units'),
  });

  // Profession courses
  const professions = discoverProfessions();
  for (const prof of professions) {
    const units = await loadProfessionUnits(prof.dir, sourceByUnitId);
    if (units.length > 0) {
      courses.push({
        id: prof.id,
        name: prof.name,
        units,
        dir: path.join(prof.dir, 'units'),
      });
    }
  }

  return courses;
}

// ─── Helper: resolve file for a unit ────────────────────────

/**
 * Units are recorded against their source file at load time. Section files hold
 * several units each and are named for the section rather than the unit, so there is
 * no reliable way to work the path back out from a unit id — it has to be remembered.
 */
function resolveUnitFile(
  unitId: string | undefined,
  sourceByUnitId: Map<string, string>,
  fallbackDir: string,
): string {
  if (unitId) {
    const known = sourceByUnitId.get(unitId);
    if (known) return known;
  }
  return fallbackDir;
}

// ─── Main ───────────────────────────────────────────────────

async function main() {
  console.log('=== Content QA Check ===\n');

  const sourceByUnitId = new Map<string, string>();
  const courses = await loadAllCourses(sourceByUnitId);
  console.log(`Loaded ${courses.length} courses: ${courses.map(c => c.name).join(', ')}\n`);

  // Map to CourseInput for the shared QA module
  const courseInputs: CourseInput[] = courses.map(c => ({
    id: c.id,
    name: c.name,
    units: c.units,
  }));

  const violations = runContentQA(courseInputs);

  // Print violations grouped by course
  if (violations.length > 0) {
    const byCourse = new Map<string, QAViolation[]>();
    for (const v of violations) {
      const list = byCourse.get(v.courseName) || [];
      list.push(v);
      byCourse.set(v.courseName, list);
    }

    for (const [courseName, courseViolations] of byCourse) {
      console.log(`--- ${courseName} (${courseViolations.length} violations) ---`);
      for (const v of courseViolations) {
        const courseEntry = courses.find(c => c.name === v.courseName);
        let file = v.courseId;
        if (courseEntry) {
          // Find the unit that contains this violation to resolve the file
          const unit = courseEntry.units.find(u => u.title === v.unitTitle);
          file = resolveUnitFile(unit?.id, sourceByUnitId, courseEntry.dir);
        }
        console.log(`  [${v.check}] ${v.questionId} | ${v.message}`);
        console.log(`    File: ${file}`);
      }
      console.log('');
    }
  }

  // Summary
  const courseCount = courses.length;
  console.log('=== Summary ===');
  console.log(`${violations.length} violations found across ${courseCount} courses`);

  if (violations.length > 0) {
    // Breakdown by check
    const byCheck = new Map<string, number>();
    for (const v of violations) {
      byCheck.set(v.check, (byCheck.get(v.check) || 0) + 1);
    }
    console.log('\nBreakdown by check:');
    for (const [check, count] of [...byCheck.entries()].sort()) {
      console.log(`  ${check}: ${count}`);
    }

    process.exit(1);
  } else {
    console.log('All content passes QA checks.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('QA script failed:', err);
  process.exit(1);
});
