/**
 * Stacking order for elements that escape the normal flow.
 *
 * Only layers whose value is a *contract between components* belong here —
 * if two files must agree on which one paints on top, the number lives in this
 * file and nowhere else. Component-internal stacking (an avatar's glow behind
 * its frame, a badge over a card) stays local, and anything expressible with a
 * Tailwind `z-*` class should keep using the class.
 */
export const Z_LAYERS = {
  /** Floating XP-event pill — deliberately below the sticky course header. */
  EVENT_BANNER: 29,
  /** Toasts: above page chrome, below any full-screen overlay. */
  TOAST: 200,
  /** Full-screen modals and popovers — above ALL app UI. */
  OVERLAY: 9999,
  /** Interstitial ads — the only thing allowed above OVERLAY. */
  INTERSTITIAL: 10000,
} as const;
