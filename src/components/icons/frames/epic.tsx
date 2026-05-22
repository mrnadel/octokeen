'use client';

import React from 'react';
import { AvatarPlaceholder, FrameIconProps } from './utils';

// ============================================================================
// SHOP FRAMES — Epic
// ============================================================================

/** Aurora Borealis — epic, shifting teal-to-violet glow */
export const FrameAuroraBorealis: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-aurora-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="30%" stopColor="#22D3EE" />
        <stop offset="50%" stopColor="#818CF8" />
        <stop offset="70%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <radialGradient id="frame-aurora-glow" cx="50%" cy="50%" r="50%">
        <stop offset="45%" stopColor="transparent" />
        <stop offset="70%" stopColor="rgba(139,92,246,0.2)" />
        <stop offset="85%" stopColor="rgba(34,211,238,0.15)" />
        <stop offset="100%" stopColor="rgba(139,92,246,0)" />
      </radialGradient>
      <linearGradient id="frame-aurora-outer" x1="0" y1="0" x2="64" y2="0">
        <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-aurora-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-aurora-grad)" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="30" stroke="url(#frame-aurora-outer)" strokeWidth="1.5" fill="none" />
    {/* aurora shimmer particles */}
    <circle cx="10" cy="20" r="1" fill="#2DD4BF" opacity="0.5" />
    <circle cx="54" cy="44" r="1" fill="#8B5CF6" opacity="0.5" />
    <circle cx="20" cy="54" r="0.8" fill="#22D3EE" opacity="0.4" />
    <circle cx="44" cy="10" r="0.8" fill="#A78BFA" opacity="0.4" />
    <circle cx="8" cy="38" r="0.6" fill="#2DD4BF" opacity="0.3" />
    <circle cx="56" cy="26" r="0.6" fill="#8B5CF6" opacity="0.3" />
    <AvatarPlaceholder />
  </svg>
);

/** Neon Pulse — epic, electric cyan glow */
export const FrameNeonPulse: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-neon-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#67E8F9" />
        <stop offset="50%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      <radialGradient id="frame-neon-glow" cx="50%" cy="50%" r="50%">
        <stop offset="40%" stopColor="transparent" />
        <stop offset="65%" stopColor="rgba(34,211,238,0.3)" />
        <stop offset="85%" stopColor="rgba(34,211,238,0.15)" />
        <stop offset="100%" stopColor="rgba(34,211,238,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-neon-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-neon-grad)" strokeWidth="2.5" fill="none" />
    <circle cx="32" cy="32" r="26" stroke="#67E8F9" strokeWidth="1" fill="none" opacity="0.6" />
    <circle cx="32" cy="32" r="29" stroke="#22D3EE" strokeWidth="0.5" fill="none" opacity="0.4" />
    {/* electric pulse dots */}
    <circle cx="32" cy="2" r="1.5" fill="#67E8F9" opacity="0.8" />
    <circle cx="62" cy="32" r="1.5" fill="#67E8F9" opacity="0.8" />
    <circle cx="32" cy="62" r="1.5" fill="#67E8F9" opacity="0.8" />
    <circle cx="2" cy="32" r="1.5" fill="#67E8F9" opacity="0.8" />
    {/* pulse lines */}
    <line x1="32" y1="2" x2="32" y2="5.5" stroke="#22D3EE" strokeWidth="0.8" opacity="0.5" />
    <line x1="62" y1="32" x2="58.5" y2="32" stroke="#22D3EE" strokeWidth="0.8" opacity="0.5" />
    <line x1="32" y1="62" x2="32" y2="58.5" stroke="#22D3EE" strokeWidth="0.8" opacity="0.5" />
    <line x1="2" y1="32" x2="5.5" y2="32" stroke="#22D3EE" strokeWidth="0.8" opacity="0.5" />
    <AvatarPlaceholder />
  </svg>
);

/** Turbine Blade — epic, spinning turbine blades */
export const FrameTurbineBlade: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-turbine-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="50%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="25" stroke="url(#frame-turbine-grad)" strokeWidth="2.5" fill="none" />
    {/* turbine blades */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const curveRad = ((angle + 20) * Math.PI) / 180;
      const ix = 32 + 25 * Math.cos(rad);
      const iy = 32 + 25 * Math.sin(rad);
      const ox = 32 + 31 * Math.cos(curveRad);
      const oy = 32 + 31 * Math.sin(curveRad);
      return (
        <path
          key={angle}
          d={`M${ix},${iy} Q${32 + 28 * Math.cos(rad)},${32 + 28 * Math.sin(rad)} ${ox},${oy}`}
          stroke="#0EA5E9"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
      );
    })}
    {/* center hub */}
    <circle cx="32" cy="32" r="2" fill="#0EA5E9" opacity="0.5" />
    <AvatarPlaceholder />
  </svg>
);

/** Plasma Arc — epic, purple ionized glow */
export const FramePlasmaArc: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-plasma-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="30%" stopColor="#A855F7" />
        <stop offset="70%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#E9D5FF" />
      </linearGradient>
      <radialGradient id="frame-plasma-glow" cx="50%" cy="50%" r="50%">
        <stop offset="40%" stopColor="transparent" />
        <stop offset="65%" stopColor="rgba(168,85,247,0.25)" />
        <stop offset="100%" stopColor="rgba(168,85,247,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-plasma-glow)" />
    <circle cx="32" cy="32" r="26" stroke="url(#frame-plasma-grad)" strokeWidth="2.5" fill="none" />
    {/* plasma arcs */}
    <path d="M12 12 Q16 18 14 24" stroke="#A855F7" strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M52 12 Q48 18 50 24" stroke="#A855F7" strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M12 52 Q16 46 14 40" stroke="#A855F7" strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M52 52 Q48 46 50 40" stroke="#A855F7" strokeWidth="1" fill="none" opacity="0.6" />
    {/* ionized particles */}
    <circle cx="8" cy="16" r="1" fill="#E9D5FF" opacity="0.6" />
    <circle cx="56" cy="16" r="1" fill="#E9D5FF" opacity="0.6" />
    <circle cx="8" cy="48" r="0.8" fill="#E9D5FF" opacity="0.5" />
    <circle cx="56" cy="48" r="0.8" fill="#E9D5FF" opacity="0.5" />
    <circle cx="32" cy="2" r="0.8" fill="#E9D5FF" opacity="0.5" />
    <circle cx="32" cy="62" r="0.8" fill="#E9D5FF" opacity="0.5" />
    <AvatarPlaceholder />
  </svg>
);

/** Star Drive — epic, golden star burst */
export const FrameStarDrive: React.FC<FrameIconProps> = ({ size = 64, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="frame-stardrive-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="40%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <radialGradient id="frame-stardrive-glow" cx="50%" cy="50%" r="50%">
        <stop offset="45%" stopColor="transparent" />
        <stop offset="70%" stopColor="rgba(251,191,36,0.2)" />
        <stop offset="100%" stopColor="rgba(251,191,36,0)" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#frame-stardrive-glow)" />
    <circle cx="32" cy="32" r="25" stroke="url(#frame-stardrive-grad)" strokeWidth="2.5" fill="none" />
    {/* star burst rays */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 32 + 26 * Math.cos(rad);
      const y1 = 32 + 26 * Math.sin(rad);
      const x2 = 32 + 31 * Math.cos(rad);
      const y2 = 32 + 31 * Math.sin(rad);
      return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FBBF24" strokeWidth="1.5" opacity="0.6" />;
    })}
    {/* star points */}
    {[0, 72, 144, 216, 288].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x = 32 + 31 * Math.cos(rad);
      const y = 32 + 31 * Math.sin(rad);
      return <circle key={angle} cx={x} cy={y} r="1.2" fill="#FBBF24" opacity="0.8" />;
    })}
    <AvatarPlaceholder />
  </svg>
);
