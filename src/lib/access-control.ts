// ============================================================
// Server-Side Access Control — Octokeen SaaS
// ============================================================

import { eq, and, sql } from 'drizzle-orm';
import { db } from './db';
import { subscriptions, dailyUsage, courseAccess } from './db/schema';
import { LIMITS, PRO_SESSION_TYPES } from './pricing';
import { getUtcToday } from './server-dates';
import type { SubscriptionTier } from './subscription';

/**
 * True while a `trialing` subscription's trial window is still open.
 * Shared by tier resolution and the engagement endpoint's Pro check.
 */
export function isTrialActive(trialEnd: string | null | undefined): boolean {
  if (!trialEnd) return false;
  const end = new Date(trialEnd);
  return !isNaN(end.getTime()) && end > new Date();
}

/**
 * Resolve the effective tier for a user.
 * Returns 'free' if no subscription row exists.
 * Treats 'trialing' as 'pro' for access purposes.
 */
async function getEffectiveTier(userId: string): Promise<SubscriptionTier> {
  const [sub] = await db
    .select({ tier: subscriptions.tier, status: subscriptions.status, trialEnd: subscriptions.trialEnd })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (!sub) return 'free';

  // Active trial counts as pro
  if (sub.status === 'trialing') {
    return isTrialActive(sub.trialEnd) ? 'pro' : 'free';
  }

  if (sub.status === 'active') return sub.tier as SubscriptionTier;

  // past_due still grants access (grace period)
  if (sub.status === 'past_due') return sub.tier as SubscriptionTier;

  return 'free';
}

/**
 * Check if a user can start a practice session.
 * Free users: 5 questions per day. Pro: unlimited.
 */
export async function canStartPracticeSession(
  userId: string,
): Promise<{ allowed: boolean; tier: SubscriptionTier; remaining: number; limit: number }> {
  const tier = await getEffectiveTier(userId);
  const limit = LIMITS[tier].dailyQuestions;

  // Unlimited
  if (limit === -1) {
    return { allowed: true, tier, remaining: -1, limit: -1 };
  }

  const used = await getDailyQuestionsUsed(userId);
  const remaining = Math.max(0, limit - used);

  return { allowed: remaining > 0, tier, remaining, limit };
}

/**
 * Batch increment the daily question counter by a given count.
 * Single DB round-trip instead of N sequential calls.
 */
export async function incrementDailyUsageBatch(userId: string, count: number): Promise<void> {
  if (count <= 0) return;
  const today = getUtcToday();

  // Atomic upsert: INSERT or increment on conflict. Single round-trip, no race condition.
  await db
    .insert(dailyUsage)
    .values({ userId, date: today, questionsUsed: count })
    .onConflictDoUpdate({
      target: [dailyUsage.userId, dailyUsage.date],
      set: {
        questionsUsed: sql`${dailyUsage.questionsUsed} + ${count}`,
        updatedAt: new Date(),
      },
    });
}

/**
 * Check if a user can access a specific practice mode.
 * Pro-only modes: adaptive, interview-sim, weak-areas.
 */
export async function canAccessPracticeMode(
  userId: string,
  sessionType: string,
): Promise<{ allowed: boolean; tier: SubscriptionTier }> {
  const tier = await getEffectiveTier(userId);
  if (!isProSessionType(sessionType)) {
    return { allowed: true, tier };
  }
  return { allowed: tier === 'pro', tier };
}

/** Narrowing wrapper around the Pro-only session type set. */
function isProSessionType(sessionType: string): boolean {
  return (PRO_SESSION_TYPES as ReadonlySet<string>).has(sessionType);
}

/**
 * Get all profession IDs a user has been granted access to.
 */
export async function getUserCourseAccess(userId: string): Promise<string[]> {
  const rows = await db
    .select({ professionId: courseAccess.professionId })
    .from(courseAccess)
    .where(eq(courseAccess.userId, userId));

  return rows.map((r) => r.professionId);
}

// ─── Internal helpers ───────────────────────────────────────────

async function getDailyQuestionsUsed(userId: string): Promise<number> {
  const today = getUtcToday();

  const [row] = await db
    .select({ questionsUsed: dailyUsage.questionsUsed })
    .from(dailyUsage)
    .where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, today)))
    .limit(1);

  return row?.questionsUsed ?? 0;
}
