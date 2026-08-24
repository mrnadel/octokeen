import type { ProfessionId } from '@/data/professions';

/**
 * Authoring types for the public `/learn` content surface.
 *
 * A guide is data, not JSX. Adding a guide means adding one file under
 * `src/data/learn/guides/` and registering it in `guides/index.ts`; no route or
 * component is touched. Keep it that way: anything a single guide needs that
 * this file cannot express belongs here as a new block kind, so every later
 * guide gets it too.
 */

/**
 * Plain text with two pieces of inline markup, and nothing else:
 *
 * - `**bold**`
 * - `[[guide-slug|anchor text]]`, a link to another published guide
 *
 * The slug in a link is resolved against the guide registry when the page
 * renders, so the path is never written out by hand and never goes stale when
 * a course slug changes. A slug no guide answers to fails
 * `src/__tests__/lib/learn-links.test.ts`, so the markup cannot ship a dead
 * link. Write the anchor text so it describes where the reader lands.
 *
 * No HTML is parsed, so guide copy can never inject markup. See `InlineText`
 * in `src/components/learn/InlineText.tsx`.
 */
export type GuideRichText = string;

export type GuideCalloutTone = 'insight' | 'warning' | 'example';

/** One rendered section of a guide body. Rendered in array order. */
export type GuideBlock =
  | { kind: 'heading'; text: string; level?: 2 | 3 }
  | { kind: 'paragraph'; text: GuideRichText }
  | { kind: 'list'; items: GuideRichText[]; ordered?: boolean }
  | { kind: 'steps'; items: { title: string; text: GuideRichText }[] }
  | { kind: 'table'; columns: string[]; rows: string[][]; caption?: string }
  | { kind: 'callout'; tone: GuideCalloutTone; title: string; text: GuideRichText }
  | { kind: 'takeaways'; items: GuideRichText[] };

/**
 * One item in the reinforcement check that follows the prose.
 *
 * Deliberately narrower than `CourseQuestion`: the check exists to confirm the
 * reader understood what they just read, not to replay a lesson. Pull the
 * wording from the course data so the page and the course cannot disagree.
 */
export interface GuideQuizQuestion {
  /** Stable id. Use the source question id when the item came from a lesson. */
  id: string;
  /** Optional situation shown above the prompt. */
  scenario?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  /** Shown after answering, whichever option the reader picked. */
  explanation: string;
}

/**
 * A pointer from this guide to another one that continues it.
 *
 * Relations live in the guide data rather than in a list inside a component so
 * that adding a guide means editing one file, and so the reader-facing reason
 * sits next to the guide it was written about. Three rules are enforced by
 * `src/__tests__/lib/learn-links.test.ts` rather than by review: the slug must
 * belong to a registered guide, a guide may not relate to itself, and the
 * relation has to be mutual.
 *
 * Mutual is the load-bearing one. A guide that links out but is linked to by
 * nothing stays as orphaned as it was before, which is the whole problem
 * relations exist to fix. Declaring one end means editing the other end too.
 */
export interface GuideRelation {
  /** `slug` of another registered guide. Never a path, never this guide's own. */
  slug: string;
  /**
   * Why a reader who finished this guide would want that one. One sentence,
   * about the other guide rather than about this one. Rendered as the card
   * body; the link text itself is always the target guide's title, so anchor
   * text stays descriptive and cannot drift when that title is rewritten.
   */
  reason: string;
}

/** The path out of the guide and into the course it was drawn from. */
export interface GuideNextStep {
  /** Title of the unit this guide draws on, as it appears in the course. */
  unitTitle: string;
  /** What the course adds beyond this page. One or two sentences. */
  text: GuideRichText;
}

export interface LearnGuide {
  /** URL segment under `/learn/<course>/`. Never change one that has shipped. */
  slug: string;
  courseId: ProfessionId;
  /** The `<h1>`. Written for a reader, not for a crawler. */
  title: string;
  /** `<title>` without the brand suffix. Budget is 47 characters. */
  metaTitle: string;
  /** Meta description. Budget is 155 characters. */
  metaDescription: string;
  keywords: string[];
  /** ISO date of the last meaningful rewrite, for `dateModified`. */
  updated: string;
  /** The direct answer, above everything else. Two or three sentences. */
  answer: GuideRichText;
  /** The written answer proper. This is the page; aim for 800 words or more. */
  body: GuideBlock[];
  /** Reinforcement check placed after the prose. Three to five items. */
  quiz: GuideQuizQuestion[];
  /**
   * Guides this one leads into, rendered under the prose. At least one, and
   * every one of them mutual. See `GuideRelation`.
   */
  related: GuideRelation[];
  nextStep: GuideNextStep;
}
