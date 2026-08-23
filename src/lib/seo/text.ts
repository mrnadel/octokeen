import { SEO_ELLIPSIS } from './constants';

/** A single over-length field, reported back to the caller instead of hidden. */
export interface SeoLengthIssue {
  field: string;
  max: number;
  actual: number;
  text: string;
}

/** Collapses runs of whitespace so length checks match what a crawler sees. */
export function normalizeSeoText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Shortens text to `max` characters without cutting a word in half.
 *
 * The ellipsis is counted against the budget, so the result is never longer
 * than `max`. A single word longer than the budget is hard-cut, because there
 * is no earlier boundary to fall back to.
 */
export function truncateAtWordBoundary(text: string, max: number): string {
  const normalized = normalizeSeoText(text);
  if (normalized.length <= max) return normalized;

  const budget = max - SEO_ELLIPSIS.length;
  if (budget <= 0) return SEO_ELLIPSIS.slice(0, max);

  const head = normalized.slice(0, budget + 1);
  const lastSpace = head.lastIndexOf(' ');
  const body = lastSpace > 0 ? head.slice(0, lastSpace) : normalized.slice(0, budget);

  return `${body.replace(/[,;:.\-\s]+$/, '')}${SEO_ELLIPSIS}`;
}

/** Returns an issue when `text` exceeds `max`, or `null` when it fits. */
export function findSeoLengthIssue(field: string, text: string, max: number): SeoLengthIssue | null {
  const normalized = normalizeSeoText(text);
  if (normalized.length <= max) return null;
  return { field, max, actual: normalized.length, text: normalized };
}

/**
 * Surfaces over-length copy at author time. Silent in production so a long
 * title never costs a request, loud everywhere else so it gets fixed.
 */
export function reportSeoLengthIssues(issues: SeoLengthIssue[], context: string): void {
  if (issues.length === 0 || process.env.NODE_ENV === 'production') return;
  for (const issue of issues) {
    console.warn(
      `[seo] ${context}: ${issue.field} is ${issue.actual} chars, max ${issue.max}. ` +
        `It will be shortened at a word boundary. Text: "${issue.text}"`
    );
  }
}
