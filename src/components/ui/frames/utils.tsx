import { type ReactNode } from 'react';

export interface FrameDef {
  defs: (s: number) => ReactNode;
  render: (s: number) => ReactNode;
  glowColor?: string;
  glowBlur?: number;
  glowOpacity?: number;
  animated?: boolean;
  avatarClipPath?: string;
}

/** Generate a CSS clip-path polygon (percentage-based) for a regular polygon. */
export function polyClip(sides: number, offsetDeg: number, r = 48): string {
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = ((360 / sides) * i + offsetDeg) * (Math.PI / 180);
    return `${(50 + r * Math.cos(a)).toFixed(1)}% ${(50 + r * Math.sin(a)).toFixed(1)}%`;
  });
  return `polygon(${pts.join(', ')})`;
}

/** Generate a CSS clip-path polygon for a star shape. */
export function starClip(spikes: number, outerR: number, innerR: number, offsetDeg = -90): string {
  const pts = Array.from({ length: spikes * 2 }, (_, i) => {
    const a = ((i * 360) / (spikes * 2) + offsetDeg) * (Math.PI / 180);
    const r = i % 2 === 0 ? outerR : innerR;
    return `${(50 + r * Math.cos(a)).toFixed(1)}% ${(50 + r * Math.sin(a)).toFixed(1)}%`;
  });
  return `polygon(${pts.join(', ')})`;
}
