'use client';

import React from 'react';
import { AvatarPlaceholder, FrameIconProps } from './utils';
import { SVGIcon } from '../SVGIcon';

// ============================================================================
// REWARD FRAMES — Streak milestones
// ============================================================================

/** Iron Will — 30 day streak, slate gray with fire */
export const FrameIronWill: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-streak-iron-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-streak-iron-grad)" strokeWidth="3.5" fill="none" />
    {/* small flame at top */}
    <path d="M32 3 Q34 6 33 8 Q32 10 31 8 Q30 6 32 3" fill="#F97316" opacity="0.7" />
    {/* streak hash marks */}
    <line x1="18" y1="5" x2="18" y2="8" stroke="#64748B" strokeWidth="1" opacity="0.4" />
    <line x1="46" y1="5" x2="46" y2="8" stroke="#64748B" strokeWidth="1" opacity="0.4" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Diamond Mind — 60 day streak, blue diamond */
export const FrameDiamondMind: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-streak-diamond-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#BFDBFE" />
        <stop offset="30%" stopColor="#60A5FA" />
        <stop offset="70%" stopColor="#BFDBFE" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <radialGradient id="frame-streak-diamond-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(96,165,250,0.2)" />
        <stop offset="100%" stopColor="rgba(96,165,250,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-streak-diamond-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-streak-diamond-grad)" strokeWidth="3" fill="none" />
    {/* diamond shape at top */}
    <polygon points="32,1 36,5 32,9 28,5" fill="#60A5FA" opacity="0.8" />
    <polygon points="32,2 34,5 32,8 30,5" fill="#BFDBFE" opacity="0.5" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Centurion — 100 day streak, golden crown */
export const FrameCenturion: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-streak-centurion-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="30%" stopColor="#FBBF24" />
        <stop offset="60%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <radialGradient id="frame-streak-centurion-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="78%" stopColor="rgba(251,191,36,0.2)" />
        <stop offset="100%" stopColor="rgba(251,191,36,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-streak-centurion-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-streak-centurion-grad)" strokeWidth="3.5" fill="none" />
    {/* centurion crown */}
    <path d="M26 5 L28 0 L30 4 L32 0 L34 4 L36 0 L38 5 L36 7 L28 7 Z" fill="#FBBF24" opacity="0.85" />
    {/* 100 text */}
    <text x="32" y="62" textAnchor="middle" fontSize="5" fill="#FBBF24" fontWeight="bold" opacity="0.6">100</text>
    <AvatarPlaceholder />
  </SVGIcon>
);

// ============================================================================
// REWARD FRAMES — Achievement milestones
// ============================================================================

/** First Gold — first golden lesson complete */
export const FrameFirstGold: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-first-gold-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-first-gold-grad)" strokeWidth="3" fill="none" />
    {/* medal ribbon at top */}
    <path d="M28 3 L26 8 L32 6 L38 8 L36 3" stroke="#CA8A04" strokeWidth="1" fill="none" opacity="0.6" />
    <circle cx="32" cy="5" r="2" fill="#CA8A04" opacity="0.7" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Marathon Runner — 1000 correct answers */
export const FrameMarathonRunner: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-marathon-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-marathon-grad)" strokeWidth="3" fill="none" />
    {/* finish line pattern at top */}
    <rect x="28" y="3" width="2" height="2" fill="#2563EB" opacity="0.6" />
    <rect x="30" y="5" width="2" height="2" fill="#2563EB" opacity="0.6" />
    <rect x="32" y="3" width="2" height="2" fill="#2563EB" opacity="0.6" />
    <rect x="34" y="5" width="2" height="2" fill="#2563EB" opacity="0.6" />
    {/* motion lines */}
    <line x1="4" y1="28" x2="8" y2="28" stroke="#2563EB" strokeWidth="0.8" opacity="0.3" />
    <line x1="4" y1="32" x2="6" y2="32" stroke="#2563EB" strokeWidth="0.8" opacity="0.3" />
    <line x1="4" y1="36" x2="8" y2="36" stroke="#2563EB" strokeWidth="0.8" opacity="0.3" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Early Adopter — first 100 users */
export const FrameEarlyAdopter: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-early-bird-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-early-bird-grad)" strokeWidth="3" fill="none" />
    {/* sunrise motif at top */}
    <circle cx="32" cy="4" r="3" fill="#F97316" opacity="0.6" />
    <line x1="26" y1="4" x2="22" y2="2" stroke="#F97316" strokeWidth="0.8" opacity="0.4" />
    <line x1="38" y1="4" x2="42" y2="2" stroke="#F97316" strokeWidth="0.8" opacity="0.4" />
    <line x1="32" y1="1" x2="32" y2="-1" stroke="#F97316" strokeWidth="0.8" opacity="0.4" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Flawless — 100% accuracy on entire unit */
export const FrameFlawless: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-perfect-unit-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064E3B" />
      </linearGradient>
      <radialGradient id="frame-perfect-unit-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(5,150,105,0.2)" />
        <stop offset="100%" stopColor="rgba(5,150,105,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-perfect-unit-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-perfect-unit-grad)" strokeWidth="3" fill="none" />
    {/* checkmark at top */}
    <path d="M28 4 L31 7 L36 2" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Speed Demon — 10 lessons in a day */
export const FrameSpeedDemon: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-speed-demon-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-speed-demon-grad)" strokeWidth="3" fill="none" />
    {/* lightning bolt at top */}
    <path d="M30 1 L28 5 L31 5 L29 9 L34 4 L31 4 L33 1 Z" fill="#EAB308" opacity="0.8" />
    {/* speed lines */}
    <line x1="3" y1="26" x2="7" y2="28" stroke="#EAB308" strokeWidth="0.8" opacity="0.3" />
    <line x1="2" y1="32" x2="6" y2="32" stroke="#EAB308" strokeWidth="0.8" opacity="0.4" />
    <line x1="3" y1="38" x2="7" y2="36" stroke="#EAB308" strokeWidth="0.8" opacity="0.3" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Perfectionist — 100% accuracy on 25 lessons */
export const FramePerfectionist: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-perfectionist-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="50%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>
      <radialGradient id="frame-perfectionist-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(220,38,38,0.2)" />
        <stop offset="100%" stopColor="rgba(220,38,38,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-perfectionist-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-perfectionist-grad)" strokeWidth="3" fill="none" />
    {/* target/bullseye at top */}
    <circle cx="32" cy="4" r="3" stroke="#DC2626" strokeWidth="0.8" fill="none" opacity="0.6" />
    <circle cx="32" cy="4" r="1.5" fill="#DC2626" opacity="0.7" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Golden Engineer — all golden lessons complete */
export const FrameGoldenEngineer: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-all-gold-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="25%" stopColor="#EAB308" />
        <stop offset="50%" stopColor="#FEF3C7" />
        <stop offset="75%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
      <radialGradient id="frame-all-gold-glow" cx="50%" cy="50%" r="50%">
        <stop offset="45%" stopColor="transparent" />
        <stop offset="70%" stopColor="rgba(234,179,8,0.3)" />
        <stop offset="100%" stopColor="rgba(234,179,8,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-all-gold-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-all-gold-grad)" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="29" stroke="#EAB308" strokeWidth="0.5" fill="none" opacity="0.5" />
    {/* crown at top */}
    <path d="M26 5 L28 0 L30 4 L32 0 L34 4 L36 0 L38 5 L36 7 L28 7 Z" fill="#EAB308" opacity="0.85" />
    {/* star particles */}
    <circle cx="8" cy="32" r="1" fill="#FEF3C7" opacity="0.5" />
    <circle cx="56" cy="32" r="1" fill="#FEF3C7" opacity="0.5" />
    <circle cx="32" cy="60" r="1" fill="#FEF3C7" opacity="0.5" />
    <AvatarPlaceholder />
  </SVGIcon>
);

// ============================================================================
// REWARD FRAMES — Level milestones
// ============================================================================

/** Engineer's Crest — Level 15 */
export const FrameEngineersCrest: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-level15-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#C7D2FE" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#312E81" />
      </linearGradient>
      <radialGradient id="frame-level15-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(79,70,229,0.2)" />
        <stop offset="100%" stopColor="rgba(79,70,229,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-level15-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-level15-grad)" strokeWidth="3" fill="none" />
    {/* crest shield at top */}
    <path d="M28 2 L36 2 L36 8 L32 11 L28 8 Z" fill="#2563EB" opacity="0.7" />
    <path d="M30 4 L34 4 L34 7 L32 9 L30 7 Z" fill="#C7D2FE" opacity="0.4" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Master's Mark — Level 20 */
export const FrameMastersMark: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-level20-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#DDD6FE" />
        <stop offset="30%" stopColor="#7C3AED" />
        <stop offset="70%" stopColor="#DDD6FE" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      <radialGradient id="frame-level20-glow" cx="50%" cy="50%" r="50%">
        <stop offset="50%" stopColor="transparent" />
        <stop offset="78%" stopColor="rgba(124,58,237,0.25)" />
        <stop offset="100%" stopColor="rgba(124,58,237,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-level20-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-level20-grad)" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="29.5" stroke="#7C3AED" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* pillar emblem at top */}
    <rect x="29" y="2" width="6" height="7" rx="1" fill="#7C3AED" opacity="0.7" />
    <rect x="28" y="2" width="8" height="2" rx="0.5" fill="#7C3AED" opacity="0.8" />
    <rect x="28" y="8" width="8" height="1.5" rx="0.5" fill="#7C3AED" opacity="0.8" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Elite Badge — Level 25 */
export const FrameEliteBadge: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-level25-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#A7F3D0" />
        <stop offset="30%" stopColor="#059669" />
        <stop offset="70%" stopColor="#A7F3D0" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <radialGradient id="frame-level25-glow" cx="50%" cy="50%" r="50%">
        <stop offset="50%" stopColor="transparent" />
        <stop offset="78%" stopColor="rgba(5,150,105,0.25)" />
        <stop offset="100%" stopColor="rgba(5,150,105,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-level25-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-level25-grad)" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="29.5" stroke="#059669" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* badge/star emblem at top */}
    <polygon points="32,1 34,5 38,5 35,8 36,12 32,10 28,12 29,8 26,5 30,5" fill="#059669" opacity="0.7" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Grandmaster Crown — Level 30 (MAX) */
export const FrameGrandmasterCrown: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-level30-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="25%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#FCA5A5" />
        <stop offset="75%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#FCA5A5" />
      </linearGradient>
      <radialGradient id="frame-level30-glow" cx="50%" cy="50%" r="50%">
        <stop offset="40%" stopColor="transparent" />
        <stop offset="65%" stopColor="rgba(220,38,38,0.3)" />
        <stop offset="85%" stopColor="rgba(220,38,38,0.15)" />
        <stop offset="100%" stopColor="rgba(220,38,38,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-level30-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-level30-grad)" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="29" stroke="#DC2626" strokeWidth="0.5" fill="none" opacity="0.5" />
    <circle cx="32" cy="32" r="23.5" stroke="#DC2626" strokeWidth="0.5" fill="none" opacity="0.3" />
    {/* grand crown with jewels */}
    <path d="M24 6 L26 0 L29 5 L32 -1 L35 5 L38 0 L40 6 L38 8 L26 8 Z" fill="#DC2626" opacity="0.85" />
    <circle cx="32" cy="2" r="1" fill="#FCA5A5" opacity="0.8" />
    <circle cx="27" cy="3" r="0.7" fill="#FEF3C7" opacity="0.7" />
    <circle cx="37" cy="3" r="0.7" fill="#FEF3C7" opacity="0.7" />
    {/* sparkle particles */}
    <circle cx="6" cy="32" r="1" fill="#FCA5A5" opacity="0.5" />
    <circle cx="58" cy="32" r="1" fill="#FCA5A5" opacity="0.5" />
    <circle cx="32" cy="62" r="1" fill="#FCA5A5" opacity="0.5" />
    <AvatarPlaceholder />
  </SVGIcon>
);
