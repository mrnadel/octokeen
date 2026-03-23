import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { friendships, users, userProgress, leagueState, sessionHistory } from '@/lib/db/schema';
import { eq, or, inArray, desc, and, sql } from 'drizzle-orm';

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select({ usrId: friendships.userId, frnId: friendships.friendId })
    .from(friendships)
    .where(or(eq(friendships.userId, userId), eq(friendships.friendId, userId)));

  const friendIds = rows.map((r) => (r.usrId === userId ? r.frnId : r.usrId));

  if (friendIds.length === 0) {
    return NextResponse.json({ friends: [] });
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
  const today = new Date().toISOString().split('T')[0];
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

  return NextResponse.json({ friends: result });
}
