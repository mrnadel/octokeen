'use client';

import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import type { SubscriptionTier, SubscriptionStatus } from '@/lib/subscription';
import { FEATURES, LIMITS, type Feature } from '@/lib/pricing';

// ─── Subscription Store ─────────────────────────────────────────

interface SubscriptionState {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingInterval: string | null;
  currentPeriodEnd: string | null;
  trialEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isLoading: boolean;
  hasFetched: boolean;
  fetch: () => Promise<void>;
  reset: () => void;
}

const defaultState = {
  tier: 'free' as SubscriptionTier,
  status: 'active' as SubscriptionStatus,
  billingInterval: null,
  currentPeriodEnd: null,
  trialEnd: null,
  cancelAtPeriodEnd: false,
  isLoading: false,
  hasFetched: false,
};

export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
  ...defaultState,

  fetch: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });

    try {
      const res = await fetch('/api/stripe/subscription');
      if (res.ok) {
        const { subscription } = await res.json();
        set({
          tier: subscription.tier,
          status: subscription.status,
          billingInterval: subscription.billingInterval,
          currentPeriodEnd: subscription.currentPeriodEnd,
          trialEnd: subscription.trialEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          hasFetched: true,
        });
      }
    } catch {
      // Silently fail — user stays on free tier
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set(defaultState),
}));

// ─── Hook ───────────────────────────────────────────────────────

export function useSubscription() {
  const { status: authStatus } = useSession();
  const store = useSubscriptionStore();

  // Fetch on mount when authenticated
  useEffect(() => {
    if (authStatus === 'authenticated' && !store.hasFetched) {
      store.fetch();
    }
    if (authStatus === 'unauthenticated') {
      store.reset();
    }
  }, [authStatus, store.hasFetched]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh on window focus
  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    const onFocus = () => store.fetch();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [authStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const isTrialing = store.status === 'trialing';
  const isProUser = store.tier === 'pro' || store.tier === 'team' || isTrialing;

  const trialDaysLeft = (() => {
    if (!isTrialing || !store.trialEnd) return 0;
    const end = new Date(store.trialEnd);
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  })();

  const canAccess = useCallback(
    (feature: Feature): boolean => {
      const effectiveTier = isTrialing ? 'pro' : store.tier;
      const tierDef = { features: getTierFeatures(effectiveTier) };
      return tierDef.features.includes(feature);
    },
    [store.tier, isTrialing],
  );

  return {
    tier: store.tier,
    status: store.status,
    isLoading: store.isLoading,
    isProUser,
    isTrialing,
    trialDaysLeft,
    cancelAtPeriodEnd: store.cancelAtPeriodEnd,
    currentPeriodEnd: store.currentPeriodEnd,
    canAccess,
    refresh: store.fetch,
  };
}

// ─── Internal ───────────────────────────────────────────────────

function getTierFeatures(tier: SubscriptionTier): Feature[] {
  // Mirror the TIERS definition without importing the full object
  // to keep this lightweight on the client
  if (tier === 'team') {
    return Object.values(FEATURES);
  }
  if (tier === 'pro') {
    return [
      FEATURES.UNIT_ACCESS_ALL,
      FEATURES.UNLIMITED_PRACTICE,
      FEATURES.ALL_PRACTICE_MODES,
      FEATURES.FULL_ANALYTICS,
      FEATURES.STREAK_FREEZE,
      FEATURES.INTERVIEW_READINESS,
      FEATURES.DETAILED_EXPLANATIONS,
    ];
  }
  // free
  return [FEATURES.ALL_PRACTICE_MODES];
}
