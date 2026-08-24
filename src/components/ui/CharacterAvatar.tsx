import Image from 'next/image';

/** Poses each character can be asked for. */
const CHARACTER_POSES: Record<string, string[]> = {
  // Personal Finance
  'pf-alex':    ['neutral', 'studying', 'walking', 'thinking', 'celebrating', 'listening', 'scrolling', 'confused'],
  'pf-jordan':  ['neutral', 'budgeting', 'celebrating', 'overwhelmed', 'thinking', 'walking'],
  // Psychology
  'psy-maya':   ['neutral', 'focused', 'walking', 'celebrating', 'reviewing', 'presenting', 'overwhelmed', 'proud'],
  'psy-sam':    ['pointing', 'gaming', 'scrolling', 'confused', 'studying', 'mindblown', 'skating', 'listening'],
  // Space
  'space-nova': ['neutral', 'thumbs-up', 'floating', 'telescope', 'resting', 'explaining', 'cupola', 'wondering'],
  'space-kai':  ['neutral', 'celebrating', 'telescope', 'starchart', 'daydreaming', 'binoculars', 'researching', 'walking'],
};

/**
 * Character pose registry. Maps `{characterId}` to the standing portrait and
 * `{characterId}-{pose}` to that pose's art.
 *
 * Add a character by dropping `{id}.png` (portrait) and `{id}-sm.png` (face) in
 * public/characters/, then listing its poses above. Pose sheets are cut with
 * `scripts/crop-character-sheet.mjs`, which writes the `{id}-{pose}.png` files.
 */
export const CHARACTER_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(CHARACTER_POSES).flatMap(([id, poses]) => [
    [id, `/characters/${id}.png`] as const,
    ...poses.map(pose => [`${id}-${pose}`, `/characters/${id}-${pose}.png`] as const),
  ]),
);

/** All available poses for a given character. */
export function getCharacterPoses(characterId: string): string[] {
  const prefix = characterId + '-';
  return Object.keys(CHARACTER_IMAGES).filter(k => k.startsWith(prefix));
}

interface CharacterAvatarProps {
  characterId: string;
  /** Optional pose suffix (e.g., 'excited', 'thinking'). Falls back to default if pose not found. */
  pose?: string | null;
  size?: number;
  className?: string;
  priority?: boolean;
}

export function CharacterAvatar({ characterId, pose, size = 80, className, priority }: CharacterAvatarProps) {
  // Try pose-specific image first, then default, then convention-based path
  const poseKey = pose ? `${characterId}-${pose}` : characterId;
  const src = CHARACTER_IMAGES[poseKey]
    ?? CHARACTER_IMAGES[characterId]
    ?? `/characters/${characterId}.png`;

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      draggable={false}
      priority={priority}
      unoptimized
    />
  );
}
