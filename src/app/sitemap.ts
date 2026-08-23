import { MetadataRoute } from 'next';

import type { IndexabilityPredicate } from '@/lib/seo/sitemap-entries';
import { buildSitemapEntries } from '@/lib/seo/sitemap-entries';

/**
 * Generated sitemap: static marketing pages, the `/learn` hub, one page per
 * public course, and every hand-written guide. URLs come from
 * `@/lib/seo/course-tree` and `@/lib/learn/routes`, the same modules the
 * `/learn` routes read, so the sitemap cannot advertise a path that does not
 * resolve.
 *
 * Courses with `requiresAccess` are excluded upstream and must stay excluded.
 *
 * A sitemap file caps at 50,000 URLs. Filtered, this emits a few dozen; if the
 * count ever approaches the cap, split it into `generateSitemaps()` shards
 * rather than trimming URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries({ isIndexable: hasPublishedRoute });
}

/**
 * Drops candidates for routes that do not exist.
 *
 * `buildSitemapCandidates` still enumerates `section` and `unit` URLs from the
 * course tree, but no route renders them, so listing them would advertise
 * roughly 600 URLs that all 404. They are suppressed here rather than removed
 * from the tree for two reasons:
 *
 * 1. The tree is the shared source of truth for `/learn` paths, and
 *    `@/lib/seo/indexable.ts` already grades unit content quality against it.
 * 2. `docs/seo/search-demand.md` §5 measures a unit page at roughly 321 words,
 *    which is thin content. Even once unit routes exist, they should pass
 *    `isIndexable({ kind: 'unit', ... })` before they are listed here, not be
 *    admitted wholesale.
 *
 * To publish section or unit pages later: build the routes, then replace the
 * corresponding `false` below with the content-quality check from
 * `@/lib/seo/indexable.ts`. Keeping a URL out of the sitemap is not the same as
 * `noindex`, so a page that must never be indexed also needs
 * `robots: { index: false }` in its own metadata.
 */
const hasPublishedRoute: IndexabilityPredicate = candidate => {
  switch (candidate.kind) {
    case 'static':
    case 'course':
    case 'guide':
      return true;
    case 'section':
    case 'unit':
      return false;
  }
};
