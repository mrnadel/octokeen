import { findCourseIntro, type LearnCourseIntro } from '@/data/learn/courses';
import { LEARN_GUIDES, listGuidesForCourse } from '@/data/learn/guides';
import type { LearnGuide } from '@/data/learn/types';

import { findCourseBySlug, getPublicCourseTree } from '@/lib/seo/course-lookup';
import { LEARN_ROOT, type SeoCourseNode } from '@/lib/seo/course-tree';
import { joinPath } from '@/lib/seo/urls';

/**
 * Every URL the `/learn` section publishes.
 *
 * This is the join between the content in `src/data/learn/` and the course
 * tree in `src/lib/seo/`. The tree owns course slugs and the sitemap reads the
 * same functions the route handlers do, so an advertised URL always resolves.
 *
 * Only three route shapes exist: the hub, one page per course that has
 * editorial copy, and one page per registered guide. Section and unit paths
 * exist in the tree but have no routes; see `src/app/sitemap.ts`.
 */
export const LEARN_HUB_PATH = joinPath(LEARN_ROOT);

/** A public course that has hand-written copy, and so has a page. */
export interface PublishedCourse {
  course: SeoCourseNode;
  intro: LearnCourseIntro;
}

export interface GuideRoute extends PublishedCourse {
  guide: LearnGuide;
  /** Normalized path, e.g. `/learn/psychology/sunk-cost-fallacy`. */
  path: string;
}

function toRoute(published: PublishedCourse, guide: LearnGuide): GuideRoute {
  return { ...published, guide, path: joinPath(published.course.path, guide.slug) };
}

function toPublished(course: SeoCourseNode): PublishedCourse | null {
  const intro = findCourseIntro(course.courseId);
  return intro ? { course, intro } : null;
}

/** Courses with a page. A public course lacking an intro renders nothing. */
export function listPublishedCourses(): PublishedCourse[] {
  return getPublicCourseTree().flatMap(course => {
    const published = toPublished(course);
    return published ? [published] : [];
  });
}

/** Resolves a `/learn/[course]` request. Null when the course has no copy. */
export function resolvePublishedCourse(courseSlug: string): PublishedCourse | null {
  const course = findCourseBySlug(courseSlug);
  return course ? toPublished(course) : null;
}

/** Every guide with a resolvable URL. Drives `generateStaticParams` and the sitemap. */
export function listGuideRoutes(): GuideRoute[] {
  const byCourseId = new Map(listPublishedCourses().map(entry => [entry.course.courseId, entry]));
  return LEARN_GUIDES.flatMap(guide => {
    const published = byCourseId.get(guide.courseId);
    return published ? [toRoute(published, guide)] : [];
  });
}

/** Guides published under one course, for the course page's guide list. */
export function listCourseGuideRoutes(published: PublishedCourse): GuideRoute[] {
  return listGuidesForCourse(published.course.courseId).map(guide => toRoute(published, guide));
}

/** Resolves a `/learn/[course]/[guide]` request. Returns null for anything else. */
export function resolveGuideRoute(courseSlug: string, guideSlug: string): GuideRoute | null {
  const published = resolvePublishedCourse(courseSlug);
  if (!published) return null;
  const guide = listGuidesForCourse(published.course.courseId).find(
    candidate => candidate.slug === guideSlug
  );
  return guide ? toRoute(published, guide) : null;
}
