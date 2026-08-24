/**
 * The inline markup `GuideRichText` allows, as pure text operations.
 *
 * Kept free of any import from the guide registry on purpose: word counting,
 * copy linting and the tests all need to read the markup, and none of them
 * should drag twelve guides' worth of prose in behind it. Resolution of a slug
 * to a URL lives in `guide-links.ts`, which does hold the registry.
 */

/** `[[guide-slug|anchor text]]`. Group 1 is the slug, group 2 the anchor. */
export const GUIDE_LINK_MARKUP = /\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g;

/** `**bold**`. */
export const BOLD_MARKUP = /\*\*/g;

/** Every guide slug referenced by inline link markup in one string. */
export function listGuideLinkSlugs(text: string): string[] {
  return [...text.matchAll(GUIDE_LINK_MARKUP)].map(match => match[1]);
}

/** Every anchor text used by inline link markup in one string. */
export function listGuideLinkAnchors(text: string): string[] {
  return [...text.matchAll(GUIDE_LINK_MARKUP)].map(match => match[2]);
}

/**
 * The string as a reader sees it: link markup reduced to its anchor text and
 * bold markers dropped. What a word count should be measuring.
 */
export function toPlainText(text: string): string {
  return text.replace(GUIDE_LINK_MARKUP, '$2').replace(BOLD_MARKUP, ' ');
}
