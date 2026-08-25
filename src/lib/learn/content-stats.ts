import { getPublicCourseTree } from '@/lib/seo/course-lookup';
import { isIndexable } from '@/lib/seo/indexable';

import { listGuideRoutes } from './routes';

/**
 * Counts for the copy on `/about`, read from the same modules the routes and
 * the sitemap read.
 *
 * The page makes claims about how much of the corpus is published and how much
 * is held back, and a claim like that goes stale the moment content changes.
 * Deriving it means the page states what is true when it is built rather than
 * what was true when it was written.
 *
 * Server-only: `isIndexable` reads a manifest that must not reach a client bundle.
 */
export interface PublishedContentStats {
  courses: number;
  units: number;
  lessons: number;
  /** Units clearing the quality gate in `src/lib/seo/indexable.ts`. */
  indexableUnits: number;
  /** Hand-assembled `/learn` guides with a public URL. */
  guides: number;
}

export function getPublishedContentStats(): PublishedContentStats {
  const courses = getPublicCourseTree();
  const units = courses.flatMap(course =>
    course.sections.flatMap(section =>
      section.units.map(unit => ({ courseId: course.courseId, unitId: unit.unitId }))
    )
  );

  return {
    courses: courses.length,
    units: units.length,
    lessons: courses.reduce((total, course) => total + course.lessonCount, 0),
    indexableUnits: units.filter(unit => isIndexable({ kind: 'unit', ...unit })).length,
    guides: listGuideRoutes().length,
  };
}
