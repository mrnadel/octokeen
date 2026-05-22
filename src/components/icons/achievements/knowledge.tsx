'use client';

import React from 'react';
import { MedalBase, COLORS, IconProps } from './shared';

// ════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE (7) - Indigo
// ════════════════════════════════════════════════════════════════════════════

/** 1. First Principles - Target/bullseye with arrow */
export function FirstPrinciplesIcon({ size = 64, className }: IconProps) {
  const id = 'ach-first-principles';
  const c = COLORS.knowledge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-arrow`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="32" cy="30" r="12" fill="none" stroke={c.dark} strokeWidth="2" />
      {/* Middle ring */}
      <circle cx="32" cy="30" r="8" fill="none" stroke="#EF4444" strokeWidth="2" />
      {/* Inner ring */}
      <circle cx="32" cy="30" r="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
      {/* Bullseye center */}
      <circle cx="32" cy="30" r="1.5" fill="#FFFFFF" />
      {/* Arrow shaft */}
      <line x1="22" y1="20" x2="31" y2="29" stroke={`url(#${id}-arrow)`} strokeWidth="2" />
      {/* Arrow head */}
      <polygon points="20,17 25,19 22,22" fill="#B91C1C" />
      {/* Arrow fletching */}
      <line x1="20" y1="17" x2="18" y2="20" stroke="#B91C1C" strokeWidth="1.5" />
      <line x1="20" y1="17" x2="23" y2="15" stroke="#B91C1C" strokeWidth="1.5" />
    </MedalBase>
  );
}

/** 2. Building Momentum - Rising bar chart / stairs */
export function BuildingMomentumIcon({ size = 64, className }: IconProps) {
  const id = 'ach-building-momentum';
  const c = COLORS.knowledge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-bar`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={c.dark} />
          <stop offset="100%" stopColor={c.base} />
        </linearGradient>
      </defs>
      {/* Base line */}
      <line x1="20" y1="40" x2="44" y2="40" stroke={c.dark} strokeWidth="2" />
      {/* Bar 1 */}
      <rect x="21" y="35" width="4" height="5" rx="0.5" fill={`url(#${id}-bar)`} stroke={c.dark} strokeWidth="1" />
      {/* Bar 2 */}
      <rect x="27" y="31" width="4" height="9" rx="0.5" fill={`url(#${id}-bar)`} stroke={c.dark} strokeWidth="1" />
      {/* Bar 3 */}
      <rect x="33" y="26" width="4" height="14" rx="0.5" fill={`url(#${id}-bar)`} stroke={c.dark} strokeWidth="1" />
      {/* Bar 4 */}
      <rect x="39" y="20" width="4" height="20" rx="0.5" fill={`url(#${id}-bar)`} stroke={c.dark} strokeWidth="1" />
      {/* Trend arrow */}
      <polyline points="23,34 29,30 35,25 41,19" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
      <polygon points="41,19 43,22 39,21" fill="#F59E0B" />
    </MedalBase>
  );
}

/** 3. Solid Foundation - Brick wall / foundation blocks */
export function SolidFoundationIcon({ size = 64, className }: IconProps) {
  const id = 'ach-solid-foundation';
  const c = COLORS.knowledge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-brick`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      {/* Row 1 (bottom) - 3 bricks */}
      <rect x="18" y="35" width="9" height="5" rx="0.5" fill={`url(#${id}-brick)`} stroke="#991B1B" strokeWidth="1" />
      <rect x="28" y="35" width="9" height="5" rx="0.5" fill={`url(#${id}-brick)`} stroke="#991B1B" strokeWidth="1" />
      <rect x="38" y="35" width="9" height="5" rx="0.5" fill={`url(#${id}-brick)`} stroke="#991B1B" strokeWidth="1" />
      {/* Row 2 - offset 2.5 bricks */}
      <rect x="22" y="29" width="9" height="5" rx="0.5" fill={`url(#${id}-brick)`} stroke="#991B1B" strokeWidth="1" />
      <rect x="32" y="29" width="9" height="5" rx="0.5" fill={`url(#${id}-brick)`} stroke="#991B1B" strokeWidth="1" />
      {/* Row 3 - 2 bricks */}
      <rect x="18" y="23" width="9" height="5" rx="0.5" fill={`url(#${id}-brick)`} stroke="#991B1B" strokeWidth="1" />
      <rect x="28" y="23" width="9" height="5" rx="0.5" fill={`url(#${id}-brick)`} stroke="#991B1B" strokeWidth="1" />
      <rect x="38" y="23" width="9" height="5" rx="0.5" fill={`url(#${id}-brick)`} stroke="#991B1B" strokeWidth="1" />
      {/* Mortar highlight */}
      <line x1="18" y1="34.5" x2="47" y2="34.5" stroke="#FCA5A5" strokeWidth="0.5" opacity="0.5" />
      <line x1="18" y1="28.5" x2="47" y2="28.5" stroke="#FCA5A5" strokeWidth="0.5" opacity="0.5" />
      {/* Foundation base */}
      <rect x="16" y="40" width="33" height="2" rx="1" fill={c.dark} />
    </MedalBase>
  );
}

/** 4. Centurion - Number "100" with laurels */
export function CenturionIcon({ size = 64, className }: IconProps) {
  const id = 'ach-centurion';
  const c = COLORS.knowledge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {/* Left laurel */}
      <path d="M19,36 Q21,32 20,28 Q22,30 21,34" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
      <path d="M18,33 Q20,29 19,25 Q21,27 20,31" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
      <path d="M18,30 Q20,26 19,22 Q21,24 20,28" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
      {/* Right laurel */}
      <path d="M45,36 Q43,32 44,28 Q42,30 43,34" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
      <path d="M46,33 Q44,29 45,25 Q43,27 44,31" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
      <path d="M46,30 Q44,26 45,22 Q43,24 44,28" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
      {/* "100" text */}
      <text
        x="32"
        y="33"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="13"
        fill={`url(#${id}-gold)`}
        stroke="#B8860B"
        strokeWidth="0.5"
      >
        100
      </text>
      {/* Small star above */}
      <polygon points="32,18 33,20.5 35.5,20.5 33.5,22 34.3,24.5 32,23 29.7,24.5 30.5,22 28.5,20.5 31,20.5" fill="#FFD700" />
    </MedalBase>
  );
}

/** 5. Flawless Execution - Diamond/gem sparkle */
export function FlawlessExecutionIcon({ size = 64, className }: IconProps) {
  const id = 'ach-flawless-execution';
  const c = COLORS.knowledge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-gem`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="40%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id={`${id}-gem2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFDBFE" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      {/* Diamond shape - top facets */}
      <polygon points="32,19 25,27 32,24 39,27" fill={`url(#${id}-gem2)`} stroke="#1E3A8A" strokeWidth="1" />
      {/* Diamond shape - bottom */}
      <polygon points="25,27 32,40 39,27" fill={`url(#${id}-gem)`} stroke="#1E3A8A" strokeWidth="1" />
      {/* Center facet line */}
      <line x1="32" y1="24" x2="32" y2="40" stroke="#93C5FD" strokeWidth="0.5" opacity="0.6" />
      {/* Left facet */}
      <line x1="25" y1="27" x2="32" y2="24" stroke="#1E3A8A" strokeWidth="0.8" />
      {/* Right facet */}
      <line x1="39" y1="27" x2="32" y2="24" stroke="#1E3A8A" strokeWidth="0.8" />
      {/* Sparkles */}
      <line x1="42" y1="20" x2="42" y2="16" stroke="#FFD700" strokeWidth="1.5" />
      <line x1="40" y1="18" x2="44" y2="18" stroke="#FFD700" strokeWidth="1.5" />
      <line x1="20" y1="22" x2="20" y2="19" stroke="#FFD700" strokeWidth="1" />
      <line x1="18.5" y1="20.5" x2="21.5" y2="20.5" stroke="#FFD700" strokeWidth="1" />
      <circle cx="44" cy="25" r="0.8" fill="#FFD700" />
      <circle cx="19" cy="33" r="0.8" fill="#FFD700" />
    </MedalBase>
  );
}

/** 6. No Easy Mode - Flame/fire with "hard" badge */
export function NoEasyModeIcon({ size = 64, className }: IconProps) {
  const id = 'ach-no-easy-mode';
  const c = COLORS.knowledge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-flame`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id={`${id}-inner-flame`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* Main flame */}
      <path
        d="M32,16 Q38,22 40,28 Q40,36 32,40 Q24,36 24,28 Q26,22 32,16Z"
        fill={`url(#${id}-flame)`}
        stroke="#B91C1C"
        strokeWidth="1.5"
      />
      {/* Inner flame */}
      <path
        d="M32,24 Q35,28 36,32 Q36,37 32,39 Q28,37 28,32 Q29,28 32,24Z"
        fill={`url(#${id}-inner-flame)`}
        stroke="#D97706"
        strokeWidth="0.8"
      />
      {/* Core bright spot */}
      <ellipse cx="32" cy="34" rx="2" ry="3" fill="#FEF3C7" opacity="0.8" />
      {/* "HARD" badge */}
      <rect x="24" y="36" width="16" height="6" rx="3" fill={c.dark} stroke={c.base} strokeWidth="0.8" />
      <text
        x="32"
        y="41"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="5"
        fill="#FFFFFF"
      >
        HARD
      </text>
    </MedalBase>
  );
}

/** 7. Back of the Envelope - Pencil with quick sketch/calculation */
export function BackOfEnvelopeIcon({ size = 64, className }: IconProps) {
  const id = 'ach-back-envelope';
  const c = COLORS.knowledge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-pencil`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* Envelope/paper */}
      <rect x="20" y="21" width="24" height="18" rx="1.5" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1.5" />
      {/* Scribbled calculation lines */}
      <line x1="23" y1="25" x2="35" y2="25" stroke="#9CA3AF" strokeWidth="0.8" />
      <line x1="23" y1="28" x2="31" y2="28" stroke="#9CA3AF" strokeWidth="0.8" />
      <line x1="23" y1="31" x2="38" y2="31" stroke="#9CA3AF" strokeWidth="0.8" />
      {/* Equals sign */}
      <line x1="23" y1="34" x2="26" y2="34" stroke={c.dark} strokeWidth="1" />
      <line x1="23" y1="35.5" x2="26" y2="35.5" stroke={c.dark} strokeWidth="1" />
      {/* Answer */}
      <text x="28" y="36" fontFamily="Arial, sans-serif" fontSize="4" fontWeight="700" fill={c.dark}>42</text>
      {/* Pencil */}
      <rect x="36" y="15" width="3.5" height="16" rx="0.5" fill={`url(#${id}-pencil)`} stroke="#B45309" strokeWidth="0.8" transform="rotate(20 38 23)" />
      {/* Pencil tip */}
      <polygon points="39.5,31.5 37.5,31.5 38.5,34.5" fill="#F4A460" stroke="#B45309" strokeWidth="0.5" transform="rotate(20 38 33)" />
      {/* Eraser */}
      <rect x="36" y="14" width="3.5" height="3" rx="0.5" fill="#F472B6" stroke="#DB2777" strokeWidth="0.5" transform="rotate(20 38 15.5)" />
    </MedalBase>
  );
}
