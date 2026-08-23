import { buildCourseJsonLd, type JsonLdNode } from '@/lib/seo/structured-data';

import type { PublishedCourse } from './routes';

/**
 * Section titles are real course data, so they are honest `teaches` values.
 * Capped because the whole list is long and adds nothing after the first dozen.
 */
const MAX_TEACHES = 12;

/**
 * The `Course` node for a subject, built the same way wherever it appears.
 *
 * Both `/learn/[course]` and every guide beneath it emit this node, and
 * `buildCourseJsonLd` keys it on the course URL, so the two pages would be
 * declaring the same `@id` with different contents if each built its own.
 * Building it here keeps one `@id` describing one thing.
 */
export function buildLearnCourseJsonLd({ course, intro }: PublishedCourse): JsonLdNode {
  return buildCourseJsonLd({
    name: course.name,
    description: intro.metaDescription,
    path: course.path,
    teaches: course.sections.slice(0, MAX_TEACHES).map(section => section.title),
  });
}
