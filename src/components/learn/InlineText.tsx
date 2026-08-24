import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

import { resolveGuideSlug } from '@/lib/learn/guide-links';

/** `**bold**` in groups 1, or `[[guide-slug|anchor text]]` in groups 2 and 3. */
const MARKUP = /\*\*(.+?)\*\*|\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g;

const BOLD = 'font-extrabold text-surface-900 dark:text-surface-100';
const LINK =
  'font-bold text-primary-700 underline decoration-primary-300 underline-offset-2 hover:decoration-primary-600 dark:text-primary-300 dark:decoration-primary-700';

/**
 * A cross-guide link, or its anchor text alone when the slug resolves to
 * nothing. Rendering the words rather than a broken href means a stale slug
 * degrades to plain prose instead of sending a reader to a 404;
 * `learn-links.test.ts` is what actually stops one shipping.
 */
function GuideLink({ slug, anchor }: { slug: string; anchor: string }): ReactNode {
  const route = resolveGuideSlug(slug);
  if (!route) {
    console.error(`Guide link markup references an unknown guide slug: ${slug}`);
    return anchor;
  }
  return (
    <Link href={route.path} className={LINK}>
      {anchor}
    </Link>
  );
}

/**
 * Renders guide copy with the inline markup the authoring format allows:
 * `**bold**` and `[[guide-slug|anchor text]]`. Everything else is emitted as
 * text, so guide data can never introduce markup and no
 * `dangerouslySetInnerHTML` is involved.
 *
 * Server component by design. It reads the guide registry to turn a slug into
 * a path, so importing it from a client component would pull every guide's
 * prose into a browser bundle.
 */
export function InlineText({ text }: { text: string }): ReactNode {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(MARKUP)) {
    const [whole, bold, slug, anchor] = match;
    const start = match.index;
    if (start > cursor) {
      nodes.push(<Fragment key={cursor}>{text.slice(cursor, start)}</Fragment>);
    }
    nodes.push(
      bold === undefined ? (
        <GuideLink key={start} slug={slug} anchor={anchor} />
      ) : (
        <strong key={start} className={BOLD}>
          {bold}
        </strong>
      )
    );
    cursor = start + whole.length;
  }

  if (cursor < text.length) {
    nodes.push(<Fragment key={cursor}>{text.slice(cursor)}</Fragment>);
  }
  return nodes;
}
