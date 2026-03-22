import { createAvatar } from '@dicebear/core';
import type { Style } from '@dicebear/core';
import * as adventurer from '@dicebear/adventurer';
import * as avataaars from '@dicebear/avataaars';
import * as lorelei from '@dicebear/lorelei';
import * as thumbs from '@dicebear/thumbs';
import type { FakeUser } from '@/data/engagement-types';
import { hashSeed } from '@/lib/league-simulator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStyle = Style<any>;

const STYLES: { key: string; style: AnyStyle }[] = [
  { key: 'adventurer', style: adventurer as AnyStyle },
  { key: 'avataaars', style: avataaars as AnyStyle },
  { key: 'lorelei', style: lorelei as AnyStyle },
  { key: 'thumbs', style: thumbs as AnyStyle },
];

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
];

/**
 * Get the DiceBear SVG data URL for a fake user, or null if they have no avatar.
 */
export function getFakeAvatarUrl(user: FakeUser): string | null {
  if (user.avatarType === 'none') return null;

  const styleEntry = STYLES.find((s) => s.key === user.avatarStyle) ?? STYLES[0];
  const avatar = createAvatar(styleEntry.style, {
    seed: user.avatarSeed,
    size: 64,
  });
  return avatar.toDataUri();
}

/**
 * Get the background color for an initials-only avatar.
 */
export function getInitialsColor(userId: string): string {
  const idx = hashSeed(userId) % INITIALS_COLORS.length;
  return INITIALS_COLORS[idx];
}
