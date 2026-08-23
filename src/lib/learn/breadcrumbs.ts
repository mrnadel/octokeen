import type { BreadcrumbItem } from '@/lib/seo/structured-data';

import { LEARN_HUB_PATH, type GuideRoute, type PublishedCourse } from './routes';

/**
 * One trail per page depth. `LearnBreadcrumbs` renders these and
 * `buildBreadcrumbJsonLd` serializes the same array, so the visible trail and
 * the structured data can never describe different hierarchies.
 */
const HOME: BreadcrumbItem = { name: 'Home', path: '/' };
const LEARN: BreadcrumbItem = { name: 'Learn', path: LEARN_HUB_PATH };

export function hubCrumbs(): BreadcrumbItem[] {
  return [HOME, LEARN];
}

export function courseCrumbs({ course, intro }: PublishedCourse): BreadcrumbItem[] {
  return [HOME, LEARN, { name: intro.title, path: course.path }];
}

export function guideCrumbs(route: GuideRoute): BreadcrumbItem[] {
  return [...courseCrumbs(route), { name: route.guide.title, path: route.path }];
}
