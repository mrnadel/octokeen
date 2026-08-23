import { buildCourseTree, type SeoCourseNode, type SeoSectionNode, type SeoUnitNode } from './course-tree';

/** A resolved `/learn` URL, from the course down to whichever level was asked for. */
export interface ResolvedCoursePath {
  course: SeoCourseNode;
  section?: SeoSectionNode;
  unit?: SeoUnitNode;
}

/**
 * The tree is derived from static imports, so it is stable for the life of the
 * process. Building it walks every unit in every course, which is wasteful to
 * repeat once per rendered page, so memoize it here.
 */
let cachedTree: SeoCourseNode[] | null = null;

export function getPublicCourseTree(): SeoCourseNode[] {
  cachedTree ??= buildCourseTree();
  return cachedTree;
}

export function findCourseBySlug(courseSlug: string): SeoCourseNode | null {
  return getPublicCourseTree().find(course => course.slug === courseSlug) ?? null;
}

export function findSectionBySlug(courseSlug: string, sectionSlug: string): ResolvedCoursePath | null {
  const course = findCourseBySlug(courseSlug);
  const section = course?.sections.find(candidate => candidate.slug === sectionSlug);
  return course && section ? { course, section } : null;
}

export function findUnitBySlug(
  courseSlug: string,
  sectionSlug: string,
  unitSlug: string
): ResolvedCoursePath | null {
  const resolved = findSectionBySlug(courseSlug, sectionSlug);
  const unit = resolved?.section?.units.find(candidate => candidate.slug === unitSlug);
  return resolved && unit ? { ...resolved, unit } : null;
}

/** Flat list of every unit node, for `generateStaticParams` and audits. */
export function listAllUnitNodes(): { course: SeoCourseNode; section: SeoSectionNode; unit: SeoUnitNode }[] {
  return getPublicCourseTree().flatMap(course =>
    course.sections.flatMap(section => section.units.map(unit => ({ course, section, unit })))
  );
}
