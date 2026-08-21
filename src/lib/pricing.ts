// ============================================================
// Pricing & Feature Gating — Octokeen SaaS
// ============================================================

import { toPercent } from './utils';
import type {
  SubscriptionTier,
  SubscriptionStatus,
} from './subscription';

// --------------- Paddle Price IDs ---------------

export const PADDLE_PRICES = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID || process.env.PADDLE_PRO_MONTHLY_PRICE_ID || '',
  PRO_YEARLY: process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY_PRICE_ID || process.env.PADDLE_PRO_YEARLY_PRICE_ID || '',
} as const;

// --------------- Features ---------------

export const FEATURES = {
  UNLIMITED_HEARTS: 'unlimited_hearts',
  STREAK_FREEZE: 'streak_freeze',
  FULL_ANALYTICS: 'full_analytics',
  DOUBLE_XP_WEEKENDS: 'double_xp_weekends',
  DETAILED_EXPLANATIONS: 'detailed_explanations',
  PREMIUM_LEAGUE_REWARDS: 'premium_league_rewards',
  NO_ADS: 'no_ads',
  PRACTICE_MISTAKES: 'practice_mistakes',
  PRACTICE_REVIEW: 'practice_review',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];

// --------------- Pro-Only Practice Modes ---------------
export const PRO_SESSION_TYPES: ReadonlySet<string> = new Set([
  'adaptive',
  'interview-sim',
  'weak-areas',
]);

// --------------- Free Content Allowance ---------------

/**
 * Units a free account can open in each course. Every course leads with the same
 * number of open units so the free tier is a real sample rather than a locked door.
 */
export const FREE_UNIT_COUNT = 3;

const FREE_UNLOCKED_UNITS: number[] | 'all' = Array.from(
  { length: FREE_UNIT_COUNT },
  (_, index) => index,
);

// --------------- Daily / Usage Limits ---------------

export const LIMITS = {
  free: {
    dailyQuestions: -1,               // unlimited within the open units
    streakFreezesPerWeek: 0,
    unlockedUnits: FREE_UNLOCKED_UNITS,
  },
  pro: {
    dailyQuestions: -1,               // unlimited
    streakFreezesPerWeek: 1,
    unlockedUnits: 'all' as number[] | 'all', // all units
  },
} as const;

/** Check if a unit index is unlocked for a given set of unlocked units. */
export function isUnitUnlocked(unlockedUnits: readonly number[] | 'all', unitIndex: number): boolean {
  return unlockedUnits === 'all' || unlockedUnits.includes(unitIndex);
}

// --------------- Tier Definitions ---------------

interface TierDefinition {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  priceMonthly: number;        // USD cents (0 for free)
  priceYearly: number;         // USD cents (0 for free)
  minSeats: number;            // 1 for individual tiers
  features: Feature[];
  highlighted: boolean;        // used to emphasize the "best value" tier in UI
}

export const TIERS: Record<SubscriptionTier, TierDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    tagline: `First ${FREE_UNIT_COUNT} units of every course, 5 hearts per session`,
    priceMonthly: 0,
    priceYearly: 0,
    minSeats: 1,
    features: [],   // Pro gates the rest of the content plus hearts, analytics and perks
    highlighted: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'Every course in full, unlimited hearts',
    priceMonthly: 1299,          // $12.99/month
    priceYearly: 7999,           // $79.99/year (~$6.67/month)
    minSeats: 1,
    features: [
      FEATURES.UNLIMITED_HEARTS,
      FEATURES.STREAK_FREEZE,
      FEATURES.FULL_ANALYTICS,
      FEATURES.DOUBLE_XP_WEEKENDS,
      FEATURES.DETAILED_EXPLANATIONS,
      FEATURES.PREMIUM_LEAGUE_REWARDS,
      FEATURES.NO_ADS,
      FEATURES.PRACTICE_MISTAKES,
      FEATURES.PRACTICE_REVIEW,
    ],
    highlighted: true,
  },
} as const;

/**
 * Format a price in cents to a display string.
 */
export function formatPrice(cents: number): string {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/**
 * Calculate yearly savings as a percentage compared to monthly billing.
 */
export function getYearlySavingsPercent(tier: SubscriptionTier): number {
  const def = TIERS[tier];
  if (def.priceMonthly === 0 || def.priceYearly === 0) return 0;
  const monthlyCostPerYear = def.priceMonthly * 12;
  return toPercent(monthlyCostPerYear - def.priceYearly, monthlyCostPerYear);
}

// --------------- Tier Resolution ---------------

/**
 * Resolve the subscription tier from a Paddle price ID.
 * Pass the known monthly and yearly Pro price IDs to keep this a pure function.
 */
export function tierFromPriceId(
  priceId: string | null,
  proMonthlyPriceId: string | undefined,
  proYearlyPriceId: string | undefined,
): SubscriptionTier {
  if (priceId === proMonthlyPriceId || priceId === proYearlyPriceId) return 'pro';
  return 'free';
}

/**
 * Get the features available for a tier.
 * Single source of truth — used by both client (useSubscription) and server.
 */
export function getTierFeatures(tier: SubscriptionTier): Feature[] {
  return [...TIERS[tier].features];
}

// --------------- Free Tier Default Response ---------------

/**
 * Default API response for users with no subscription record.
 * Shared by paddle/subscription route and any other endpoint that
 * needs to return a default free-tier subscription shape.
 */
export const FREE_TIER_RESPONSE = {
  subscription: {
    tier: 'free' as SubscriptionTier,
    status: 'active' as SubscriptionStatus,
    billingInterval: null,
    currentPeriodEnd: null,
    trialEnd: null,
    cancelAtPeriodEnd: false,
  },
} as const;
