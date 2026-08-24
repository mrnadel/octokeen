import { buildMetadata } from '@/lib/seo/metadata';

/**
 * `/try` is deliberately kept out of the index.
 *
 * It used to be a crawlable duplicate of the homepage: 200, no `noindex`, the
 * homepage's exact `<title>`, and a canonical pointing at `/`. That is three
 * contradictory signals about one URL, so it had to become one thing or the
 * other. Indexed was the losing option:
 *
 * - Its value is the lesson itself, which is client-side. The server-rendered
 *   page is a heading and a subject picker, far under the 300-word floor this
 *   project sets in `src/lib/seo/indexable.ts`. Asking Google to index it means
 *   asking it to index a page we would reject under our own quality gate.
 * - Every query it could win is already covered by a page with real prose that
 *   links here: the homepage, `/learn`, and each `/learn/[course]` page ends
 *   with "Try a free lesson".
 * - It is the primary conversion surface, and conversion pages earn their
 *   traffic from those pages rather than from their own ranking.
 *
 * So: `noindex, follow`, a self-referencing canonical instead of one pointing
 * at `/`, its own title, and no sitemap entry (see
 * `src/lib/seo/sitemap-entries.ts`). `follow` matters, because the demo links
 * on to `/get-started` and crawl equity should keep moving.
 */
export const metadata = buildMetadata({
  title: 'Try a free lesson',
  description:
    'Pick a subject and play a real Octokeen lesson in your browser. No account, no card, about five minutes.',
  path: '/try',
  noIndex: true,
});

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
