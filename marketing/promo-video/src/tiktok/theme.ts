/**
 * Visual tokens for the TikTok ad, mirroring docs/design-language.md.
 * Kept separate from src/constants.ts, which still holds the older
 * teal-themed values used by the landscape PromoVideo composition.
 */
import { loadFont as loadNunito } from '@remotion/google-fonts/Nunito';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

export const { fontFamily: NUNITO } = loadNunito();
export const { fontFamily: MONO } = loadMono();

export const C = {
  indigo: '#6366F1',
  indigoDark: '#4F46E5',
  indigoDeep: '#4338CA',
  gold: '#FFB800',
  goldDark: '#CC9400',
  emerald: '#10B981',
  violet: '#8B5CF6',

  featherGreen: '#58CC02',
  treeFrog: '#58A700',
  seaSponge: '#D7FFB8',
  macaw: '#1CB0F6',
  cardinal: '#FF4B4B',
  fox: '#FF9600',

  bg: '#FAFAFA',
  surface100: '#F1F5F9',
  surface200: '#E2E8F0',
  surface300: '#CBD5E1',
  surface400: '#94A3B8',
  surface500: '#64748B',
  surface700: '#334155',
  surface800: '#1E293B',
  surface900: '#0F172A',
  white: '#FFFFFF',
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL_FRAMES = 450; // 15s

/**
 * TikTok overlays its own chrome on the video: the caption/handle block and
 * ad CTA button along the bottom, the action rail down the right edge, and a
 * nav row at the very top. TikTok's published canvas is 120px to 1800px; the
 * bottom figure here is deliberately more conservative because in-feed ads
 * carry a CTA button the organic spec does not account for.
 */
export const SAFE = {
  top: 150,
  bottom: 340,
  side: 64,
  rightRail: 190,
} as const;

/**
 * Timings are built around one rule that dominates every other creative
 * decision on this platform: the product has to be on screen before the
 * three-second mark, or the hook is spending the whole decision window on
 * something the viewer cannot buy.
 */
export const HOOK_FRAMES = 75; // 2.5s, and the app is up the instant it ends

export const SCENES = {
  hook: { from: 0, duration: HOOK_FRAMES },
  lesson: { from: 75, duration: 195 },
  payoff: { from: 270, duration: 90 },
  cta: { from: 360, duration: 90 },
} as const;
