import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProgress } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DAILY_REWARD_CYCLE } from '@/data/daily-rewards';
import { MAX_STREAK_FREEZES } from '@/data/engagement-types';
import { getServerToday } from '@/lib/server-dates';
import { jsonOk, jsonError } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

type ClaimResult =
  | { success: false; error: string; status: number }
  | { success: true; gems: number; day: number; freezeAdded: boolean };

export const POST = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const today = getServerToday(request.headers.get('x-timezone'));

  // Use a transaction to prevent TOCTOU race conditions (double claiming)
  const result: ClaimResult = await db.transaction(async (tx): Promise<ClaimResult> => {
    const rows = await tx
      .select({
        dailyRewardCalendar: userProgress.dailyRewardCalendar,
        streakFreezes: userProgress.streakFreezes,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);

    if (rows.length === 0) return { success: false, error: 'No progress record', status: 404 };

    const cal = rows[0].dailyRewardCalendar as {
      currentDay: number;
      lastClaimDate: string | null;
      todayClaimed: boolean;
      cycleStartDate: string | null;
      cyclesCompleted: number;
    };

    // Prevent double-claiming
    if (cal.todayClaimed && cal.lastClaimDate === today) {
      return { success: false, error: 'Already claimed today', status: 409 };
    }

    // Get reward for current day (1-indexed)
    const dayIndex = Math.max(0, Math.min(cal.currentDay - 1, DAILY_REWARD_CYCLE.length - 1));
    const reward = DAILY_REWARD_CYCLE[dayIndex];
    if (!reward) return { success: false, error: 'Invalid reward day', status: 400 };

    const gemsReward = reward.gems ?? 0;

    const updatedCal = {
      ...cal,
      lastClaimDate: today,
      todayClaimed: true,
    };

    // Handle streak freeze bonus
    let freezeAdded = false;
    const currentFreezes = rows[0].streakFreezes ?? 0;
    if (reward.bonusType === 'streak_freeze' && currentFreezes < MAX_STREAK_FREEZES) {
      await tx
        .update(userProgress)
        .set({ dailyRewardCalendar: updatedCal, streakFreezes: currentFreezes + 1 })
        .where(eq(userProgress.userId, userId));
      freezeAdded = true;
    } else {
      await tx
        .update(userProgress)
        .set({ dailyRewardCalendar: updatedCal })
        .where(eq(userProgress.userId, userId));
    }

    // NOTE: Do NOT insert gem_transactions here — the client's addGems() creates
    // a local transaction that is synced via POST /api/engagement (newGemTransactions).
    // Inserting here would double-credit the user.

    return { success: true, gems: gemsReward, day: cal.currentDay, freezeAdded };
  });

  if (!result.success) {
    return jsonError(result.error, result.status);
  }

  return jsonOk(result);
});
