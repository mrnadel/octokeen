'use client';

import React from 'react';
import { MedalBase, COLORS, IconProps } from './shared';

// ════════════════════════════════════════════════════════════════════════════
// HIDDEN (3) - Purple
// ════════════════════════════════════════════════════════════════════════════

/** 28. Night Owl - Owl with moon */
export function NightOwlIcon({ size = 64, className }: IconProps) {
  const id = 'ach-night-owl';
  const c = COLORS.hidden;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <radialGradient id={`${id}-moon`} cx="0.4" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FCD34D" />
        </radialGradient>
      </defs>
      {/* Night sky circle */}
      <circle cx="32" cy="30" r="16" fill={`url(#${id}-sky)`} />
      {/* Moon */}
      <circle cx="42" cy="20" r="5" fill={`url(#${id}-moon)`} />
      <circle cx="43.5" cy="19" r="4" fill="#1E1B4B" /> {/* Crescent cutout */}
      {/* Stars */}
      <circle cx="20" cy="20" r="0.8" fill="#FCD34D" />
      <circle cx="24" cy="17" r="0.5" fill="#FCD34D" />
      <circle cx="36" cy="17" r="0.6" fill="#FCD34D" />
      {/* Owl body */}
      <ellipse cx="32" cy="35" rx="8" ry="7" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1.5" />
      {/* Owl head */}
      <ellipse cx="32" cy="27" rx="7" ry="5" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="1.5" />
      {/* Ear tufts */}
      <polygon points="26,23 28,26 25,25" fill="#7C3AED" stroke="#5B21B6" strokeWidth="0.8" />
      <polygon points="38,23 36,26 39,25" fill="#7C3AED" stroke="#5B21B6" strokeWidth="0.8" />
      {/* Eyes */}
      <circle cx="29" cy="27" r="3" fill="#FCD34D" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="35" cy="27" r="3" fill="#FCD34D" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="29" cy="27" r="1.5" fill="#1F2937" />
      <circle cx="35" cy="27" r="1.5" fill="#1F2937" />
      {/* Eye highlights */}
      <circle cx="30" cy="26.5" r="0.5" fill="#FFFFFF" />
      <circle cx="36" cy="26.5" r="0.5" fill="#FFFFFF" />
      {/* Beak */}
      <polygon points="32,29 31,31 33,31" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
      {/* Wing detail */}
      <path d="M24,34 Q28,32 30,36" fill="none" stroke="#6D28D9" strokeWidth="1" />
      <path d="M40,34 Q36,32 34,36" fill="none" stroke="#6D28D9" strokeWidth="1" />
    </MedalBase>
  );
}

/** 29. Early Bird - Bird with sunrise */
export function EarlyBirdIcon({ size = 64, className }: IconProps) {
  const id = 'ach-early-bird';
  const c = COLORS.hidden;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="70%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      {/* Sky background */}
      <circle cx="32" cy="30" r="16" fill={`url(#${id}-sky)`} />
      {/* Horizon line */}
      <line x1="16" y1="36" x2="48" y2="36" stroke="#F97316" strokeWidth="0.8" />
      {/* Sun (half) */}
      <circle cx="32" cy="36" r="6" fill={`url(#${id}-sun)`} />
      <rect x="16" y="36" width="32" height="14" fill={`url(#${id}-sky)`} opacity="0.3" />
      {/* Sun rays */}
      {[-30, -60, -90, -120, -150].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + 7 * Math.cos(rad);
        const y1 = 36 + 7 * Math.sin(rad);
        const x2 = 32 + 10 * Math.cos(rad);
        const y2 = 36 + 10 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FCD34D" strokeWidth="1.5" />;
      })}
      {/* Bird body */}
      <ellipse cx="30" cy="26" rx="5" ry="3.5" fill={c.base} stroke={c.dark} strokeWidth="1.5" />
      {/* Bird head */}
      <circle cx="35" cy="24" r="3" fill={c.base} stroke={c.dark} strokeWidth="1.5" />
      {/* Beak */}
      <polygon points="38,23 42,24 38,25" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
      {/* Eye */}
      <circle cx="36" cy="23" r="1" fill="#1F2937" />
      <circle cx="36.3" cy="22.7" r="0.4" fill="#FFFFFF" />
      {/* Wing */}
      <path d="M28,24 Q25,20 20,22 Q24,24 26,28" fill={c.dark} stroke={c.dark} strokeWidth="0.8" />
      {/* Tail */}
      <path d="M25,27 L20,28 L22,25" fill={c.dark} stroke={c.dark} strokeWidth="0.5" />
      {/* Musical notes (singing) */}
      <text x="41" y="20" fontFamily="serif" fontSize="5" fill={c.dark} opacity="0.7">&#9835;</text>
      <text x="44" y="17" fontFamily="serif" fontSize="4" fill={c.dark} opacity="0.5">&#9834;</text>
    </MedalBase>
  );
}

/** 30. Learning from Failure - Broken piece being repaired / gold kintsugi */
export function LearningFromFailureIcon({ size = 64, className }: IconProps) {
  const id = 'ach-learning-failure';
  const c = COLORS.hidden;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-pot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D1D5DB" />
          <stop offset="100%" stopColor="#9CA3AF" />
        </linearGradient>
        <linearGradient id={`${id}-gold-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* Bowl/vessel left half */}
      <path
        d="M20,22 L22,22 Q23,22 24,24 L26,32 Q27,38 28,40 L20,40 Q18,38 18,34 L17,28 Q17,24 20,22Z"
        fill={`url(#${id}-pot)`}
        stroke="#6B7280"
        strokeWidth="1.5"
      />
      {/* Bowl/vessel right half */}
      <path
        d="M36,22 L44,22 Q47,24 47,28 L46,34 Q46,38 44,40 L36,40 Q37,38 38,32 L40,24 Q41,22 42,22"
        fill={`url(#${id}-pot)`}
        stroke="#6B7280"
        strokeWidth="1.5"
      />
      {/* Kintsugi gold repair lines - the crack in between */}
      <path
        d="M28,22 Q30,26 29,30 Q31,34 30,38 L32,40 L34,38 Q33,34 35,30 Q34,26 36,22"
        fill={`url(#${id}-gold-fill)`}
        stroke="#B8860B"
        strokeWidth="0.8"
      />
      {/* Additional gold vein cracks */}
      <path d="M23,25 Q25,27 24,30" fill="none" stroke="#FFD700" strokeWidth="1.5" />
      <path d="M41,25 Q39,27 40,30" fill="none" stroke="#FFD700" strokeWidth="1.5" />
      <path d="M25,35 Q27,36 26,38" fill="none" stroke="#FFD700" strokeWidth="1.5" />
      <path d="M39,35 Q37,36 38,38" fill="none" stroke="#FFD700" strokeWidth="1.5" />
      {/* Glow particles around the gold */}
      <circle cx="30" cy="24" r="1" fill="#FFD700" opacity="0.6" />
      <circle cx="34" cy="28" r="0.8" fill="#FFD700" opacity="0.5" />
      <circle cx="31" cy="36" r="0.7" fill="#FFD700" opacity="0.4" />
      {/* Light burst at top */}
      <line x1="32" y1="17" x2="32" y2="19" stroke="#FFD700" strokeWidth="1" />
      <line x1="29" y1="18" x2="30" y2="20" stroke="#FFD700" strokeWidth="0.8" />
      <line x1="35" y1="18" x2="34" y2="20" stroke="#FFD700" strokeWidth="0.8" />
    </MedalBase>
  );
}
