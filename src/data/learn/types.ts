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
 * Plain text with one piece of inline markup: `**bold**`. No HTML is parsed,
 * so guide copy can never inject markup. See `renderInline` in
 * `src/components/learn/InlineText.tsx`.
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
  nextStep: GuideNextStep;
}
