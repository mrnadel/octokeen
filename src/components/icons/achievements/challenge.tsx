'use client';

import React from 'react';
import { MedalBase, COLORS, IconProps } from './shared';

// ════════════════════════════════════════════════════════════════════════════
// CHALLENGE (5) - Amber
// ════════════════════════════════════════════════════════════════════════════

/** 14. Quick Draw - Stopwatch/timer */
export function QuickDrawIcon({ size = 64, className }: IconProps) {
  const id = 'ach-quick-draw';
  const c = COLORS.challenge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-watch`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9FAFB" />
          <stop offset="100%" stopColor="#E5E7EB" />
        </linearGradient>
      </defs>
      {/* Stopwatch body */}
      <circle cx="32" cy="32" r="12" fill={`url(#${id}-watch)`} stroke="#374151" strokeWidth="2" />
      {/* Inner rim */}
      <circle cx="32" cy="32" r="10" fill="none" stroke="#D1D5DB" strokeWidth="0.8" />
      {/* Top button */}
      <rect x="30" y="18" width="4" height="3" rx="1" fill="#6B7280" stroke="#374151" strokeWidth="1" />
      {/* Side button */}
      <rect x="43" y="27" width="3" height="3" rx="0.5" fill="#6B7280" stroke="#374151" strokeWidth="0.8" />
      {/* Clock hand - minute */}
      <line x1="32" y1="32" x2="32" y2="24" stroke={c.dark} strokeWidth="1.5" />
      {/* Clock hand - second */}
      <line x1="32" y1="32" x2="38" y2="29" stroke="#EF4444" strokeWidth="1" />
      {/* Center dot */}
      <circle cx="32" cy="32" r="1.5" fill="#374151" />
      {/* Tick marks */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + 9 * Math.cos(rad);
        const y1 = 32 + 9 * Math.sin(rad);
        const x2 = 32 + 10 * Math.cos(rad);
        const y2 = 32 + 10 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1.5" />;
      })}
      {/* Speed lines */}
      <line x1="18" y1="26" x2="15" y2="25" stroke={c.base} strokeWidth="1.5" />
      <line x1="18" y1="32" x2="14" y2="32" stroke={c.base} strokeWidth="1.5" />
      <line x1="18" y1="38" x2="15" y2="39" stroke={c.base} strokeWidth="1.5" />
    </MedalBase>
  );
}

/** 15. Confidence Calibrated - Calibration dial/gauge */
export function ConfidenceCalibratedIcon({ size = 64, className }: IconProps) {
  const id = 'ach-confidence';
  const c = COLORS.challenge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-gauge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Gauge background */}
      <path
        d="M20,37 A14,14 0 0,1 44,37"
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="4"
      />
      {/* Gauge colored arc */}
      <path
        d="M20,37 A14,14 0 0,1 44,37"
        fill="none"
        stroke={`url(#${id}-gauge)`}
        strokeWidth="3"
      />
      {/* Tick marks on gauge */}
      {[-135, -112.5, -90, -67.5, -45].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + 11 * Math.cos(rad);
        const y1 = 37 + 11 * Math.sin(rad);
        const x2 = 32 + 13 * Math.cos(rad);
        const y2 = 37 + 13 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6B7280" strokeWidth="1" />;
      })}
      {/* Needle pointing to green (right) */}
      <line x1="32" y1="37" x2="42" y2="28" stroke="#1F2937" strokeWidth="2" />
      {/* Needle base */}
      <circle cx="32" cy="37" r="2.5" fill="#374151" stroke="#1F2937" strokeWidth="1" />
      <circle cx="32" cy="37" r="1" fill="#D1D5DB" />
      {/* Checkmark at the green end */}
      <polyline points="41,22 43,24.5 47,19" fill="none" stroke="#10B981" strokeWidth="2" />
    </MedalBase>
  );
}

/** 16. Eagle Eye - Eye with magnifying detail */
export function EagleEyeIcon({ size = 64, className }: IconProps) {
  const id = 'ach-eagle-eye';
  const c = COLORS.challenge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <radialGradient id={`${id}-iris`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
      </defs>
      {/* Eye shape outer */}
      <path
        d="M18,30 Q25,20 32,20 Q39,20 46,30 Q39,40 32,40 Q25,40 18,30Z"
        fill="#FFFFFF"
        stroke="#374151"
        strokeWidth="2"
      />
      {/* Iris */}
      <circle cx="32" cy="30" r="6" fill={`url(#${id}-iris)`} stroke="#78350F" strokeWidth="1" />
      {/* Pupil */}
      <circle cx="32" cy="30" r="2.5" fill="#1F2937" />
      {/* Pupil highlight */}
      <circle cx="33.5" cy="28.5" r="1" fill="#FFFFFF" opacity="0.8" />
      <circle cx="31" cy="31" r="0.5" fill="#FFFFFF" opacity="0.5" />
      {/* Magnifying glass overlay (bottom-right) */}
      <circle cx="40" cy="36" r="5" fill="none" stroke={c.dark} strokeWidth="2" />
      <line x1="43.5" y1="39.5" x2="47" y2="43" stroke={c.dark} strokeWidth="2.5" />
      {/* Magnifying glass shine */}
      <path d="M37,34 Q38,33 39,34" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
    </MedalBase>
  );
}

/** 17. Scenario Commander - Map with strategy pins */
export function ScenarioCommanderIcon({ size = 64, className }: IconProps) {
  const id = 'ach-scenario';
  const c = COLORS.challenge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-map`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>
      {/* Map/parchment background */}
      <path
        d="M19,20 Q20,18 22,20 L42,20 Q44,18 45,20 L45,40 Q44,42 42,40 L22,40 Q20,42 19,40Z"
        fill={`url(#${id}-map)`}
        stroke="#D97706"
        strokeWidth="1.5"
      />
      {/* Map fold lines */}
      <line x1="28" y1="20" x2="28" y2="40" stroke="#D97706" strokeWidth="0.5" opacity="0.3" />
      <line x1="36" y1="20" x2="36" y2="40" stroke="#D97706" strokeWidth="0.5" opacity="0.3" />
      {/* Route path */}
      <path d="M23,35 L28,28 L35,32 L40,25" fill="none" stroke={c.dark} strokeWidth="1.5" strokeDasharray="2,1" />
      {/* Pin 1 - start */}
      <circle cx="23" cy="35" r="2" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
      <circle cx="23" cy="35" r="0.8" fill="#FFFFFF" />
      {/* Pin 2 - mid */}
      <circle cx="28" cy="28" r="1.5" fill={c.base} stroke={c.dark} strokeWidth="0.8" />
      {/* Pin 3 - mid */}
      <circle cx="35" cy="32" r="1.5" fill={c.base} stroke={c.dark} strokeWidth="0.8" />
      {/* Pin 4 - end (star) */}
      <polygon points="40,23 41,24.5 42.8,24.5 41.5,25.8 42,27.5 40,26.5 38,27.5 38.5,25.8 37.2,24.5 39,24.5" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" />
      {/* Compass rose */}
      <circle cx="41" cy="36" r="3" fill="none" stroke="#8B7355" strokeWidth="0.5" />
      <line x1="41" y1="33.5" x2="41" y2="38.5" stroke="#8B7355" strokeWidth="0.5" />
      <line x1="38.5" y1="36" x2="43.5" y2="36" stroke="#8B7355" strokeWidth="0.5" />
      <text x="41" y="34.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="2" fill="#8B7355">N</text>
    </MedalBase>
  );
}

/** 18. Gauntlet Runner - Running figure with obstacles */
export function GauntletRunnerIcon({ size = 64, className }: IconProps) {
  const id = 'ach-gauntlet';
  const c = COLORS.challenge;
  return (
    <MedalBase id={id} colors={c} size={size} className={className}>
      <defs>
        <linearGradient id={`${id}-runner`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* Ground line */}
      <line x1="18" y1="42" x2="46" y2="42" stroke="#D1D5DB" strokeWidth="1" />
      {/* Running figure */}
      {/* Head */}
      <circle cx="30" cy="22" r="3" fill={`url(#${id}-runner)`} stroke={c.dark} strokeWidth="1.5" />
      {/* Body */}
      <line x1="30" y1="25" x2="30" y2="33" stroke={c.dark} strokeWidth="2" />
      {/* Arms */}
      <polyline points="25,27 30,29 35,26" fill="none" stroke={c.dark} strokeWidth="2" />
      {/* Legs */}
      <line x1="30" y1="33" x2="25" y2="40" stroke={c.dark} strokeWidth="2" />
      <line x1="30" y1="33" x2="35" y2="40" stroke={c.dark} strokeWidth="2" />
      {/* Hurdle 1 */}
      <rect x="38" y="35" width="1.5" height="7" fill="#6B7280" />
      <rect x="37" y="35" width="6" height="1.5" rx="0.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.5" />
      {/* Hurdle 2 (already passed) */}
      <rect x="19" y="37" width="1.5" height="5" fill="#6B7280" />
      <rect x="18" y="37" width="6" height="1.5" rx="0.5" fill="#10B981" stroke="#047857" strokeWidth="0.5" />
      {/* Speed lines behind runner */}
      <line x1="22" y1="25" x2="18" y2="25" stroke={c.base} strokeWidth="1" opacity="0.6" />
      <line x1="23" y1="28" x2="18" y2="28" stroke={c.base} strokeWidth="1" opacity="0.4" />
      <line x1="22" y1="31" x2="19" y2="31" stroke={c.base} strokeWidth="1" opacity="0.3" />
      {/* Fire trail */}
      <path d="M24,39 Q22,37 23,35 Q24,37 25,36 Q24,38 24,39Z" fill="#F97316" opacity="0.6" />
    </MedalBase>
  );
}
