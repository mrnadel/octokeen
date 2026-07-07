'use client';

import { AvatarBase } from './AvatarBase';

interface UserAvatarProps {
  /** Full image URL or null for initials fallback */
  image?: string | null;
  /** Display name used for alt text and initials fallback */
  name: string;
  /** Avatar diameter in px. Default: 40 */
  size?: number;
  /** Background color for initials circle. Default: '#DBEAFE' */
  bgColor?: string;
  /** Text color for initials. Default: 'text-primary-700' */
  textClass?: string;
}

export function UserAvatar({
  image,
  name,
  size = 40,
  bgColor = '#DBEAFE',
  textClass = 'text-primary-700',
}: UserAvatarProps) {
  return (
    <AvatarBase
      size={size}
      name={name}
      image={image}
      bgColor={bgColor}
      initialsClass={textClass}
    />
  );
}
