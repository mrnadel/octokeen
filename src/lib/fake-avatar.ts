import type { FakeUser } from '@/data/engagement-types';
import { hashSeed } from '@/lib/league-simulator';

// Palette for initials-only avatars (Tailwind 500 values)
const INITIALS_COLORS = [
  '#64748b', // slate
  '#71717a', // zinc
  '#78716c', // stone
  '#f59e0b', // amber
  '#10b981', // emerald
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#14b8a6', // teal
];

/**
 * Get a random (non-face) photo URL for a fake user using picsum.photos.
 * Returns abstract/nature/architecture photos — no people.
 * Each user gets a deterministic photo based on their ID hash.
 * Returns null for users who don't have an avatar (initials only).
 */
export function getFakeAvatarUrl(user: FakeUser): string | null {
  if (user.avatarType === 'none') return null;

  // picsum.photos uses numeric IDs (0-1084) for deterministic photos
  // Hash the user seed to get a consistent photo ID
  const photoId = hashSeed(user.avatarSeed) % 1000;
  return `https://picsum.photos/id/${photoId}/128/128`;
}

/**
 * Get the background color for an initials-only avatar.
 */
export function getInitialsColor(userId: string): string {
  const idx = hashSeed(userId) % INITIALS_COLORS.length;
  return INITIALS_COLORS[idx];
}
