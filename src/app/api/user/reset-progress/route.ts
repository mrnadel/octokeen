import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  userProgress,
  courseProgress,
  topicProgress,
  sessionHistory,
  dailyUsage,
  masteryEvents,
  gemTransactions,
  questProgress,
  leagueState,
  activityFeed,
  friendQuests,
  pushSubscriptions,
} from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { parseBody, jsonOk, rateLimited, INVALID_CONFIRMATION } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

const resetProgressSchema = z.object({
  confirmation: z.literal('RESET MY PROGRESS'),
});

export const POST = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`reset-progress:${userId}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  // Require the confirmation phrase in the body
  const { error } = await parseBody(request, resetProgressSchema, {
    invalidInput: INVALID_CONFIRMATION,
  });
  if (error) return error;

  // Wipe all progress tables for this user atomically
  await db.transaction(async (tx) => {
    await Promise.all([
      tx.delete(sessionHistory).where(eq(sessionHistory.userId, userId)),
      tx.delete(topicProgress).where(eq(topicProgress.userId, userId)),
      tx.delete(dailyUsage).where(eq(dailyUsage.userId, userId)),
      tx.delete(masteryEvents).where(eq(masteryEvents.userId, userId)),
      tx.delete(gemTransactions).where(eq(gemTransactions.userId, userId)),
      tx.delete(questProgress).where(eq(questProgress.userId, userId)),
      tx.delete(leagueState).where(eq(leagueState.userId, userId)),
      tx.delete(activityFeed).where(eq(activityFeed.userId, userId)),
      tx.delete(friendQuests).where(eq(friendQuests.userId, userId)),
      tx.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, userId)),
      tx.delete(userProgress).where(eq(userProgress.userId, userId)),
      tx.delete(courseProgress).where(eq(courseProgress.userId, userId)),
    ]);
  });

  return jsonOk({ ok: true });
});
