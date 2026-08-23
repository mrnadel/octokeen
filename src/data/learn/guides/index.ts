import type { LearnGuide } from '../types';
import { sunkCostFallacyGuide } from './sunk-cost-fallacy';

/**
 * Every published guide, in the order they were written.
 *
 * To add one: create a sibling file exporting a `LearnGuide`, import it here,
 * and append it to this array. Nothing else changes. `src/lib/learn/guide-routes.ts`
 * turns the registry into URLs, the `/learn` routes read it, and the sitemap
 * reads it, so a guide is live the moment it appears in this list.
 *
 * Guides are deliberately hand-written and few. `docs/seo/search-demand.md` §5
 * measures the question bank at roughly 321 words per psychology lesson, which
 * is thin-content territory; publishing generated pages at scale would put the
 * whole domain at risk. Quality bar over volume, every time.
 */
export const LEARN_GUIDES: readonly LearnGuide[] = [sunkCostFallacyGuide];

/** Lookup by id string so callers holding a course node need no type assertion. */
export function listGuidesForCourse(courseId: string): LearnGuide[] {
  return LEARN_GUIDES.filter(guide => guide.courseId === courseId);
}

export function findGuide(courseId: string, slug: string): LearnGuide | null {
  return LEARN_GUIDES.find(guide => guide.courseId === courseId && guide.slug === slug) ?? null;
}
