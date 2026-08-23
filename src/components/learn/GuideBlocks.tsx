import { Check } from 'lucide-react';

import type { GuideBlock } from '@/data/learn/types';

import { GuideCallout, GuideSteps, GuideTable } from './GuideBlockParts';
import { InlineText } from './InlineText';

const PARAGRAPH = 'my-4 text-[0.9375rem] leading-7 text-surface-600 dark:text-surface-300 sm:text-base sm:leading-8';
const H2 = 'mt-10 mb-3 text-xl font-extrabold leading-snug text-surface-900 dark:text-surface-50 sm:text-2xl';
const H3 = 'mt-8 mb-2 text-base font-extrabold text-surface-900 dark:text-surface-50 sm:text-lg';

function slugForHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function GuideBlockView({ block }: { block: GuideBlock }) {
  switch (block.kind) {
    case 'heading': {
      const id = slugForHeading(block.text);
      return block.level === 3 ? (
        <h3 id={id} className={H3}>{block.text}</h3>
      ) : (
        <h2 id={id} className={H2}>{block.text}</h2>
      );
    }

    case 'paragraph':
      return <p className={PARAGRAPH}><InlineText text={block.text} /></p>;

    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag
          className={`my-4 space-y-2 pl-5 text-[0.9375rem] leading-7 text-surface-600 dark:text-surface-300 sm:text-base ${
            block.ordered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {block.items.map(item => (
            <li key={item} className="pl-1 marker:text-primary-500">
              <InlineText text={item} />
            </li>
          ))}
        </ListTag>
      );
    }

    case 'steps':
      return <GuideSteps items={block.items} />;

    case 'table':
      return <GuideTable columns={block.columns} rows={block.rows} caption={block.caption} />;

    case 'callout':
      return <GuideCallout tone={block.tone} title={block.title} text={block.text} />;

    case 'takeaways':
      return (
        <section className="my-8 rounded-2xl border-2 border-surface-200 bg-surface-50 p-4 dark:border-surface-800 dark:bg-surface-900 sm:p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-surface-500">
            Key takeaways
          </h2>
          <ul className="mt-3 space-y-3">
            {block.items.map(item => (
              <li key={item} className="flex gap-2.5 text-[0.9375rem] leading-7 text-surface-700 dark:text-surface-300">
                <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                <span><InlineText text={item} /></span>
              </li>
            ))}
          </ul>
        </section>
      );
  }
}

/**
 * Renders a guide or course body. Server component by design: this is the
 * prose search engines have to see in the initial HTML, so nothing here may
 * become a client component.
 */
export function GuideBlocks({ blocks }: { blocks: readonly GuideBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <GuideBlockView key={index} block={block} />
      ))}
    </>
  );
}
