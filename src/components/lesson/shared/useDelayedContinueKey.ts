'use client';

import { useEffect } from 'react';

/** Grace period so the keypress that finished the lesson doesn't immediately dismiss the result. */
const ARM_DELAY_MS = 500;

/**
 * Binds Enter/Space to the primary action of a completion screen, armed only
 * after a short delay.
 */
export function useDelayedContinueKey(onContinue: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onContinue();
      }
    };

    const timer = setTimeout(() => window.addEventListener('keydown', handleKeyDown), ARM_DELAY_MS);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onContinue]);
}
