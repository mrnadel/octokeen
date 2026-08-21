'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsTwa } from '@/lib/is-twa';
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
 *
 * Inside the Android TWA no ad ever renders, so the interstitial is bypassed here —
 * routing through it would leave the screen's primary CTA dead, with nothing on
 * screen to call `closeAd`.
 */
export function useCompletionAdGate(onDismiss: () => void, enabled = true): CompletionAdGate {
  const { shouldShowAd, recordCompletion, recordAdShown } = useAdManager();
  const isTwa = useIsTwa();
  const recorded = useRef(false);
  const [showingAd, setShowingAd] = useState(false);

  useEffect(() => {
    if (!enabled || recorded.current) return;
    recorded.current = true;
    recordCompletion();
  }, [enabled, recordCompletion]);

  const requestDismiss = useCallback(() => {
    if (shouldShowAd && !isTwa) {
      setShowingAd(true);
      recordAdShown();
    } else {
      onDismiss();
    }
  }, [shouldShowAd, isTwa, recordAdShown, onDismiss]);

  const closeAd = useCallback(() => {
    setShowingAd(false);
    onDismiss();
  }, [onDismiss]);

  return { showingAd, requestDismiss, closeAd };
}
