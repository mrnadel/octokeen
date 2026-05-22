import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';

const resetProgressSchema = z.object({
  confirmation: z.literal('RESET MY PROGRESS'),
});
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
import { getAuthUserId } from '@/lib/auth-utils';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`reset-progress:${userId}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000).toString() },
    });
  }

  // Require the confirmation phrase in the body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = resetProgressSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid confirmation phrase' },
      { status: 400 }
    );
  }

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

  return NextResponse.json({ ok: true });
}
