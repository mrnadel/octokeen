import { getCourseMetaForProfession } from '@/data/course/course-meta';
import type { Unit } from '@/data/course/types';
import { PROFESSIONS, type Profession } from '@/data/professions';

import { resolveUniqueSlugs, slugify, type Sluggable } from './slugs';
import { joinPath } from './urls';

/** Root segment for every public content route. */
export const LEARN_ROOT = 'learn';

export interface SeoUnitNode {
  unitId: string;
  title: string;
  description: string;
  lessonCount: number;
  slug: string;
  path: string;
}

export interface SeoSectionNode {
  sectionId: string;
  title: string;
  slug: string;
  path: string;
  /**
   * `sectionIndex` from the underlying units, when they carry one. Exposed for
   * consumers that key on the index rather than the title. Not unique: the
   * content data currently reuses one index across two titled sections per
   * course, so two sections can report the same index.
   */
  sectionIndex?: number;
  units: SeoUnitNode[];
}

export interface SeoCourseNode {
  courseId: string;
  name: string;
  description: string;
  slug: string;
  path: string;
  sections: SeoSectionNode[];
  unitCount: number;
  lessonCount: number;
}

export interface CourseTreeOptions {
  /** Include courses behind `requiresAccess`. Off by default: gated content must not be indexed. */
  includeGated?: boolean;
  /** Include courses flagged `isComingSoon`. Off by default: they have no content yet. */
  includeComingSoon?: boolean;
}

/**
 * Section a unit belongs to. Falls back to topic, then to a single bucket.
 *
 * Grouping is keyed on `sectionTitle`, not `sectionIndex`. Every course
 * currently has one `sectionIndex` shared by two differently titled sections,
 * so keying on the index would silently merge two sections into one URL and
 * drop a page. The title is what the slug is built from, so it is also the
 * honest grouping key.
 */
function sectionKeyFor(unit: Unit): Sluggable {
  const title = unit.sectionTitle?.trim();
  if (title) return { id: `section:${title}`, title };
  if (unit.topicId) return { id: `topic:${unit.topicId}`, title: unit.topicId.replace(/-/g, ' ') };
  return { id: 'overview', title: 'Overview' };
}

function isPublicCourse(course: Profession, options: CourseTreeOptions): boolean {
  if (course.requiresAccess && !options.includeGated) return false;
  if (course.isComingSoon && !options.includeComingSoon) return false;
  return true;
}

function groupUnitsBySection(units: readonly Unit[]): Map<string, { key: Sluggable; units: Unit[] }> {
  const grouped = new Map<string, { key: Sluggable; units: Unit[] }>();
  for (const unit of units) {
    const key = sectionKeyFor(unit);
    const existing = grouped.get(key.id);
    if (existing) existing.units.push(unit);
    else grouped.set(key.id, { key, units: [unit] });
  }
  return grouped;
}

function buildUnitNodes(units: readonly Unit[], sectionPath: string): SeoUnitNode[] {
  const slugs = resolveUniqueSlugs(units.map(unit => ({ id: unit.id, title: unit.title })));
  return units.map(unit => {
    const slug = slugs.get(unit.id) ?? slugify(unit.id);
    return {
      unitId: unit.id,
      title: unit.title,
      description: unit.description,
      lessonCount: unit.lessons.length,
      slug,
      path: joinPath(sectionPath, slug),
    };
  });
}

function buildSectionNodes(units: readonly Unit[], coursePath: string): SeoSectionNode[] {
  const grouped = groupUnitsBySection(units);
  const slugs = resolveUniqueSlugs([...grouped.values()].map(entry => entry.key));

  return [...grouped.values()].map(({ key, units: sectionUnits }) => {
    const slug = slugs.get(key.id) ?? slugify(key.id);
    const path = joinPath(coursePath, slug);
    return {
      sectionId: key.id,
      title: key.title,
      slug,
      path,
      sectionIndex: sectionUnits[0]?.sectionIndex,
      units: buildUnitNodes(sectionUnits, path),
    };
  });
}

/**
 * Enumerates every public course as course -> section -> unit, with the exact
 * URL path each level is published under. This is the single source of truth
 * for `/learn` URLs: the sitemap and the route handlers both read it, so they
 * cannot drift apart.
 */
export function buildCourseTree(options: CourseTreeOptions = {}): SeoCourseNode[] {
  return PROFESSIONS.filter(course => isPublicCourse(course, options)).map(course => {
    const units = getCourseMetaForProfession(course.id);
    const slug = slugify(course.id);
    const path = joinPath(LEARN_ROOT, slug);
    const sections = buildSectionNodes(units, path);

    return {
      courseId: course.id,
      name: course.name,
      description: course.description,
      slug,
      path,
      sections,
      unitCount: units.length,
      lessonCount: units.reduce((total, unit) => total + unit.lessons.length, 0),
    };
  });
}
