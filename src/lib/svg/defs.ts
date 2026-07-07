// SVG diagram definitions: gradients and filters

import { radialGradient } from './helpers';

/** Radial glow gradient (for Sun, stars, generic glows) */
export function glowGradient(
  id: string,
  color: string,
  innerOpacity = 1,
  outerOpacity = 0
): string {
  return radialGradient(id, [
    { offset: '0%', color, opacity: innerOpacity },
    { offset: '100%', color, opacity: outerOpacity },
  ]);
}

/** Sun-specific multi-stop gradient (core white to golden to transparent) */
export function sunGradient(id: string): string {
  return radialGradient(id, [
    { offset: '0%', color: '#FFF5D6', opacity: 1 },
    { offset: '30%', color: '#FFD166', opacity: 1 },
    { offset: '65%', color: '#FF9F1C', opacity: 0.8 },
    { offset: '100%', color: '#FF6B00', opacity: 0 },
  ]);
}

/** Earth atmosphere glow gradient */
export function earthGlow(id: string): string {
  return radialGradient(id, [
    { offset: '0%', color: '#4DA6FF', opacity: 0 },
    { offset: '70%', color: '#4DA6FF', opacity: 0 },
    { offset: '85%', color: '#87CEEB', opacity: 0.3 },
    { offset: '100%', color: '#87CEEB', opacity: 0 },
  ]);
}

/** Linear gradient for atmosphere bands */
export function atmosphereGradient(
  id: string,
  color: string,
  direction: 'up' | 'down' = 'up'
): string {
  const y1 = direction === 'up' ? '100%' : '0%';
  const y2 = direction === 'up' ? '0%' : '100%';
  return (
    `<linearGradient id="${id}" x1="0%" y1="${y1}" x2="0%" y2="${y2}">` +
    `<stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>` +
    `<stop offset="100%" stop-color="${color}" stop-opacity="0"/>` +
    `</linearGradient>`
  );
}

/** Galaxy spiral gradient */
export function galaxyGradient(id: string): string {
  return radialGradient(id, [
    { offset: '0%', color: '#C4B5FD', opacity: 1 },
    { offset: '40%', color: '#818CF8', opacity: 0.6 },
    { offset: '70%', color: '#6366F1', opacity: 0.3 },
    { offset: '100%', color: '#4F46E5', opacity: 0 },
  ]);
}

/** Blur filter for soft glow effects */
export function blurFilter(id: string, stdDev = 4): string {
  return (
    `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">` +
    `<feGaussianBlur stdDeviation="${stdDev}"/>` +
    `</filter>`
  );
}
