'use client';

import Image from 'next/image';

interface AvatarBaseProps {
  /** Avatar diameter in px */
  size: number;
  /** Display name — first character used for initials fallback */
  name?: string;
  /** Image URL. When provided, renders an Image instead of initials */
  image?: string | null;
  /** Background color for the initials circle */
  bgColor?: string;
  /** Extra CSS classes on the outer container */
  className?: string;
  /** CSS class applied to the initials text (color, weight, etc.) */
  initialsClass?: string;
  /** Explicit font size in px for initials. Overrides the default size-class heuristic. */
  initialsFontSize?: number;
}

function getInitialsFontClass(size: number): string {
  if (size <= 28) return 'text-[10px]';
  if (size <= 36) return 'text-xs';
  return 'text-sm';
}

export function AvatarBase({
  size,
  name,
  image,
  bgColor = '#DBEAFE',
  className = '',
  initialsClass = 'text-primary-700',
  initialsFontSize,
}: AvatarBaseProps) {
  const initial = (name || '?').charAt(0).toUpperCase();
  const fontSizeClass = initialsFontSize == null ? getInitialsFontClass(size) : '';

  return (
    <div
      className={`rounded-full flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size, background: image ? 'transparent' : bgColor }}
    >
      {image ? (
        <Image
          src={image}
          alt={name || 'avatar'}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className={`font-bold ${initialsClass} ${fontSizeClass}`}
          style={initialsFontSize != null ? { fontSize: initialsFontSize } : undefined}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
