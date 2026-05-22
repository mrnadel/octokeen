'use client';

import React from 'react';
import { MedalBase, COLORS, IconProps } from './shared';

// ════════════════════════════════════════════════════════════════════════════
// EXPLORATION (5) - Cyan
// ════════════════════════════════════════════════════════════════════════════

/** 19. First Steps - Footprints / boot prints */
export function FirstStepsIcon({ size = 64, className }: IconProps) {
  const id = 'ach-first-steps';
  const c = COLORS.exploration;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-foot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* Left footprint */}
      <ellipse cx="27" cy="33" rx="4" ry="6" fill={`url(#${id}-foot)`} stroke={c.dark} strokeWidth="1" />
      <circle cx="25" cy="25" r="1.8" fill={c.base} stroke={c.dark} strokeWidth="0.8" />
      <circle cx="28" cy="24" r="1.5" fill={c.base} stroke={c.dark} strokeWidth="0.8" />
      <circle cx="30.5" cy="25" r="1.3" fill={c.base} stroke={c.dark} strokeWidth="0.8" />
      <circle cx="32" cy="27" r="1.2" fill={c.base} stroke={c.dark} strokeWidth="0.8" />
      {/* Right footprint (higher, walking) */}
      <ellipse cx="37" cy="26" rx="4" ry="6" fill={`url(#${id}-foot)`} stroke={c.dark} strokeWidth="1" opacity="0.7" />
      <circle cx="35" cy="18" r="1.8" fill={c.base} stroke={c.dark} strokeWidth="0.8" opacity="0.7" />
      <circle cx="38" cy="17" r="1.5" fill={c.base} stroke={c.dark} strokeWidth="0.8" opacity="0.7" />
      <circle cx="40.5" cy="18" r="1.3" fill={c.base} stroke={c.dark} strokeWidth="0.8" opacity="0.7" />
      <circle cx="42" cy="20" r="1.2" fill={c.base} stroke={c.dark} strokeWidth="0.8" opacity="0.7" />
      {/* Path dots leading forward */}
      <circle cx="22" cy="40" r="1" fill={c.base} opacity="0.3" />
      <circle cx="20" cy="38" r="0.7" fill={c.base} opacity="0.2" />
    </MedalBase>
  );
}

/** 20. Renaissance Engineer - Da Vinci style compass + gear */
export function RenaissanceEngineerIcon({ size = 64, className }: IconProps) {
  const id = 'ach-renaissance';
  const c = COLORS.exploration;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      {/* Gear (behind) */}
      <circle cx="36" cy="33" r="6" fill="none" stroke={c.dark} strokeWidth="1.5" />
      <circle cx="36" cy="33" r="3.5" fill="none" stroke={c.dark} strokeWidth="1" />
      {/* Gear teeth */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 36 + 6 * Math.cos(rad);
        const y1 = 33 + 6 * Math.sin(rad);
        const x2 = 36 + 8 * Math.cos(rad);
        const y2 = 33 + 8 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.dark} strokeWidth="2" />;
      })}
      {/* Dividers/Compass (Da Vinci style) */}
      {/* Hinge */}
      <circle cx="28" cy="18" r="2" fill={`url(#${id}-brass)`} stroke="#8B6914" strokeWidth="1" />
      {/* Left leg */}
      <line x1="28" y1="19" x2="22" y2="38" stroke={`url(#${id}-brass)`} strokeWidth="2" />
      {/* Right leg */}
      <line x1="28" y1="19" x2="34" y2="38" stroke={`url(#${id}-brass)`} strokeWidth="2" />
      {/* Leg points */}
      <circle cx="22" cy="38" r="1" fill="#8B6914" />
      <circle cx="34" cy="38" r="1" fill="#8B6914" />
      {/* Arc drawn by compass */}
      <path d="M24,36 Q28,30 32,36" fill="none" stroke={c.base} strokeWidth="0.8" strokeDasharray="1.5,1" />
    </MedalBase>
  );
}

/** 21. Polymath - Multiple domain symbols (book + gear + flask) */
export function PolymathIcon({ size = 64, className }: IconProps) {
  const id = 'ach-polymath';
  const c = COLORS.exploration;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-book`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      {/* Book (left) */}
      <path d="M18,28 L18,40 Q22,38 26,40 L26,28 Q22,26 18,28Z" fill={`url(#${id}-book)`} stroke="#1E3A8A" strokeWidth="1" />
      <path d="M26,28 L26,40 Q30,38 34,40 L34,28 Q30,26 26,28Z" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1" />
      <line x1="26" y1="28" x2="26" y2="40" stroke="#1E3A8A" strokeWidth="1" />
      {/* Book lines */}
      <line x1="20" y1="31" x2="24" y2="30" stroke="#BFDBFE" strokeWidth="0.5" />
      <line x1="20" y1="33" x2="24" y2="32" stroke="#BFDBFE" strokeWidth="0.5" />
      {/* Gear (top right) */}
      <circle cx="39" cy="23" r="4" fill="none" stroke={c.dark} strokeWidth="1.5" />
      <circle cx="39" cy="23" r="2" fill={c.light} stroke={c.dark} strokeWidth="0.8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={39 + 4 * Math.cos(r)}
            y1={23 + 4 * Math.sin(r)}
            x2={39 + 5.5 * Math.cos(r)}
            y2={23 + 5.5 * Math.sin(r)}
            stroke={c.dark}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Flask (bottom right) */}
      <path d="M37,32 L37,36 L34,42 L44,42 L41,36 L41,32Z" fill="#CFFAFE" stroke={c.dark} strokeWidth="1" />
      <rect x="37" y="30" width="4" height="3" rx="0.5" fill="none" stroke={c.dark} strokeWidth="1" />
      {/* Liquid in flask */}
      <path d="M35,39 L43,39 L44,42 L34,42Z" fill={c.base} opacity="0.5" />
      {/* Bubbles */}
      <circle cx="38" cy="38" r="0.7" fill="#FFFFFF" opacity="0.7" />
      <circle cx="40" cy="37" r="0.5" fill="#FFFFFF" opacity="0.5" />
    </MedalBase>
  );
}

/** 22. Format Master - Multiple card types / formats */
export function FormatMasterIcon({ size = 64, className }: IconProps) {
  const id = 'ach-format-master';
  const c = COLORS.exploration;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-card1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id={`${id}-card2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CFFAFE" />
        </linearGradient>
        <linearGradient id={`${id}-card3`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      {/* Card 1 (back, rotated left) */}
      <rect x="17" y="20" width="16" height="22" rx="2" fill={`url(#${id}-card1)`} stroke="#3B82F6" strokeWidth="1.5" transform="rotate(-10 25 31)" />
      <line x1="19" y1="26" x2="31" y2="24" stroke="#3B82F6" strokeWidth="1" opacity="0.5" transform="rotate(-10 25 25)" />
      {/* Card 2 (middle) */}
      <rect x="24" y="19" width="16" height="22" rx="2" fill={`url(#${id}-card2)`} stroke={c.dark} strokeWidth="1.5" />
      <line x1="27" y1="24" x2="37" y2="24" stroke={c.dark} strokeWidth="1" opacity="0.5" />
      <circle cx="32" cy="31" r="3" fill="none" stroke={c.base} strokeWidth="1" />
      <text x="32" y="33" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4" fontWeight="700" fill={c.dark}>?</text>
      {/* Card 3 (front, rotated right) */}
      <rect x="31" y="20" width="16" height="22" rx="2" fill={`url(#${id}-card3)`} stroke="#F59E0B" strokeWidth="1.5" transform="rotate(10 39 31)" />
      <line x1="34" y1="26" x2="44" y2="28" stroke="#F59E0B" strokeWidth="1" opacity="0.5" transform="rotate(10 39 27)" />
      {/* Checkmarks on cards */}
      <polyline points="34,34 35.5,36 39,31" fill="none" stroke="#10B981" strokeWidth="1.5" transform="rotate(10 36.5 33.5)" />
    </MedalBase>
  );
}

/** 23. Bookmarked for Later - Bookmark ribbon with star */
export function BookmarkedIcon({ size = 64, className }: IconProps) {
  const id = 'ach-bookmarked';
  const c = COLORS.exploration;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id={`${id}-page`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3F4F6" />
        </linearGradient>
      </defs>
      {/* Page/book background */}
      <rect x="21" y="18" width="22" height="26" rx="1.5" fill={`url(#${id}-page)`} stroke="#D1D5DB" strokeWidth="1.5" />
      {/* Page lines */}
      <line x1="24" y1="23" x2="40" y2="23" stroke="#E5E7EB" strokeWidth="0.8" />
      <line x1="24" y1="26" x2="38" y2="26" stroke="#E5E7EB" strokeWidth="0.8" />
      <line x1="24" y1="29" x2="40" y2="29" stroke="#E5E7EB" strokeWidth="0.8" />
      <line x1="24" y1="32" x2="36" y2="32" stroke="#E5E7EB" strokeWidth="0.8" />
      <line x1="24" y1="35" x2="40" y2="35" stroke="#E5E7EB" strokeWidth="0.8" />
      <line x1="24" y1="38" x2="34" y2="38" stroke="#E5E7EB" strokeWidth="0.8" />
      {/* Bookmark ribbon */}
      <path
        d="M36,16 L36,34 L40,30 L44,34 L44,16Z"
        fill={`url(#${id}-ribbon)`}
        stroke={c.dark}
        strokeWidth="1.5"
      />
      {/* Star on ribbon */}
      <polygon
        points="40,20 41.2,22.5 44,22.8 42,24.8 42.5,27.5 40,26 37.5,27.5 38,24.8 36,22.8 38.8,22.5"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
    </MedalBase>
  );
}
