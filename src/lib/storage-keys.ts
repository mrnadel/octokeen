// ── Storage Keys ──
// Single source of truth for all localStorage / sessionStorage keys.
// Prevents typos and makes it easy to find every persisted value.

export const STORAGE_KEYS = {
  // Zustand persisted stores
  THEME: 'octokeen-theme',
  APP_STORE: 'octokeen-storage',
  SOUND: 'octokeen-sound',
  HEARTS: 'octokeen-hearts',
  ENGAGEMENT: 'octokeen-engagement',
  COURSE: 'octokeen-course',
  ADS: 'octokeen-ads',

  // Feature / UI state
  FAKE_USERS_POOL: 'octokeen-fake-users',
  TRIAL_PROMPT_SHOWN: 'octokeen-trial-prompt-shown',
  COOKIE_CONSENT: 'octokeen-cookie-consent',
  DAILY_XP_START: 'octokeen-daily-xp-start',
  COUNTRY: 'octokeen-country',
  ONBOARDED: 'octokeen-onboarded',
  CALC_HISTORY: 'calc-history',

  // Session storage (cleared on tab close)
  PLACEMENT: 'octokeen-placement',
  GUEST_XP: 'octokeen-guest-xp',
} as const;
