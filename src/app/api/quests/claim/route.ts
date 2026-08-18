import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questProgress } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { parseBody, jsonOk, jsonError } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

const MS_PER_DAY = 86_400_000;
const DAILY_CLAIM_WINDOW_DAYS = 2;
const WEEKLY_CLAIM_WINDOW_DAYS = 14;
const MAX_QUEST_GEM_REWARD = 50;

const claimSchema = z.object({
  questId: z.string().min(1).max(100),
  questType: z.enum(['daily', 'weekly']),
  questDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type ClaimResult =
  | { success: false; error: string; status: number }
  | { success: true; gems: number };

export const POST = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const { data, error } = await parseBody(request, claimSchema);
  if (error) return error;

  const { questId, questType, questDate } = data;

  // Reject stale claims: daily quests expire after 2 days, weekly after 14
  const maxAgeDays = questType === 'daily' ? DAILY_CLAIM_WINDOW_DAYS : WEEKLY_CLAIM_WINDOW_DAYS;
  const questDateMs = new Date(questDate + 'T00:00:00Z').getTime();
  const ageDays = (Date.now() - questDateMs) / MS_PER_DAY;
  if (ageDays > maxAgeDays) {
    return jsonError('Quest expired', 410);
  }

  // Use a transaction to prevent TOCTOU race conditions (double claiming)
  const result: ClaimResult = await db.transaction(async (tx): Promise<ClaimResult> => {
    const rows = await tx
      .select()
      .from(questProgress)
      .where(
        and(
          eq(questProgress.userId, userId),
          eq(questProgress.questType, questType),
          eq(questProgress.questDate, questDate),
        ),
      )
      .limit(1);

    if (rows.length === 0) return { success: false, error: 'Quest not found', status: 404 };

    const questRow = rows[0];
    const quests = questRow.quests as Array<{
      definitionId: string;
      completed: boolean;
      claimed: boolean;
      reward: { gems: number; xp: number };
      progress: number;
      target: number;
    }>;

    const quest = quests.find((q) => q.definitionId === questId);
    if (!quest) return { success: false, error: 'Quest not found in row', status: 404 };

    if (!quest.completed || quest.progress < quest.target) {
      return { success: false, error: 'Quest not completed', status: 400 };
    }
    if (quest.claimed) {
      return { success: false, error: 'Already claimed', status: 409 };
    }

    const gemsReward = Math.min(quest.reward.gems, MAX_QUEST_GEM_REWARD);

    const updatedQuests = quests.map((q) =>
      q.definitionId === questId ? { ...q, claimed: true } : q,
    );

    await tx
      .update(questProgress)
      .set({ quests: updatedQuests })
      .where(
        and(
          eq(questProgress.userId, userId),
          eq(questProgress.questType, questType),
          eq(questProgress.questDate, questDate),
        ),
      );

    // NOTE: Do NOT insert gem_transactions here — the client's addGems() creates
    // a local transaction that is synced via POST /api/engagement (newGemTransactions).
    // Inserting here would double-credit the user.

    return { success: true, gems: gemsReward };
  });

  if (!result.success) {
    return jsonError(result.error, result.status);
  }

  return jsonOk(result);
});
