// ============================================================
// Store Helpers — Octokeen
// Shared logic extracted from Zustand stores to reduce duplication.
// ============================================================

import { DOUBLE_XP_SHOP_DURATION_MS } from '@/data/engagement-types';
import { DOUBLE_XP_BUFFER_MS, DOUBLE_XP_RECENT_PURCHASE_WINDOW_MS } from '@/lib/game-config';
import type { SubscriptionTier, SubscriptionStatus } from '@/lib/subscription';

// ─── Double XP Validation ──────────────────────────────────────

interface GemTransaction {
  amount: number;
  source: string;
  timestamp: string;
}

interface EngagementState {
  doubleXpExpiry: string | null;
  gems: {
    transactions: GemTransaction[];
  };
}

/**
 * Validate whether the shop-purchased double XP boost is legitimately active.
 *
 * Checks that:
 * 1. The expiry is in the future
 * 2. The expiry does not exceed the max allowed duration + buffer
 * 3. A recent shop_purchase transaction exists to back it
 *
 * Used by both `useStore.answerQuestion` and `useCourseStore.completeLesson`.
 */
export function checkDoubleXp(engagementState: EngagementState): boolean {
  const { doubleXpExpiry } = engagementState;
  if (!doubleXpExpiry) return false;

  const expiry = new Date(doubleXpExpiry).getTime();
  const now = Date.now();

  if (isNaN(expiry) || expiry <= now || expiry > now + DOUBLE_XP_SHOP_DURATION_MS + DOUBLE_XP_BUFFER_MS) {
    return false;
  }

  const recentCutoff = now - (DOUBLE_XP_SHOP_DURATION_MS + DOUBLE_XP_RECENT_PURCHASE_WINDOW_MS);
  return engagementState.gems.transactions.some(
    (t) => t.source === 'shop_purchase' && t.amount < 0 && new Date(t.timestamp).getTime() > recentCutoff,
  );
}

// ─── Effective Tier ────────────────────────────────────────────

interface SubscriptionState {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  debugTierOverride: SubscriptionTier | null;
}

/**
 * Determine the effective subscription tier from the subscription store state.
 *
 * Rules:
 * - In development, `debugTierOverride` takes precedence if set
 * - `trialing` and `past_due` statuses are treated as 'pro' (grace period)
 * - Otherwise returns the stored tier
 *
 * Consolidates the pattern used in `useHeartsStore`, `useCourseStore.startLesson`,
 * and `access-control.ts` (client-side variant).
 */
export function getEffectiveTier(subscriptionState: SubscriptionState): SubscriptionTier {
  const isDev = process.env.NODE_ENV === 'development';
  const activeTier = isDev && subscriptionState.debugTierOverride
    ? subscriptionState.debugTierOverride
    : subscriptionState.tier;

  const isTrialing = subscriptionState.status === 'trialing';
  const isPastDue = subscriptionState.status === 'past_due';

  return (isTrialing || isPastDue) ? 'pro' : activeTier;
}
