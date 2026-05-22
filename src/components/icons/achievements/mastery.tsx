'use client';

import React from 'react';
import { MedalBase, COLORS, IconProps } from './shared';

// ════════════════════════════════════════════════════════════════════════════
// MASTERY (4) - Gold
// ════════════════════════════════════════════════════════════════════════════

/** 24. Topic Master - Crown on a book / golden wreath */
export function TopicMasterIcon({ size = 64, className }: IconProps) {
  const id = 'ach-topic-master';
  const c = COLORS.mastery;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-crown`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id={`${id}-book`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Laurel wreath left */}
      <path d="M19,38 Q21,34 20,30" fill="none" stroke="#10B981" strokeWidth="1.5" />
      <path d="M19,34 Q22,32 20,28" fill="none" stroke="#10B981" strokeWidth="1.2" />
      <path d="M20,30 Q23,28 21,25" fill="none" stroke="#10B981" strokeWidth="1" />
      {/* Laurel wreath right */}
      <path d="M45,38 Q43,34 44,30" fill="none" stroke="#10B981" strokeWidth="1.5" />
      <path d="M45,34 Q42,32 44,28" fill="none" stroke="#10B981" strokeWidth="1.2" />
      <path d="M44,30 Q41,28 43,25" fill="none" stroke="#10B981" strokeWidth="1" />
      {/* Book */}
      <path d="M24,32 L24,42 Q28,40 32,42 L32,32 Q28,30 24,32Z" fill={`url(#${id}-book)`} stroke="#1E3A8A" strokeWidth="1" />
      <path d="M32,32 L32,42 Q36,40 40,42 L40,32 Q36,30 32,32Z" fill="#818CF8" stroke="#1E3A8A" strokeWidth="1" />
      <line x1="32" y1="32" x2="32" y2="42" stroke="#1E3A8A" strokeWidth="1" />
      {/* Crown above book */}
      <path
        d="M24,28 L27,22 L30,26 L33,20 L36,26 L39,22 L40,28Z"
        fill={`url(#${id}-crown)`}
        stroke="#8B6914"
        strokeWidth="1.5"
      />
      {/* Crown gems */}
      <circle cx="27" cy="25" r="1" fill="#EF4444" />
      <circle cx="33" cy="23" r="1" fill="#3B82F6" />
      <circle cx="39" cy="25" r="1" fill="#10B981" />
      {/* Crown base */}
      <rect x="24" y="27" width="16" height="2" rx="0.5" fill="#B8860B" />
    </MedalBase>
  );
}

/** 25. Multi-Domain Expert - Connected nodes / web */
export function MultiDomainExpertIcon({ size = 64, className }: IconProps) {
  const id = 'ach-multi-domain';
  const c = COLORS.mastery;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <radialGradient id={`${id}-node`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </radialGradient>
      </defs>
      {/* Connection lines first (behind nodes) */}
      <line x1="32" y1="22" x2="22" y2="30" stroke={c.base} strokeWidth="1.5" opacity="0.6" />
      <line x1="32" y1="22" x2="42" y2="30" stroke={c.base} strokeWidth="1.5" opacity="0.6" />
      <line x1="32" y1="22" x2="32" y2="38" stroke={c.base} strokeWidth="1.5" opacity="0.6" />
      <line x1="22" y1="30" x2="26" y2="38" stroke={c.base} strokeWidth="1.5" opacity="0.6" />
      <line x1="42" y1="30" x2="38" y2="38" stroke={c.base} strokeWidth="1.5" opacity="0.6" />
      <line x1="26" y1="38" x2="38" y2="38" stroke={c.base} strokeWidth="1.5" opacity="0.6" />
      <line x1="22" y1="30" x2="42" y2="30" stroke={c.base} strokeWidth="1" opacity="0.3" />
      {/* Center node (largest) */}
      <circle cx="32" cy="30" r="4" fill={`url(#${id}-node)`} stroke={c.dark} strokeWidth="1.5" />
      <text x="32" y="32" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="4" fill="#FFFFFF">5</text>
      {/* Top node */}
      <circle cx="32" cy="22" r="3" fill={`url(#${id}-node)`} stroke={c.dark} strokeWidth="1" />
      {/* Left node */}
      <circle cx="22" cy="30" r="3" fill={`url(#${id}-node)`} stroke={c.dark} strokeWidth="1" />
      {/* Right node */}
      <circle cx="42" cy="30" r="3" fill={`url(#${id}-node)`} stroke={c.dark} strokeWidth="1" />
      {/* Bottom-left node */}
      <circle cx="26" cy="38" r="3" fill={`url(#${id}-node)`} stroke={c.dark} strokeWidth="1" />
      {/* Bottom-right node */}
      <circle cx="38" cy="38" r="3" fill={`url(#${id}-node)`} stroke={c.dark} strokeWidth="1" />
      {/* Checkmarks on outer nodes */}
      {[
        [32, 22],
        [22, 30],
        [42, 30],
        [26, 38],
        [38, 38],
      ].map(([x, y], i) => (
        <polyline
          key={i}
          points={`${x - 1.5},${y} ${x - 0.3},${y + 1.5} ${x + 2},${y - 1.5}`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
      ))}
    </MedalBase>
  );
}

/** 26. Weakness Conquered - Broken chain / rising arrow */
export function WeaknessConqueredIcon({ size = 64, className }: IconProps) {
  const id = 'ach-weakness-conquered';
  const c = COLORS.mastery;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-arrow`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={c.dark} />
          <stop offset="100%" stopColor={c.base} />
        </linearGradient>
      </defs>
      {/* Broken chain - left half */}
      <ellipse cx="24" cy="32" rx="5" ry="4" fill="none" stroke="#6B7280" strokeWidth="2.5" />
      <line x1="29" y1="32" x2="30" y2="30" stroke="#6B7280" strokeWidth="2.5" />
      {/* Broken chain - right half */}
      <ellipse cx="40" cy="32" rx="5" ry="4" fill="none" stroke="#6B7280" strokeWidth="2.5" />
      <line x1="35" y1="32" x2="34" y2="34" stroke="#6B7280" strokeWidth="2.5" />
      {/* Break gap - spark lines */}
      <line x1="30" y1="29" x2="32" y2="27" stroke="#FFD700" strokeWidth="1" />
      <line x1="34" y1="35" x2="32" y2="37" stroke="#FFD700" strokeWidth="1" />
      <circle cx="32" cy="32" r="1" fill="#FFD700" />
      {/* Rising arrow */}
      <line x1="32" y1="40" x2="32" y2="18" stroke={`url(#${id}-arrow)`} strokeWidth="2.5" />
      <polygon points="32,16 28,22 36,22" fill={c.base} stroke={c.dark} strokeWidth="0.8" />
      {/* Sparkle at arrow tip */}
      <line x1="32" y1="14" x2="32" y2="16" stroke="#FFD700" strokeWidth="1" />
      <line x1="29" y1="16" x2="31" y2="17" stroke="#FFD700" strokeWidth="1" />
      <line x1="35" y1="16" x2="33" y2="17" stroke="#FFD700" strokeWidth="1" />
    </MedalBase>
  );
}

/** 27. Interview Ready - Briefcase with checkmark / star */
export function InterviewReadyIcon({ size = 64, className }: IconProps) {
  const id = 'ach-interview-ready';
  const c = COLORS.mastery;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-case`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5E34" />
          <stop offset="100%" stopColor="#5C3D1E" />
        </linearGradient>
        <linearGradient id={`${id}-star`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      {/* Briefcase handle */}
      <path d="M27,22 L27,19 Q27,17 29,17 L35,17 Q37,17 37,19 L37,22" fill="none" stroke="#5C3D1E" strokeWidth="2" />
      {/* Briefcase body */}
      <rect x="19" y="22" width="26" height="17" rx="2" fill={`url(#${id}-case)`} stroke="#3D2010" strokeWidth="1.5" />
      {/* Briefcase latch */}
      <rect x="29" y="22" width="6" height="3" rx="1" fill="#D4A574" stroke="#8B6914" strokeWidth="0.8" />
      {/* Briefcase divider */}
      <line x1="19" y1="28" x2="45" y2="28" stroke="#3D2010" strokeWidth="0.8" opacity="0.5" />
      {/* Star badge */}
      <polygon
        points="32,26 34,30 38.5,30.5 35,33.5 36,38 32,35.5 28,38 29,33.5 25.5,30.5 30,30"
        fill={`url(#${id}-star)`}
        stroke="#8B6914"
        strokeWidth="1"
      />
      {/* Checkmark inside star */}
      <polyline points="29.5,32 31.5,34.5 35,29" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
    </MedalBase>
  );
}
