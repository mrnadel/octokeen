'use client';

/**
 * AvatarFrame — renders a decorative SVG frame around an avatar.
 * Each frame style has a unique shape, gradient, and optional animation.
 *
 * Usage:
 *   <AvatarFrame frameStyle="gold" size={96}>
 *     <Image src={...} alt="..." width={96} height={96} className="w-full h-full rounded-full object-cover" />
 *   </AvatarFrame>
 */

import { type ReactNode } from 'react';
import { FRAME_DEFS } from './frames';

export type FrameStyleId =
  | 'gold'
  | 'diamond'
  | 'emerald'
  | 'ruby'
  | 'sapphire'
  | 'sunset'
  | 'aurora'
  | 'neon'
  // League frames (earned by reaching leagues)
  | 'league-bronze'
  | 'league-silver'
  | 'league-gold'
  | 'league-platinum'
  | 'league-masters'
  // Streak milestone frames
  | 'streak-iron'
  | 'streak-diamond'
  | 'streak-centurion'
  // Common frames
  | 'steel'
  | 'copper'
  | 'bolt'
  | 'blueprint'
  | 'titanium'
  | 'rivet'
  | 'cast-iron'
  | 'spring'
  | 'gear'
  | 'gasket'
  | 'wire'
  | 'concrete'
  // Rare frames
  | 'wrench'
  | 'piston'
  | 'circuit'
  | 'thermal'
  | 'weld'
  // Epic frames
  | 'turbine'
  | 'plasma'
  | 'star-drive'
  // Legendary frames
  | 'singularity'
  | 'fusion-reactor'
  | 'supernova'
  | 'all-gold'
  // Reward frames
  | 'first-gold'
  | 'marathon'
  | 'early-bird'
  | 'perfect-unit'
  | 'speed-demon'
  | 'perfectionist'
  | null
  | undefined;

interface AvatarFrameProps {
  frameStyle: FrameStyleId;
  size: number;         // outer size in px
  children: ReactNode;  // the avatar element
  className?: string;
}

// The avatar circle is inset by this much to leave room for the frame
const FRAME_INSET = 6;

export function AvatarFrame({ frameStyle, size, children, className = '' }: AvatarFrameProps) {
  const innerSize = size - FRAME_INSET * 2;

  if (!frameStyle) {
    // No frame — just render avatar with a subtle border
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            inset: FRAME_INSET,
            width: innerSize,
            height: innerSize,
            border: '3px solid rgba(255,255,255,0.2)',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  const def = FRAME_DEFS[frameStyle];
  if (!def) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <div className="absolute rounded-full overflow-hidden" style={{ inset: FRAME_INSET, width: innerSize, height: innerSize }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* SVG frame overlay */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <defs>{def.defs(size)}</defs>
        {def.render(size)}
      </svg>

      {/* Glow layer behind */}
      {def.glowColor && (
        <div
          className={`absolute rounded-full ${def.animated ? 'animate-pulse' : ''}`}
          style={{
            inset: -2,
            background: def.glowColor,
            filter: `blur(${def.glowBlur || 8}px)`,
            opacity: def.glowOpacity || 0.5,
            zIndex: 0,
          }}
        />
      )}

      {/* Avatar content */}
      <div
        className={`absolute overflow-hidden${def.avatarClipPath ? '' : ' rounded-full'}`}
        style={{
          top: FRAME_INSET,
          left: FRAME_INSET,
          width: innerSize,
          height: innerSize,
          zIndex: 1,
          ...(def.avatarClipPath && { clipPath: def.avatarClipPath }),
        }}
      >
        {children}
      </div>
    </div>
  );
}
