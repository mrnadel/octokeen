'use client';

import React from 'react';
import { MedalBase, COLORS, IconProps } from './shared';

// ════════════════════════════════════════════════════════════════════════════
// CONSISTENCY (6) - Green
// ════════════════════════════════════════════════════════════════════════════

/** 8. Getting Warmed Up - Small flame (3-day) */
export function GettingWarmedUpIcon({ size = 64, className }: IconProps) {
  const id = 'ach-getting-warmed';
  const c = COLORS.consistency;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-flame`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="60%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      {/* Flame */}
      <path
        d="M32,18 Q37,24 38,29 Q38,36 32,38 Q26,36 26,29 Q27,24 32,18Z"
        fill={`url(#${id}-flame)`}
        stroke="#DC2626"
        strokeWidth="1.5"
      />
      {/* Inner flame */}
      <path
        d="M32,26 Q34,29 34.5,32 Q34.5,36 32,37 Q29.5,36 29.5,32 Q30,29 32,26Z"
        fill="#FDE68A"
        stroke="#F59E0B"
        strokeWidth="0.8"
      />
      {/* Core */}
      <ellipse cx="32" cy="34" rx="1.5" ry="2" fill="#FFFBEB" opacity="0.9" />
      {/* "3" badge */}
      <circle cx="40" cy="21" r="4" fill={c.dark} stroke={c.base} strokeWidth="1" />
      <text x="40" y="23.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="6" fill="#FFFFFF">3</text>
    </MedalBase>
  );
}

/** 9. Seven-Day Streak - Calendar with checkmarks */
export function SevenDayStreakIcon({ size = 64, className }: IconProps) {
  const id = 'ach-seven-day';
  const c = COLORS.consistency;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-cal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3F4F6" />
        </linearGradient>
      </defs>
      {/* Calendar body */}
      <rect x="19" y="20" width="26" height="22" rx="2" fill={`url(#${id}-cal)`} stroke="#6B7280" strokeWidth="1.5" />
      {/* Calendar header */}
      <rect x="19" y="20" width="26" height="6" rx="2" fill={c.base} />
      {/* Calendar binding rings */}
      <rect x="25" y="18" width="2" height="4" rx="1" fill="#6B7280" />
      <rect x="37" y="18" width="2" height="4" rx="1" fill="#6B7280" />
      {/* Grid lines */}
      <line x1="19" y1="32" x2="45" y2="32" stroke="#E5E7EB" strokeWidth="0.5" />
      {/* Checkmarks - 7 checks in a row */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const cx = 23 + col * 6;
        const cy = 30 + row * 6;
        return (
          <polyline
            key={i}
            points={`${cx - 2},${cy} ${cx},${cy + 2} ${cx + 3},${cy - 2}`}
            fill="none"
            stroke={c.dark}
            strokeWidth="1.5"
          />
        );
      })}
      {/* "7" overlay */}
      <text x="32" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="5" fill="#FFFFFF">7 DAYS</text>
    </MedalBase>
  );
}

/** 10. Fortnight of Focus - Two-week calendar badge */
export function FortnightOfFocusIcon({ size = 64, className }: IconProps) {
  const id = 'ach-fortnight';
  const c = COLORS.consistency;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-badge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* Shield shape */}
      <path
        d="M22,20 L42,20 L42,34 Q42,42 32,44 Q22,42 22,34Z"
        fill={`url(#${id}-badge)`}
        stroke={c.dark}
        strokeWidth="2"
      />
      {/* Inner shield */}
      <path
        d="M25,23 L39,23 L39,33 Q39,39 32,41 Q25,39 25,33Z"
        fill={c.light}
        stroke={c.dark}
        strokeWidth="0.8"
      />
      {/* "14" text */}
      <text
        x="32"
        y="33"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="11"
        fill={c.dark}
      >
        14
      </text>
      {/* Lightning bolt accent */}
      <polygon points="35,18 32,24 34,24 31,30 37,22 35,22" fill="#FCD34D" stroke="#F59E0B" strokeWidth="0.5" />
    </MedalBase>
  );
}

/** 11. Iron Will - Iron anvil */
export function IronWillIcon({ size = 64, className }: IconProps) {
  const id = 'ach-iron-will';
  const c = COLORS.consistency;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-anvil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="50%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>
      {/* Anvil top surface */}
      <path
        d="M20,28 L24,25 L40,25 L44,28 L20,28Z"
        fill={`url(#${id}-anvil)`}
        stroke="#1F2937"
        strokeWidth="1.5"
      />
      {/* Anvil horn (left) */}
      <path d="M20,28 L16,27 Q14,27 15,29 L20,30" fill="#6B7280" stroke="#1F2937" strokeWidth="1" />
      {/* Anvil body */}
      <rect x="24" y="28" width="16" height="8" fill="#6B7280" stroke="#1F2937" strokeWidth="1" />
      {/* Anvil base */}
      <path
        d="M22,36 L42,36 L44,40 L20,40Z"
        fill="#4B5563"
        stroke="#1F2937"
        strokeWidth="1.5"
      />
      {/* Shine on top */}
      <line x1="26" y1="26" x2="38" y2="26" stroke="#D1D5DB" strokeWidth="0.8" opacity="0.6" />
      {/* Sparks */}
      <circle cx="30" cy="22" r="1" fill="#FCD34D" />
      <circle cx="34" cy="20" r="0.8" fill="#FBBF24" />
      <circle cx="28" cy="20" r="0.6" fill="#F59E0B" />
      {/* "30" text */}
      <text x="32" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="4" fill="#FFFFFF" opacity="0.9">30</text>
    </MedalBase>
  );
}

/** 12. Challenger - Sword/challenge flag */
export function ChallengerIcon({ size = 64, className }: IconProps) {
  const id = 'ach-challenger';
  const c = COLORS.consistency;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-blade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#9CA3AF" />
        </linearGradient>
        <linearGradient id={`${id}-flag`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* Flag pole */}
      <line x1="27" y1="18" x2="27" y2="42" stroke="#8B5E34" strokeWidth="2" />
      {/* Flag */}
      <path
        d="M28,18 L42,22 L28,28Z"
        fill={`url(#${id}-flag)`}
        stroke={c.dark}
        strokeWidth="1.5"
      />
      {/* Flag detail stripe */}
      <line x1="28" y1="23" x2="38" y2="23" stroke={c.light} strokeWidth="1" opacity="0.5" />
      {/* Pole cap */}
      <circle cx="27" cy="17" r="2" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
      {/* Crossed sword behind */}
      <line x1="33" y1="22" x2="42" y2="40" stroke={`url(#${id}-blade)`} strokeWidth="2" />
      {/* Sword guard */}
      <line x1="36" y1="28" x2="40" y2="26" stroke="#B8860B" strokeWidth="2" />
      {/* Sword handle */}
      <line x1="40" y1="37" x2="43" y2="42" stroke="#8B5E34" strokeWidth="2" />
    </MedalBase>
  );
}

/** 13. Weekend Warrior - Shield with weekend badge */
export function WeekendWarriorIcon({ size = 64, className }: IconProps) {
  const id = 'ach-weekend-warrior';
  const c = COLORS.consistency;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-shield`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={c.light} />
        </linearGradient>
      </defs>
      {/* Shield */}
      <path
        d="M20,18 L44,18 L44,33 Q44,42 32,46 Q20,42 20,33Z"
        fill={`url(#${id}-shield)`}
        stroke={c.dark}
        strokeWidth="2"
      />
      {/* Inner shield area */}
      <path
        d="M23,21 L41,21 L41,32 Q41,39 32,42 Q23,39 23,32Z"
        fill={`url(#${id}-inner)`}
        stroke={c.dark}
        strokeWidth="0.8"
      />
      {/* "S S" for Sat/Sun */}
      <text x="28" y="30" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="8" fill={c.dark}>S</text>
      <text x="34" y="38" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="8" fill={c.dark}>S</text>
      {/* Connecting slash */}
      <line x1="34" y1="23" x2="29" y2="39" stroke={c.base} strokeWidth="1" opacity="0.5" />
      {/* Star at top */}
      <polygon points="32,15 33,17 35,17 33.5,18.5 34,20.5 32,19.5 30,20.5 30.5,18.5 29,17 31,17" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" />
    </MedalBase>
  );
}
