/**
 * Shared limits and defaults for every SEO helper in this directory.
 *
 * The length caps are the practical pixel budgets Google truncates at, rounded
 * to characters. They are advisory for humans and enforced by `buildMetadata`,
 * which shortens at a word boundary rather than mid-word.
 */

/** Longest `<title>` that survives an English desktop SERP without an ellipsis. */
export const SEO_TITLE_MAX_LENGTH = 60;

/** Longest meta description that survives an English desktop SERP. */
export const SEO_DESCRIPTION_MAX_LENGTH = 155;

/** Appended when text has to be shortened. One character, not three dots. */
export const SEO_ELLIPSIS = '…';

/** Static social card shipped in `public/`. 1200x630 is the OpenGraph default. */
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

/** Locale advertised to OpenGraph consumers. The app is English only today. */
export const DEFAULT_OG_LOCALE = 'en_US';
