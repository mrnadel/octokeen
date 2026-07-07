'use client';

import React from 'react';
import { AvatarPlaceholder, FrameIconProps } from './utils';
import { SVGIcon } from '../SVGIcon';

// ============================================================================
// SHOP FRAMES — Common
// ============================================================================

/** Gold Ring — common, metallic gold ring */
export const FrameGoldRing: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-gold-ring-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="28" stroke="url(#frame-gold-ring-grad)" strokeWidth="4" fill="none" />
    <circle cx="32" cy="32" r="24" stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0.3" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Emerald Halo — common, soft green glow */
export const FrameEmeraldHalo: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <radialGradient id="frame-emerald-halo-glow" cx="50%" cy="50%" r="50%">
        <stop offset="60%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(16,185,129,0.3)" />
        <stop offset="100%" stopColor="rgba(16,185,129,0)" />
      </radialGradient>
      <linearGradient id="frame-emerald-halo-ring" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#frame-emerald-halo-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-emerald-halo-ring)" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="28.5" stroke="#10B981" strokeWidth="0.5" fill="none" opacity="0.4" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Ruby Blaze — common, fiery red energy */
export const FrameRubyBlaze: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-ruby-blaze-grad" x1="32" y1="0" x2="32" y2="64">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="50%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-ruby-blaze-grad)" strokeWidth="3.5" fill="none" />
    {/* flame tips */}
    <path d="M32 3 L34 8 L32 6 L30 8 Z" fill="#EF4444" opacity="0.8" />
    <path d="M32 61 L34 56 L32 58 L30 56 Z" fill="#EF4444" opacity="0.8" />
    <path d="M3 32 L8 30 L6 32 L8 34 Z" fill="#EF4444" opacity="0.8" />
    <path d="M61 32 L56 30 L58 32 L56 34 Z" fill="#EF4444" opacity="0.8" />
    <path d="M10 10 L14 12 L12 14 Z" fill="#EF4444" opacity="0.5" />
    <path d="M54 10 L50 12 L52 14 Z" fill="#EF4444" opacity="0.5" />
    <path d="M10 54 L14 52 L12 50 Z" fill="#EF4444" opacity="0.5" />
    <path d="M54 54 L50 52 L52 50 Z" fill="#EF4444" opacity="0.5" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Sapphire Wave — common, deep blue */
export const FrameSapphireWave: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-sapphire-wave-grad" x1="0" y1="32" x2="64" y2="32">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-sapphire-wave-grad)" strokeWidth="3" fill="none" />
    {/* wave pattern */}
    <path d="M7 28 Q12 24 17 28 Q22 32 27 28" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.4" />
    <path d="M37 36 Q42 32 47 36 Q52 40 57 36" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.4" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Brushed Steel — common, simple gray metallic */
export const FrameBrushedSteel: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-steel-grad" x1="0" y1="0" x2="64" y2="0">
        <stop offset="0%" stopColor="#D4D4D8" />
        <stop offset="25%" stopColor="#A1A1AA" />
        <stop offset="50%" stopColor="#D4D4D8" />
        <stop offset="75%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#D4D4D8" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-steel-grad)" strokeWidth="4" fill="none" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Copper Pipe — common, warm copper tones */
export const FrameCopperPipe: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-copper-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="30%" stopColor="#D97706" />
        <stop offset="60%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-copper-grad)" strokeWidth="4" fill="none" />
    {/* patina spots */}
    <circle cx="14" cy="18" r="1.5" fill="#059669" opacity="0.3" />
    <circle cx="50" cy="46" r="1" fill="#059669" opacity="0.25" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Hex Bolt — common, hexagonal mechanical frame */
export const FrameHexBolt: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-bolt-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#A1A1AA" />
        <stop offset="50%" stopColor="#71717A" />
        <stop offset="100%" stopColor="#52525B" />
      </linearGradient>
    </defs>
    {/* hexagonal shape */}
    <polygon
      points="32,4 56,18 56,46 32,60 8,46 8,18"
      stroke="url(#frame-bolt-grad)" strokeWidth="3" fill="none"
    />
    {/* bolt head details at vertices */}
    <circle cx="32" cy="4" r="2" fill="#71717A" />
    <circle cx="56" cy="18" r="2" fill="#71717A" />
    <circle cx="56" cy="46" r="2" fill="#71717A" />
    <circle cx="32" cy="60" r="2" fill="#71717A" />
    <circle cx="8" cy="46" r="2" fill="#71717A" />
    <circle cx="8" cy="18" r="2" fill="#71717A" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Blueprint Border — common, white lines on blue */
export const FrameBlueprintBorder: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-blueprint-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#1E40AF" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    {/* blue background ring */}
    <circle cx="32" cy="32" r="28" stroke="url(#frame-blueprint-bg)" strokeWidth="6" fill="none" />
    {/* grid lines on the ring */}
    <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />
    <circle cx="32" cy="32" r="25" stroke="white" strokeWidth="0.3" fill="none" opacity="0.4" />
    <circle cx="32" cy="32" r="31" stroke="white" strokeWidth="0.3" fill="none" opacity="0.4" />
    {/* crosshair marks */}
    <line x1="32" y1="2" x2="32" y2="8" stroke="white" strokeWidth="0.5" opacity="0.5" />
    <line x1="32" y1="56" x2="32" y2="62" stroke="white" strokeWidth="0.5" opacity="0.5" />
    <line x1="2" y1="32" x2="8" y2="32" stroke="white" strokeWidth="0.5" opacity="0.5" />
    <line x1="56" y1="32" x2="62" y2="32" stroke="white" strokeWidth="0.5" opacity="0.5" />
    {/* dimension ticks */}
    <line x1="18" y1="3" x2="18" y2="6" stroke="white" strokeWidth="0.3" opacity="0.3" />
    <line x1="46" y1="3" x2="46" y2="6" stroke="white" strokeWidth="0.3" opacity="0.3" />
    <line x1="18" y1="58" x2="18" y2="61" stroke="white" strokeWidth="0.3" opacity="0.3" />
    <line x1="46" y1="58" x2="46" y2="61" stroke="white" strokeWidth="0.3" opacity="0.3" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Titanium Band — common, light metallic gray */
export const FrameTitaniumBand: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-titanium-grad" x1="0" y1="0" x2="0" y2="64">
        <stop offset="0%" stopColor="#E4E4E7" />
        <stop offset="30%" stopColor="#A1A1AA" />
        <stop offset="50%" stopColor="#D4D4D8" />
        <stop offset="70%" stopColor="#A1A1AA" />
        <stop offset="100%" stopColor="#E4E4E7" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-titanium-grad)" strokeWidth="4.5" fill="none" />
    <circle cx="32" cy="32" r="29.5" stroke="#A1A1AA" strokeWidth="0.5" fill="none" opacity="0.3" />
    <circle cx="32" cy="32" r="24.5" stroke="#A1A1AA" strokeWidth="0.5" fill="none" opacity="0.3" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Rivet Ring — common, ring with rivet dots */
export const FrameRivetRing: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-rivet-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#A8A29E" />
        <stop offset="50%" stopColor="#78716C" />
        <stop offset="100%" stopColor="#57534E" />
      </linearGradient>
      <radialGradient id="frame-rivet-dot">
        <stop offset="0%" stopColor="#A8A29E" />
        <stop offset="100%" stopColor="#57534E" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-rivet-grad)" strokeWidth="3.5" fill="none" />
    {/* rivets around the ring (12 positions) */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x = 32 + 27 * Math.cos(rad);
      const y = 32 + 27 * Math.sin(rad);
      return <circle key={angle} cx={x} cy={y} r="2" fill="url(#frame-rivet-dot)" stroke="#57534E" strokeWidth="0.5" />;
    })}
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Cast Iron — common, heavy dark frame */
export const FrameCastIron: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-castiron-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#78716C" />
        <stop offset="40%" stopColor="#57534E" />
        <stop offset="100%" stopColor="#44403C" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-castiron-grad)" strokeWidth="5" fill="none" />
    {/* texture lines */}
    <circle cx="32" cy="32" r="29" stroke="#44403C" strokeWidth="0.5" fill="none" opacity="0.5" strokeDasharray="2 3" />
    <circle cx="32" cy="32" r="25" stroke="#44403C" strokeWidth="0.5" fill="none" opacity="0.5" strokeDasharray="2 3" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Coil Spring — common, spring coil pattern */
export const FrameCoilSpring: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-spring-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* coil spring effect using dashed circles */}
    <circle cx="32" cy="32" r="27" stroke="url(#frame-spring-grad)" strokeWidth="3" fill="none" strokeDasharray="6 3" />
    <circle cx="32" cy="32" r="24" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="6 3" strokeDashoffset="4" />
    <circle cx="32" cy="32" r="30" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="6 3" strokeDashoffset="8" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Gear Teeth — common, gear-toothed ring */
export const FrameGearTeeth: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-gear-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#A8A29E" />
        <stop offset="50%" stopColor="#78716C" />
        <stop offset="100%" stopColor="#57534E" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="24" stroke="url(#frame-gear-grad)" strokeWidth="3" fill="none" />
    {/* gear teeth */}
    {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const ix = 32 + 24 * Math.cos(rad);
      const iy = 32 + 24 * Math.sin(rad);
      const ox = 32 + 30 * Math.cos(rad);
      const oy = 32 + 30 * Math.sin(rad);
      const perpRad = rad + Math.PI / 2;
      const tw = 2.5;
      return (
        <polygon
          key={angle}
          points={`${ix + tw * Math.cos(perpRad)},${iy + tw * Math.sin(perpRad)} ${ox + tw * Math.cos(perpRad)},${oy + tw * Math.sin(perpRad)} ${ox - tw * Math.cos(perpRad)},${oy - tw * Math.sin(perpRad)} ${ix - tw * Math.cos(perpRad)},${iy - tw * Math.sin(perpRad)}`}
          fill="#78716C"
        />
      );
    })}
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Gasket Seal — common, red rubber gasket ring */
export const FrameGasketSeal: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-gasket-grad" x1="0" y1="0" x2="0" y2="64">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="50%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-gasket-grad)" strokeWidth="4" fill="none" />
    <circle cx="32" cy="32" r="29.5" stroke="#DC2626" strokeWidth="0.8" fill="none" opacity="0.4" />
    <circle cx="32" cy="32" r="24.5" stroke="#DC2626" strokeWidth="0.8" fill="none" opacity="0.4" />
    {/* compression marks */}
    <circle cx="32" cy="32" r="27" stroke="#7F1D1D" strokeWidth="0.4" fill="none" strokeDasharray="1 5" opacity="0.5" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Bare Wire — common, thin gold wire */
export const FrameBareWire: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-wire-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* twisted wire pattern */}
    <circle cx="32" cy="32" r="27" stroke="url(#frame-wire-grad)" strokeWidth="1.5" fill="none" />
    <circle cx="32" cy="32" r="25.5" stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="4 4" />
    <circle cx="32" cy="32" r="28.5" stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 4" strokeDashoffset="4" />
    {/* exposed wire ends */}
    <line x1="5" y1="30" x2="3" y2="28" stroke="#F59E0B" strokeWidth="1" opacity="0.6" />
    <line x1="5" y1="34" x2="3" y2="36" stroke="#F59E0B" strokeWidth="1" opacity="0.6" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Concrete Ring — common, solid gray ring */
export const FrameConcreteRing: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-concrete-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#D4D4D4" />
        <stop offset="50%" stopColor="#A3A3A3" />
        <stop offset="100%" stopColor="#737373" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" stroke="url(#frame-concrete-grad)" strokeWidth="5" fill="none" />
    {/* aggregate/speckle texture */}
    <circle cx="15" cy="12" r="0.8" fill="#737373" opacity="0.4" />
    <circle cx="50" cy="16" r="0.6" fill="#737373" opacity="0.3" />
    <circle cx="52" cy="48" r="0.7" fill="#737373" opacity="0.4" />
    <circle cx="12" cy="50" r="0.9" fill="#737373" opacity="0.3" />
    <circle cx="32" cy="4" r="0.5" fill="#737373" opacity="0.3" />
    <circle cx="32" cy="60" r="0.6" fill="#737373" opacity="0.3" />
    <AvatarPlaceholder />
  </SVGIcon>
);

// ============================================================================
// SHOP FRAMES — Rare
// ============================================================================

/** Diamond Aura — rare, prismatic indigo glow */
export const FrameDiamondAura: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <radialGradient id="frame-diamond-aura-glow" cx="50%" cy="50%" r="50%">
        <stop offset="50%" stopColor="transparent" />
        <stop offset="75%" stopColor="rgba(129,140,248,0.25)" />
        <stop offset="100%" stopColor="rgba(129,140,248,0)" />
      </radialGradient>
      <linearGradient id="frame-diamond-aura-ring" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#C7D2FE" />
        <stop offset="25%" stopColor="#818CF8" />
        <stop offset="50%" stopColor="#A5B4FC" />
        <stop offset="75%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#C7D2FE" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-diamond-aura-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-diamond-aura-ring)" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="29" stroke="#818CF8" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* sparkle points */}
    <circle cx="32" cy="3" r="1" fill="#818CF8" opacity="0.7" />
    <circle cx="61" cy="32" r="1" fill="#818CF8" opacity="0.7" />
    <circle cx="32" cy="61" r="1" fill="#818CF8" opacity="0.7" />
    <circle cx="3" cy="32" r="1" fill="#818CF8" opacity="0.7" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Sunset Gradient — rare, warm orange-to-pink */
export const FrameSunsetGradient: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-sunset-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="30%" stopColor="#F97316" />
        <stop offset="60%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <radialGradient id="frame-sunset-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(249,115,22,0.2)" />
        <stop offset="100%" stopColor="rgba(249,115,22,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-sunset-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-sunset-grad)" strokeWidth="3.5" fill="none" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Torque Wrench — rare, wrench-shaped mechanical frame */
export const FrameTorqueWrench: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-wrench-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="26" stroke="url(#frame-wrench-grad)" strokeWidth="3" fill="none" />
    {/* wrench jaw details at top */}
    <rect x="27" y="2" width="10" height="6" rx="1" fill="#64748B" />
    <rect x="29" y="3" width="6" height="4" rx="0.5" fill="#94A3B8" />
    {/* wrench jaw details at bottom */}
    <rect x="27" y="56" width="10" height="6" rx="1" fill="#64748B" />
    <rect x="29" y="57" width="6" height="4" rx="0.5" fill="#94A3B8" />
    {/* torque indicator marks */}
    {[45, 90, 135, 225, 270, 315].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 32 + 23 * Math.cos(rad);
      const y1 = 32 + 23 * Math.sin(rad);
      const x2 = 32 + 26 * Math.cos(rad);
      const y2 = 32 + 26 * Math.sin(rad);
      return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748B" strokeWidth="1" opacity="0.5" />;
    })}
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Piston Ring — rare, engine piston style */
export const FramePistonRing: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-piston-grad" x1="0" y1="0" x2="0" y2="64">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="50%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>
    </defs>
    {/* piston ring segments */}
    <circle cx="32" cy="32" r="27" stroke="url(#frame-piston-grad)" strokeWidth="3.5" fill="none" />
    {/* ring gap */}
    <line x1="59" y1="31" x2="59" y2="33" stroke="#FAFAFA" strokeWidth="2" />
    {/* compression ring grooves */}
    <circle cx="32" cy="32" r="24.5" stroke="#DC2626" strokeWidth="0.5" fill="none" opacity="0.4" />
    <circle cx="32" cy="32" r="29.5" stroke="#DC2626" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* cylinder wall marks */}
    <line x1="4" y1="20" x2="4" y2="44" stroke="#DC2626" strokeWidth="0.5" opacity="0.2" />
    <line x1="60" y1="20" x2="60" y2="44" stroke="#DC2626" strokeWidth="0.5" opacity="0.2" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Circuit Board — rare, PCB traces */
export const FrameCircuitBoard: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-circuit-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="50%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="26" stroke="url(#frame-circuit-grad)" strokeWidth="2.5" fill="none" />
    {/* circuit traces radiating outward */}
    <line x1="32" y1="6" x2="32" y2="2" stroke="#22C55E" strokeWidth="1" />
    <line x1="32" y1="2" x2="40" y2="2" stroke="#22C55E" strokeWidth="1" />
    <line x1="32" y1="62" x2="32" y2="58" stroke="#22C55E" strokeWidth="1" />
    <line x1="32" y1="62" x2="24" y2="62" stroke="#22C55E" strokeWidth="1" />
    <line x1="6" y1="32" x2="2" y2="32" stroke="#22C55E" strokeWidth="1" />
    <line x1="2" y1="32" x2="2" y2="24" stroke="#22C55E" strokeWidth="1" />
    <line x1="58" y1="32" x2="62" y2="32" stroke="#22C55E" strokeWidth="1" />
    <line x1="62" y1="32" x2="62" y2="40" stroke="#22C55E" strokeWidth="1" />
    {/* node dots */}
    <circle cx="40" cy="2" r="1.5" fill="#22C55E" />
    <circle cx="24" cy="62" r="1.5" fill="#22C55E" />
    <circle cx="2" cy="24" r="1.5" fill="#22C55E" />
    <circle cx="62" cy="40" r="1.5" fill="#22C55E" />
    {/* diagonal traces */}
    <line x1="49" y1="9" x2="54" y2="4" stroke="#22C55E" strokeWidth="0.8" opacity="0.6" />
    <line x1="15" y1="55" x2="10" y2="60" stroke="#22C55E" strokeWidth="0.8" opacity="0.6" />
    <circle cx="54" cy="4" r="1" fill="#22C55E" opacity="0.6" />
    <circle cx="10" cy="60" r="1" fill="#22C55E" opacity="0.6" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Thermal Gradient — rare, hot-to-cold heat map */
export const FrameThermalGradient: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-thermal-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="25%" stopColor="#F97316" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="75%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <radialGradient id="frame-thermal-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(239,68,68,0.15)" />
        <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-thermal-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-thermal-grad)" strokeWidth="3.5" fill="none" />
    {/* temperature scale marks */}
    <line x1="8" y1="8" x2="10" y2="10" stroke="#EF4444" strokeWidth="1" opacity="0.5" />
    <line x1="56" y1="56" x2="54" y2="54" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
    <AvatarPlaceholder />
  </SVGIcon>
);

/** Weld Bead — rare, welded golden seam */
export const FrameWeldBead: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <SVGIcon size={size} className={className}>
    <defs>
      <linearGradient id="frame-weld-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="30%" stopColor="#F59E0B" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      <radialGradient id="frame-weld-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="80%" stopColor="rgba(245,158,11,0.2)" />
        <stop offset="100%" stopColor="rgba(245,158,11,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-weld-glow)" />
    {/* weld bead (zigzag pattern along ring) */}
    <circle cx="32" cy="32" r="27" stroke="url(#frame-weld-grad)" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="27" stroke="#FDE68A" strokeWidth="1" fill="none" opacity="0.6" strokeDasharray="2 2" />
    {/* spark spots */}
    <circle cx="12" cy="15" r="0.8" fill="#FDE68A" opacity="0.7" />
    <circle cx="52" cy="49" r="0.8" fill="#FDE68A" opacity="0.7" />
    <circle cx="48" cy="12" r="0.6" fill="#FDE68A" opacity="0.5" />
    <circle cx="16" cy="52" r="0.6" fill="#FDE68A" opacity="0.5" />
    <AvatarPlaceholder />
  </SVGIcon>
);
