'use client';

import { useRef, useEffect } from 'react';
import { triggerFX, clearFX, type FXName } from '@/lib/fx-registry';

/**
 * Re-exported so consumers can pull the effect-name union from the component
 * they are rendering. The union itself is owned by fx-registry — do not
 * re-derive it here, or the two definitions can drift.
 */
export type { FXName };

export interface ScreenFXProps {
  /** Effect name — use 'confetti', 'supernova', 'xp-explosion', etc. */
  effect?: FXName;
  /** @deprecated Use `effect` instead */
  type?: FXName;
  /** Set false to clear particles (default: true) */
  active?: boolean;
  /** Extra CSS class */
  className?: string;
}

/**
 * Full-screen particle effect overlay.
 *
 * Usage:
 *   <ScreenFX effect="confetti" />
 *   <ScreenFX effect="supernova" />
 *   <ScreenFX effect="xp-explosion" active={showCelebration} />
 *
 * Available effects:
 *   celebration: confetti, stars, hearts, emoji-party, fireworks, golden-rain
 *   ambient:     bubbles, sparkle-dust, bokeh, swirl-orbs
 *   center-burst: supernova, shockwave, power-up, xp-explosion, level-up-rays, portal
 *   weather:     snow, rain
 *   dramatic:    lightning, electric, speed-streaks, spiral-galaxy
 */
export function ScreenFX({ effect, type, active = true, className }: ScreenFXProps) {
  const ref = useRef<HTMLDivElement>(null);
  const name = effect ?? type ?? 'confetti';

  useEffect(() => {
    if (!ref.current) return;
    if (active) {
      triggerFX(ref.current, name);
    } else {
      clearFX(ref.current);
    }
    return () => { if (ref.current) clearFX(ref.current); };
  }, [name, active]);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 pointer-events-none z-0 fx-particles ${className ?? ''}`}
    />
  );
}
