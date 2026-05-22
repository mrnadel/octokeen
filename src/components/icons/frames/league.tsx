'use client';

import React from 'react';
import { AvatarPlaceholder, FrameIconProps } from './utils';

// ============================================================================
// REWARD FRAMES — League
// ============================================================================

/** Bronze League — warm bronze ring with shield */
export const FrameBronzeLeague: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-league-bronze-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#DEB887" />
        <stop offset="40%" stopColor="#CD7F32" />
        <stop offset="100%" stopColor="#8B5E3C" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-league-bronze-grad)" strokeWidth="3.5" fill="none" />
    {/* shield emblem at top */}
    <path d="M32 2 L36 6 L36 10 L32 12 L28 10 L28 6 Z" fill="#CD7F32" opacity="0.8" />
    <AvatarPlaceholder />
  </svg>
);

/** Silver League — polished silver ring */
export const FrameSilverLeague: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-league-silver-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#E8E8E8" />
        <stop offset="30%" stopColor="#C0C0C0" />
        <stop offset="60%" stopColor="#E0E0E0" />
        <stop offset="100%" stopColor="#A0A0A0" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-league-silver-grad)" strokeWidth="3.5" fill="none" />
    <circle cx="32" cy="32" r="29.5" stroke="#C0C0C0" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* shield emblem */}
    <path d="M32 2 L36 6 L36 10 L32 12 L28 10 L28 6 Z" fill="#C0C0C0" opacity="0.8" />
    <AvatarPlaceholder />
  </svg>
);

/** Gold League — shiny gold with laurels */
export const FrameGoldLeague: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-league-gold-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FFF8DC" />
        <stop offset="30%" stopColor="#FFD700" />
        <stop offset="60%" stopColor="#FFF8DC" />
        <stop offset="100%" stopColor="#DAA520" />
      </linearGradient>
      <radialGradient id="frame-league-gold-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(255,215,0,0.15)" />
        <stop offset="100%" stopColor="rgba(255,215,0,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-league-gold-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-league-gold-grad)" strokeWidth="3.5" fill="none" />
    {/* laurel leaves */}
    <path d="M12 50 Q8 44 10 38" stroke="#DAA520" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M52 50 Q56 44 54 38" stroke="#DAA520" strokeWidth="1" fill="none" opacity="0.5" />
    {/* crown at top */}
    <path d="M28 4 L30 1 L32 4 L34 1 L36 4 L34 6 L30 6 Z" fill="#FFD700" opacity="0.8" />
    <AvatarPlaceholder />
  </svg>
);

/** Platinum League — cyan-tinted platinum */
export const FramePlatinumLeague: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-league-platinum-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#E0F7FA" />
        <stop offset="30%" stopColor="#00BCD4" />
        <stop offset="60%" stopColor="#B2EBF2" />
        <stop offset="100%" stopColor="#00838F" />
      </linearGradient>
      <radialGradient id="frame-league-platinum-glow" cx="50%" cy="50%" r="50%">
        <stop offset="50%" stopColor="transparent" />
        <stop offset="78%" stopColor="rgba(0,188,212,0.2)" />
        <stop offset="100%" stopColor="rgba(0,188,212,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-league-platinum-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-league-platinum-grad)" strokeWidth="3.5" fill="none" />
    <circle cx="32" cy="32" r="29.5" stroke="#00BCD4" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* diamond emblem top */}
    <polygon points="32,1 35,5 32,9 29,5" fill="#00BCD4" opacity="0.8" />
    <AvatarPlaceholder />
  </svg>
);

/** Masters League — royal purple with crown */
export const FrameMastersLeague: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-league-masters-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#E1BEE7" />
        <stop offset="30%" stopColor="#9C27B0" />
        <stop offset="60%" stopColor="#CE93D8" />
        <stop offset="100%" stopColor="#6A1B9A" />
      </linearGradient>
      <radialGradient id="frame-league-masters-glow" cx="50%" cy="50%" r="50%">
        <stop offset="45%" stopColor="transparent" />
        <stop offset="75%" stopColor="rgba(156,39,176,0.25)" />
        <stop offset="100%" stopColor="rgba(156,39,176,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-league-masters-glow)" />
    <circle cx="32" cy="32" r="27" stroke="url(#frame-league-masters-grad)" strokeWidth="3.5" fill="none" />
    <circle cx="32" cy="32" r="30" stroke="#9C27B0" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* ornate crown */}
    <path d="M26 5 L28 0 L30 4 L32 0 L34 4 L36 0 L38 5 L36 7 L28 7 Z" fill="#9C27B0" opacity="0.85" />
    <circle cx="32" cy="2" r="1" fill="#E1BEE7" opacity="0.7" />
    <AvatarPlaceholder />
  </svg>
);
