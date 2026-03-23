import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { friendships, users, sessionHistory } from '@/lib/db/schema';
import { eq, or, inArray, and, gte, sql } from 'drizzle-orm';

function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  return monday.toISOString().split('T')[0];
}

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get friend IDs
  const rows = await db
    .select({ usrId: friendships.userId, frnId: friendships.friendId })
    .from(friendships)
    .where(or(eq(friendships.userId, userId), eq(friendships.friendId, userId)));

  const friendIds = rows.map((r) => (r.usrId === userId ? r.frnId : r.usrId));
  const allIds = [userId, ...friendIds];

  const weekStart = getWeekStart();

  // Get weekly XP for all users (user + friends)
  const xpRows = await db
    .select({
      userId: sessionHistory.userId,
      weeklyXp: sql<number>`coalesce(sum(${sessionHistory.xpEarned}), 0)::int`,
    })
    .from(sessionHistory)
    .where(and(inArray(sessionHistory.userId, allIds), gte(sessionHistory.date, weekStart)))
    .groupBy(sessionHistory.userId);

  const xpMap = new Map(xpRows.map((r) => [r.userId, r.weeklyXp]));

  // Get user details
  const userRows = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      image: users.image,
    })
    .from(users)
    .where(inArray(users.id, allIds));

  const leaderboard = userRows
    .map((u) => ({
      id: u.id,
      displayName: u.displayName ?? 'Unknown',
      image: u.image ?? null,
      weeklyXp: xpMap.get(u.id) ?? 0,
      isUser: u.id === userId,
    }))
    .sort((a, b) => b.weeklyXp - a.weeklyXp);

  return NextResponse.json({ leaderboard });
}
