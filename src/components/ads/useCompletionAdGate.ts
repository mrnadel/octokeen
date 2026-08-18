'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAdManager } from './useAdManager';

interface CompletionAdGate {
  /** True while the interstitial should be mounted. */
  showingAd: boolean;
  /** Call from the screen's primary CTA — shows an ad if one is due, otherwise dismisses. */
  requestDismiss: () => void;
  /** Pass to the interstitial's onClose: hides the ad, then runs the dismiss handler. */
  closeAd: () => void;
}

/**
 * Shared interstitial gate for lesson-result and practice-summary screens.
 * Records the completion once on mount, then routes the dismiss action
 * through an interstitial when the ad manager says one is due.
 */
export function useCompletionAdGate(onDismiss: () => void, enabled = true): CompletionAdGate {
  const { shouldShowAd, recordCompletion, recordAdShown } = useAdManager();
  const recorded = useRef(false);
  const [showingAd, setShowingAd] = useState(false);

  useEffect(() => {
    if (!enabled || recorded.current) return;
    recorded.current = true;
    recordCompletion();
  }, [enabled, recordCompletion]);

  const requestDismiss = useCallback(() => {
    if (shouldShowAd) {
      setShowingAd(true);
      recordAdShown();
    } else {
      onDismiss();
    }
  }, [shouldShowAd, recordAdShown, onDismiss]);

  const closeAd = useCallback(() => {
    setShowingAd(false);
    onDismiss();
  }, [onDismiss]);

  return { showingAd, requestDismiss, closeAd };
}
