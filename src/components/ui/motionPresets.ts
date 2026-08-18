/**
 * Shared framer-motion transition presets.
 *
 * Single source of truth for spring configs used by more than one component.
 * Spread a preset to add a delay: `transition={{ ...CELEBRATION_SPRING, delay: 0.2 }}`.
 * One-off springs stay inline at their call site — only promote a config here
 * once a second component needs the exact same feel.
 */

/** Content entrance inside celebration / full-screen reward modals. */
export const CELEBRATION_SPRING = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 15,
};

/** Hero badge drop-in for league promotion and league winner screens. */
export const LEAGUE_HERO_SPRING = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 14,
  delay: 0.15,
};

/** Icon pop used by the streak-freeze and out-of-hearts modals. */
export const MODAL_ICON_SPRING = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 15,
  delay: 0.1,
};
