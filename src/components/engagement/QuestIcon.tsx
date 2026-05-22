'use client';

interface QuestIconProps {
  icon: string;
  size: number;
}

/**
 * Render icon as <img> if it's a path, or as emoji text
 */
export function QuestIcon({ icon, size }: QuestIconProps) {
  if (icon.startsWith('/')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={icon} alt="" width={size} height={size} style={{ objectFit: 'contain' }} />;
  }
  return <span style={{ fontSize: size * 0.65, lineHeight: 1 }}>{icon}</span>;
}
