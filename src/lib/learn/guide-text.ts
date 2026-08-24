import type { GuideBlock, LearnGuide } from '@/data/learn/types';

import { toPlainText } from './guide-markup';

/** Words a reader gets through in a minute. Used only for the reading-time hint. */
const WORDS_PER_MINUTE = 220;

/** Counts what a reader reads, so markup never inflates the figure. */
function countWords(parts: string[]): number {
  return toPlainText(parts.join(' ')).split(/\s+/).filter(Boolean).length;
}

/** Every string a block renders as prose, headings and table cells included. */
function blockText(block: GuideBlock): string[] {
  switch (block.kind) {
    case 'heading':
      return [block.text];
    case 'paragraph':
      return [block.text];
    case 'list':
    case 'takeaways':
      return [...block.items];
    case 'steps':
      return block.items.flatMap(item => [item.title, item.text]);
    case 'table':
      return [block.caption ?? '', ...block.columns, ...block.rows.flat()];
    case 'callout':
      return [block.title, block.text];
  }
}

/**
 * Words the guide renders as prose, excluding the quiz.
 *
 * This is the number `docs/seo/search-demand.md` §5 is about: the written
 * answer has to stand on its own, so the quiz does not count toward it.
 */
export function countGuideWords(guide: LearnGuide): number {
  return countWords([guide.answer, ...guide.body.flatMap(blockText)]);
}

/**
 * Words the quiz renders. Rendered server-side like everything else, so this
 * is real indexable text, but it is not the written answer and never counts
 * toward `countGuideWords`.
 */
export function countGuideQuizWords(guide: LearnGuide): number {
  return countWords(
    guide.quiz.flatMap(question => [
      question.prompt,
      question.scenario ?? '',
      question.explanation,
      ...question.options,
    ])
  );
}

export function guideReadingMinutes(guide: LearnGuide): number {
  return Math.max(1, Math.round(countGuideWords(guide) / WORDS_PER_MINUTE));
}
