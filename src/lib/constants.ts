// ── App Brand Constants ──
// Single source of truth for the app name, domain, and brand metadata.
// Change these when rebranding — all SEO, UI, and legal pages reference them.

export const APP_NAME = 'Octokeen';
export const APP_DOMAIN = 'octokeen.com';
export const APP_URL = `https://${APP_DOMAIN}`;
export const APP_TAGLINE = 'Learn anything. Master everything.';
export const APP_DESCRIPTION =
  'Gamified learning for curious adults. Five-minute lessons in personal finance, psychology, and space, with adaptive questions, streaks, and smart feedback.';
export const APP_THEME_COLOR_LIGHT = '#FAFAFA';
export const APP_THEME_COLOR_DARK = '#020617';
export const APP_THEME_COLOR = APP_THEME_COLOR_LIGHT;
export const APP_SUPPORT_EMAIL = `support@${APP_DOMAIN}`;

/**
 * Width of the app shell's content column, in px. Must stay in sync with the
 * `max-w-3xl` on the column in `src/app/(app)/layout.tsx` (Tailwind 3xl = 48rem).
 * Elements that escape the column with `position: fixed` re-derive their box
 * from this rather than measuring the DOM, which goes stale on layout shifts.
 */
export const APP_CONTENT_MAX_WIDTH = 768;
