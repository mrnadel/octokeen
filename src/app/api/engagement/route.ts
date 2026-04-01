import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { userProgress, gemTransactions, questProgress } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { engagementSyncSchema } from '@/lib/validation';

/**
 * GET /api/engagement
 * Returns the user's engagement state from the DB (gems, streak, hearts, quests, inventory).
 * This is the server-authoritative source for economy fields.
 */
export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [progressRows, questRows] = await Promise.all([
    db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1),
    db.select().from(questProgress).where(eq(questProgress.userId, userId)),
  ]);

  const progress = progressRows[0];

  // Build engagement response from DB state
  const engagement = {
    gems: {
      balance: progress?.gemsBalance ?? 0,
      totalEarned: progress?.gemsTotalEarned ?? 0,
      inventory: progress?.gemsInventory ?? { activeTitles: [], activeFrames: [] },
      selectedTitle: progress?.selectedTitle ?? null,
      selectedFrame: progress?.selectedFrame ?? null,
    },
    streak: {
      freezesOwned: progress?.streakFreezes ?? 0,
      milestonesReached: (progress?.streakMilestones as number[]) ?? [],
    },
    hearts: {
      current: progress?.heartsCurrent ?? 5,
      lastRechargeAt: progress?.heartsLastRechargeAt
        ? parseInt(progress.heartsLastRechargeAt, 10)
        : Date.now(),
    },
    doubleXpExpiry: progress?.doubleXpExpiry ?? null,
    quests: {
      daily: questRows.find((q) => q.questType === 'daily') ?? null,
      weekly: questRows.find((q) => q.questType === 'weekly') ?? null,
    },
  };

  return NextResponse.json(engagement);
}

/**
 * POST /api/engagement
 * Syncs engagement state from client to DB.
 * Server is authoritative: validates and caps all values.
 */
export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = engagementSyncSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.issues[0]?.message },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Upsert engagement columns on userProgress
  const existing = await db
    .select({ id: userProgress.id })
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  const engagementData = {
    gemsBalance: data.gems.balance,
    gemsTotalEarned: data.gems.totalEarned,
    gemsInventory: data.gems.inventory,
    selectedTitle: data.gems.selectedTitle,
    selectedFrame: data.gems.selectedFrame,
    streakFreezes: data.streak.freezesOwned,
    streakMilestones: data.streak.milestonesReached,
    heartsCurrent: data.hearts.current,
    heartsLastRechargeAt: String(data.hearts.lastRechargeAt),
    doubleXpExpiry: data.doubleXpExpiry,
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db
      .update(userProgress)
      .set(engagementData)
      .where(eq(userProgress.userId, userId));
  } else {
    await db.insert(userProgress).values({ userId, ...engagementData });
  }

  // Batch insert new gem transactions
  if (data.newGemTransactions?.length) {
    await db.insert(gemTransactions).values(
      data.newGemTransactions.map((t) => ({
        userId,
        amount: t.amount,
        source: t.source,
      })),
    );
  }

  // Upsert quest progress (delete + re-insert; quest data changes frequently)
  if (data.quests) {
    const { dailyQuests, weeklyQuests, dailyQuestDate, weeklyQuestDate, dailyChestClaimed, weeklyChestClaimed } = data.quests;

    await db.delete(questProgress).where(eq(questProgress.userId, userId));

    const questRows = [];
    if (dailyQuestDate && dailyQuests.length > 0) {
      questRows.push({
        userId,
        questDate: dailyQuestDate,
        questType: 'daily' as const,
        quests: dailyQuests,
        chestClaimed: dailyChestClaimed,
      });
    }
    if (weeklyQuestDate && weeklyQuests.length > 0) {
      questRows.push({
        userId,
        questDate: weeklyQuestDate,
        questType: 'weekly' as const,
        quests: weeklyQuests,
        chestClaimed: weeklyChestClaimed,
      });
    }
    if (questRows.length > 0) {
      await db.insert(questProgress).values(questRows);
    }
  }

  return NextResponse.json({ ok: true });
}
