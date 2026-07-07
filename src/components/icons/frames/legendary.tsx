'use client';

import React from 'react';
import { AvatarPlaceholder, FrameIconProps } from './utils';
import { SVGIcon } from '../SVGIcon';

// ============================================================================
// SHOP FRAMES — Legendary
// ============================================================================

/** Singularity — legendary, dark void with indigo glow */
export const FrameSingularity: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <radialGradient id="frame-singularity-void" cx="50%" cy="50%" r="50%">
        <stop offset="30%" stopColor="#1E1B4B" />
        <stop offset="50%" stopColor="#312E81" />
        <stop offset="70%" stopColor="rgba(99,102,241,0.3)" />
        <stop offset="100%" stopColor="rgba(99,102,241,0)" />
      </radialGradient>
      <linearGradient id="frame-singularity-ring" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#C7D2FE" />
        <stop offset="25%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#A5B4FC" />
        <stop offset="75%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#C7D2FE" />
      </linearGradient>
      <radialGradient id="frame-singularity-glow" cx="50%" cy="50%" r="50%">
        <stop offset="35%" stopColor="transparent" />
        <stop offset="60%" stopColor="rgba(99,102,241,0.35)" />
        <stop offset="80%" stopColor="rgba(99,102,241,0.15)" />
        <stop offset="100%" stopColor="rgba(99,102,241,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-singularity-glow)" />
    <circle cx="32" cy="32" r="20" fill="url(#frame-singularity-void)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-singularity-ring)" strokeWidth="2" fill="none" />
    <circle cx="32" cy="32" r="29" stroke="#3B82F6" strokeWidth="0.5" fill="none" opacity="0.5" />
    <circle cx="32" cy="32" r="23" stroke="#3B82F6" strokeWidth="0.5" fill="none" opacity="0.3" />
    {/* event horizon particles being pulled in */}
    <circle cx="6" cy="20" r="0.8" fill="#A5B4FC" opacity="0.6" />
    <circle cx="58" cy="44" r="0.8" fill="#A5B4FC" opacity="0.6" />
    <circle cx="20" cy="58" r="0.6" fill="#C7D2FE" opacity="0.5" />
    <circle cx="44" cy="6" r="0.6" fill="#C7D2FE" opacity="0.5" />
    <circle cx="10" cy="48" r="0.5" fill="#818CF8" opacity="0.4" />
    <circle cx="54" cy="16" r="0.5" fill="#818CF8" opacity="0.4" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Fusion Reactor — legendary, cyan energy core */
export const FrameFusionReactor: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-fusion-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#A5F3FC" />
        <stop offset="30%" stopColor="#06B6D4" />
        <stop offset="60%" stopColor="#0891B2" />
        <stop offset="100%" stopColor="#A5F3FC" />
      </linearGradient>
      <radialGradient id="frame-fusion-core" cx="50%" cy="50%" r="50%">
        <stop offset="30%" stopColor="rgba(6,182,212,0.15)" />
        <stop offset="55%" stopColor="rgba(6,182,212,0.3)" />
        <stop offset="75%" stopColor="rgba(6,182,212,0.15)" />
        <stop offset="100%" stopColor="rgba(6,182,212,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-fusion-core)" />
    {/* containment rings */}
    <circle cx="32" cy="32" r="26" stroke="url(#frame-fusion-grad)" strokeWidth="2.5" fill="none" />
    <circle cx="32" cy="32" r="29" stroke="#06B6D4" strokeWidth="0.8" fill="none" opacity="0.5" />
    <circle cx="32" cy="32" r="23" stroke="#06B6D4" strokeWidth="0.8" fill="none" opacity="0.4" />
    {/* magnetic field lines (ellipses) */}
    <ellipse cx="32" cy="32" rx="30" ry="14" stroke="#22D3EE" strokeWidth="0.6" fill="none" opacity="0.3" />
    <ellipse cx="32" cy="32" rx="14" ry="30" stroke="#22D3EE" strokeWidth="0.6" fill="none" opacity="0.3" />
    {/* energy particles */}
    <circle cx="32" cy="2" r="1.2" fill="#A5F3FC" opacity="0.7" />
    <circle cx="62" cy="32" r="1.2" fill="#A5F3FC" opacity="0.7" />
    <circle cx="32" cy="62" r="1.2" fill="#A5F3FC" opacity="0.7" />
    <circle cx="2" cy="32" r="1.2" fill="#A5F3FC" opacity="0.7" />
    <circle cx="10" cy="10" r="0.8" fill="#67E8F9" opacity="0.5" />
    <circle cx="54" cy="10" r="0.8" fill="#67E8F9" opacity="0.5" />
    <circle cx="10" cy="54" r="0.8" fill="#67E8F9" opacity="0.5" />
    <circle cx="54" cy="54" r="0.8" fill="#67E8F9" opacity="0.5" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Supernova — legendary, golden explosion of brilliance */
export const FrameSupernova: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-supernova-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="25%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="75%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
      <radialGradient id="frame-supernova-glow" cx="50%" cy="50%" r="50%">
        <stop offset="30%" stopColor="rgba(245,158,11,0.15)" />
        <stop offset="55%" stopColor="rgba(245,158,11,0.35)" />
        <stop offset="75%" stopColor="rgba(245,158,11,0.15)" />
        <stop offset="100%" stopColor="rgba(245,158,11,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-supernova-glow)" />
    <circle cx="32" cy="32" r="25" stroke="url(#frame-supernova-grad)" strokeWidth="2.5" fill="none" />
    <circle cx="32" cy="32" r="28" stroke="#F59E0B" strokeWidth="0.5" fill="none" opacity="0.5" />
    {/* explosion rays - long and short alternating */}
    {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const isLong = i % 2 === 0;
      const innerR = 26;
      const outerR = isLong ? 32 : 29;
      const x1 = 32 + innerR * Math.cos(rad);
      const y1 = 32 + innerR * Math.sin(rad);
      const x2 = 32 + outerR * Math.cos(rad);
      const y2 = 32 + outerR * Math.sin(rad);
      return (
        <line
          key={angle}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#F59E0B"
          strokeWidth={isLong ? '1.5' : '0.8'}
          opacity={isLong ? 0.7 : 0.4}
        />
      );
    })}
    {/* bright particles */}
    <circle cx="32" cy="1" r="1.5" fill="#FDE68A" opacity="0.8" />
    <circle cx="63" cy="32" r="1.5" fill="#FDE68A" opacity="0.8" />
    <circle cx="32" cy="63" r="1.5" fill="#FDE68A" opacity="0.8" />
    <circle cx="1" cy="32" r="1.5" fill="#FDE68A" opacity="0.8" />
    <circle cx="9" cy="9" r="1" fill="#FEF3C7" opacity="0.6" />
    <circle cx="55" cy="9" r="1" fill="#FEF3C7" opacity="0.6" />
    <circle cx="9" cy="55" r="1" fill="#FEF3C7" opacity="0.6" />
    <circle cx="55" cy="55" r="1" fill="#FEF3C7" opacity="0.6" />
    <AvatarPlaceholder />
  </SVGIcon>
);
