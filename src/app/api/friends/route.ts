import { db } from '@/lib/db';
import { users, userProgress, leagueState, sessionHistory } from '@/lib/db/schema';
import { eq, inArray, desc, and, sql } from 'drizzle-orm';
import { jsonOk } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { getFriendIds } from '@/lib/db/queries';
import { getUtcToday } from '@/lib/server-dates';

export const GET = withAuth(async (_req, { userId }) => {
  const friendIds = await getFriendIds(userId);

  if (friendIds.length === 0) {
    return jsonOk({ friends: [] });
  }

  const friends = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      image: users.image,
      level: userProgress.currentLevel,
      currentStreak: userProgress.currentStreak,
      totalXp: userProgress.totalXp,
      leagueTier: leagueState.tier,
    })
    .from(users)
    .leftJoin(userProgress, eq(users.id, userProgress.userId))
    .leftJoin(leagueState, eq(users.id, leagueState.userId))
    .where(inArray(users.id, friendIds))
    .orderBy(desc(userProgress.totalXp));

  // Get today's XP for all friends in one query
  const today = getUtcToday();
  const todayXpRows = await db
    .select({
      userId: sessionHistory.userId,
      todayXp: sql<number>`coalesce(sum(${sessionHistory.xpEarned}), 0)::int`,
    })
    .from(sessionHistory)
    .where(and(inArray(sessionHistory.userId, friendIds), eq(sessionHistory.date, today)))
    .groupBy(sessionHistory.userId);

  const todayXpMap = new Map(todayXpRows.map((r) => [r.userId, r.todayXp]));

  const result = friends.map((f) => ({
    id: f.id,
    displayName: f.displayName ?? 'Unknown',
    image: f.image ?? null,
    level: f.level ?? 1,
    currentStreak: f.currentStreak ?? 0,
    totalXp: f.totalXp ?? 0,
    leagueTier: f.leagueTier ?? 1,
    todayXp: todayXpMap.get(f.id) ?? 0,
  }));

  return jsonOk({ friends: result });
});
