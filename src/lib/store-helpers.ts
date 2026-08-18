// ============================================================
// Store Helpers — Octokeen
// Shared logic extracted from Zustand stores to reduce duplication.
// ============================================================

import { DOUBLE_XP_SHOP_DURATION_MS } from '@/data/engagement-types';
import type { EngagementState } from '@/data/engagement-types';
import { DOUBLE_XP_BUFFER_MS, DOUBLE_XP_RECENT_PURCHASE_WINDOW_MS } from '@/lib/game-config';
import { getEventXpMultiplier } from '@/lib/xp-events';
import type { SubscriptionTier } from '@/lib/subscription';
// Type-only import: erased at compile time, so it does not create a runtime
// cycle with useSubscription, which imports resolveActiveTier from here.
import type { SubscriptionState } from '@/hooks/useSubscription';

// ─── Double XP Validation ──────────────────────────────────────

/** The slice of engagement state the double-XP check reads. */
type DoubleXpState = Pick<EngagementState, 'doubleXpExpiry' | 'gems'>;

/** The slice of subscription state tier resolution reads. */
type TierState = Pick<SubscriptionState, 'tier' | 'status' | 'debugTierOverride'>;

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
export function checkDoubleXp(engagementState: DoubleXpState): boolean {
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

// ─── XP Boost Stacking ─────────────────────────────────────────

export interface XpBoost {
  /** Whether a valid shop-purchased double XP boost is active. */
  shopDoubleXp: boolean;
  /** Multiplier contributed by time-limited XP events (weekend 2x, power hour, ...). */
  eventMultiplier: number;
  /** Combined multiplier — shop and event boosts stack additively. */
  totalMultiplier: number;
}

/**
 * Resolve the total XP multiplier from the shop boost and any active XP event.
 *
 * Shop boost and event boost stack additively (2x + 2x = 3x, not 4x).
 * Used by both `useStore.answerQuestion` and `useCourseStore.completeLesson`.
 */
export function getXpBoost(engagementState: DoubleXpState, isPro: boolean): XpBoost {
  const shopDoubleXp = checkDoubleXp(engagementState);
  const eventMultiplier = getEventXpMultiplier(isPro);
  const shopMultiplier = shopDoubleXp ? 2 : 1;
  const totalMultiplier = shopMultiplier === 1 && eventMultiplier === 1
    ? 1
    : 1 + (shopMultiplier - 1) + (eventMultiplier - 1);

  return { shopDoubleXp, eventMultiplier, totalMultiplier };
}

// ─── Effective Tier ────────────────────────────────────────────

/**
 * The tier the app should act on before trial/grace adjustments:
 * the stored tier, or the dev-only debug override when one is set.
 */
export function resolveActiveTier(
  tier: SubscriptionTier,
  debugTierOverride: SubscriptionTier | null,
): SubscriptionTier {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev && debugTierOverride ? debugTierOverride : tier;
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
export function getEffectiveTier(subscriptionState: TierState): SubscriptionTier {
  const activeTier = resolveActiveTier(subscriptionState.tier, subscriptionState.debugTierOverride);

  const isTrialing = subscriptionState.status === 'trialing';
  const isPastDue = subscriptionState.status === 'past_due';

  return (isTrialing || isPastDue) ? 'pro' : activeTier;
}
