'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSubscriptionStore } from '@/hooks/useSubscription';

interface HeartsState {
  current: number;
  max: number;
  lastRechargeAt: number;
  rechargeIntervalMs: number; // 4 hours = 14400000

  // Actions
  rechargeHearts: () => void;
  loseHeart: () => void;
  hasHearts: () => boolean;
  getTimeUntilNextHeart: () => number; // ms until next recharge
  isUnlimited: () => boolean;
}

function getEffectiveTier() {
  const subStore = useSubscriptionStore.getState();
  const isDev = process.env.NODE_ENV === 'development';
  const activeTier = isDev && subStore.debugTierOverride ? subStore.debugTierOverride : subStore.tier;
  const isTrialing = subStore.status === 'trialing';
  const isPastDue = subStore.status === 'past_due';
  return (isTrialing || isPastDue) ? 'pro' : activeTier;
}

export const useHeartsStore = create<HeartsState>()(
  persist(
    (set, get) => ({
      current: 5,
      max: 5,
      lastRechargeAt: Date.now(),
      rechargeIntervalMs: 14400000, // 4 hours

      rechargeHearts: () => {
        if (getEffectiveTier() === 'pro') return; // Pro doesn't need recharging

        const { current, max, lastRechargeAt, rechargeIntervalMs } = get();
        if (current >= max) return;

        const now = Date.now();
        const elapsed = now - lastRechargeAt;
        const heartsToRecharge = Math.floor(elapsed / rechargeIntervalMs);

        if (heartsToRecharge > 0) {
          const newCurrent = Math.min(current + heartsToRecharge, max);
          set({
            current: newCurrent,
            lastRechargeAt: newCurrent >= max ? now : lastRechargeAt + heartsToRecharge * rechargeIntervalMs,
          });
        }
      },

      loseHeart: () => {
        if (getEffectiveTier() === 'pro') return; // Pro never loses hearts

        const { current, max, lastRechargeAt } = get();
        if (current <= 0) return;

        set({
          current: current - 1,
          // If this brings us below max, set recharge timer
          lastRechargeAt: current === max ? Date.now() : lastRechargeAt,
        });
      },

      hasHearts: () => {
        if (getEffectiveTier() === 'pro') return true;
        return get().current > 0;
      },

      getTimeUntilNextHeart: () => {
        const { current, max, lastRechargeAt, rechargeIntervalMs } = get();
        if (current >= max) return 0;
        const elapsed = Date.now() - lastRechargeAt;
        const remaining = rechargeIntervalMs - (elapsed % rechargeIntervalMs);
        return remaining;
      },

      isUnlimited: () => getEffectiveTier() === 'pro',
    }),
    {
      name: 'octokeen-hearts',
      partialize: (state) => ({
        current: state.current,
        max: state.max,
        lastRechargeAt: state.lastRechargeAt,
        rechargeIntervalMs: state.rechargeIntervalMs,
      }),
    }
  )
);
