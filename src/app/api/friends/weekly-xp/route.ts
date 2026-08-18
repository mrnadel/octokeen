import { db } from '@/lib/db';
import { users, sessionHistory } from '@/lib/db/schema';
import { inArray, and, gte, sql } from 'drizzle-orm';
import { jsonOk } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { getFriendIds } from '@/lib/db/queries';
import { getUtcWeekMonday } from '@/lib/server-dates';

export const GET = withAuth(async (_req, { userId }) => {
  const friendIds = await getFriendIds(userId);
  const allIds = [userId, ...friendIds];

  const weekStart = getUtcWeekMonday(new Date());

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
