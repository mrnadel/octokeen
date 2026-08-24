import type { LearnGuide } from '@/data/learn/types';

import { listRelatedGuideLinks } from '@/lib/learn/guide-links';
import { guideReadingMinutes } from '@/lib/learn/guide-text';

import { LearnLinkCard } from './LearnLinkCard';

/**
 * The links out of a guide and across to its siblings.
 *
 * Sits inside the article, above the quiz, rather than in a strip at the very
 * bottom: these are a genuine next read for someone who finished the prose,
 * and links buried under a call to action are treated as boilerplate by both
 * readers and crawlers.
 *
 * The anchor text is always the target guide's title, so it describes the
 * destination and cannot drift; the guide that declared the relation supplies
 * only the sentence underneath it.
 */
export function GuideRelated({ guide }: { guide: LearnGuide }) {
  const related = listRelatedGuideLinks(guide);
  if (related.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-extrabold text-surface-900 dark:text-surface-50 sm:text-2xl">
        Related guides
      </h2>
      <ul className="space-y-3">
        {related.map(({ route, reason }) => (
          <LearnLinkCard
            key={route.path}
            href={route.path}
            title={route.guide.title}
            description={reason}
            meta={`${guideReadingMinutes(route.guide)} min read`}
          />
        ))}
      </ul>
    </section>
  );
}
