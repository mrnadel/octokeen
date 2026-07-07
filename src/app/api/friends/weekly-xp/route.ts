import { db } from '@/lib/db';
import { users, sessionHistory } from '@/lib/db/schema';
import { eq, inArray, and, gte, sql } from 'drizzle-orm';
import { withAuth, jsonOk } from '@/lib/api-helpers';
import { getFriendIds } from '@/lib/db/queries';

function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  return monday.toISOString().split('T')[0];
}

export const GET = withAuth(async (_req, { userId }) => {
  const friendIds = await getFriendIds(userId);
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

  return jsonOk({ leaderboard });
});
