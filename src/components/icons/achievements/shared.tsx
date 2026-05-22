'use client';

import React from 'react';

// ─── Category Color Palettes ───────────────────────────────────────────────
export const COLORS = {
  knowledge: { base: '#3B82F6', dark: '#1D4ED8', light: '#DBEAFE' },
  consistency: { base: '#10B981', dark: '#047857', light: '#D1FAE5' },
  challenge: { base: '#F59E0B', dark: '#B45309', light: '#FEF3C7' },
  exploration: { base: '#06B6D4', dark: '#0E7490', light: '#CFFAFE' },
  mastery: { base: '#FFB800', dark: '#996E00', light: '#FFF5D4' },
  hidden: { base: '#8B5CF6', dark: '#6D28D9', light: '#EDE9FE' },
};

export type IconProps = { size?: number; className?: string };

// ─── Shared Medal Base ─────────────────────────────────────────────────────
export function MedalBase({
  id,
  colors,
  children,
  size = 64,
  className,
}: {
  id: string;
  colors: { base: string; dark: string; light: string };
  children: React.ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        {/* Outer ring gradient */}
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.base} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
        {/* Inner fill gradient */}
        <linearGradient id={`${id}-inner`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={colors.light} />
        </linearGradient>
        {/* Metallic shine */}
        <linearGradient id={`${id}-shine`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
        </linearGradient>
        {/* Ribbon gradient */}
        <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.base} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
      </defs>

      {/* Ribbon tails behind medal */}
      <path
        d="M22 48 L18 60 L24 56 L28 62 L28 48"
        fill={`url(#${id}-ribbon)`}
        stroke={colors.dark}
        strokeWidth="1"
      />
      <path
        d="M42 48 L46 60 L40 56 L36 62 L36 48"
        fill={`url(#${id}-ribbon)`}
        stroke={colors.dark}
        strokeWidth="1"
      />

      {/* Outer ring */}
      <circle
        cx="32"
        cy="30"
        r="26"
        fill={`url(#${id}-ring)`}
        stroke={colors.dark}
        strokeWidth="2"
      />

      {/* Inner ring border */}
      <circle
        cx="32"
        cy="30"
        r="22"
        fill="none"
        stroke={colors.light}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Inner fill */}
      <circle cx="32" cy="30" r="20" fill={`url(#${id}-inner)`} />

      {/* Metallic shine overlay */}
      <circle cx="32" cy="30" r="20" fill={`url(#${id}-shine)`} />

      {/* Notch details on rim */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + 23 * Math.cos(rad);
        const y1 = 30 + 23 * Math.sin(rad);
        const x2 = 32 + 25.5 * Math.cos(rad);
        const y2 = 30 + 25.5 * Math.sin(rad);
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={colors.light}
            strokeWidth="1.5"
            opacity="0.5"
          />
        );
      })}

      {/* Emblem content */}
      {children}
    </svg>
  );
}
