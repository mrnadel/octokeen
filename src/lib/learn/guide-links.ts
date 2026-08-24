import type { GuideRelation, LearnGuide } from '@/data/learn/types';

import { listGuideRoutes, type GuideRoute } from './routes';

/**
 * Turning a guide slug into a link.
 *
 * Two things in the content layer point at a guide by slug and nothing else:
 * the `related` array on `LearnGuide`, and the `[[slug|anchor text]]` markup
 * inside `GuideRichText`. Both resolve here, so a guide author never writes a
 * `/learn/...` path by hand and a course slug can be renamed without leaving
 * dead links behind in twelve files.
 *
 * Server-side only in practice. Everything that reads these functions renders
 * on the server, which matters: resolving here pulls the whole guide registry
 * in, and that must not reach a browser bundle. See the note in
 * `src/data/learn/featured.ts` for the one place that has to avoid it.
 */

let cache: Map<string, GuideRoute> | null = null;

/**
 * Slugs are unique across every course, not just within one, which is what
 * lets a relation and a link name a guide by slug alone. `learn-links.test.ts`
 * holds that invariant.
 */
function bySlug(): Map<string, GuideRoute> {
  cache ??= new Map(listGuideRoutes().map(route => [route.guide.slug, route]));
  return cache;
}

/** The route a slug names, or null when no guide answers to it. */
export function resolveGuideSlug(slug: string): GuideRoute | null {
  return bySlug().get(slug) ?? null;
}

export interface RelatedGuideLink {
  route: GuideRoute;
  /** The `reason` the declaring guide gave, rendered as the card body. */
  reason: string;
}

/**
 * The related guides of one guide, in declared order, skipping any slug that
 * no longer resolves. A test fails on that case; rendering simply drops it so
 * a stale slug can never become a link to a 404.
 */
export function listRelatedGuideLinks(guide: LearnGuide): RelatedGuideLink[] {
  return guide.related.flatMap(({ slug, reason }: GuideRelation) => {
    const route = resolveGuideSlug(slug);
    return route ? [{ route, reason }] : [];
  });
}
