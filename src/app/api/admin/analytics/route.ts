import { db } from '@/lib/db';
import { users, dailyUsage, sessionHistory, topicProgress } from '@/lib/db/schema';
import { jsonOk } from '@/lib/api-helpers';
import { withAdminAuth } from '@/lib/api/guards';
import { getUtcToday, getUtcDaysAgo } from '@/lib/server-dates';
import { eq, sql, count, sum, desc } from 'drizzle-orm';

const ACTIVE_WINDOW_DAYS = 7;
const RECENT_SESSION_LIMIT = 10;
const PERCENT = 100;

export const GET = withAdminAuth(async () => {
  const today = getUtcToday();

  // 1. Total users
  const [totalUsersResult] = await db
    .select({ value: count() })
    .from(users);

  // 2. Active today — distinct users with a dailyUsage row for today
  const [activeTodayResult] = await db
    .select({ value: count() })
    .from(dailyUsage)
    .where(eq(dailyUsage.date, today));

  // 3. Active this week — distinct users with dailyUsage in last 7 days
  const weekStart = getUtcDaysAgo(ACTIVE_WINDOW_DAYS);

  const [activeWeekResult] = await db
    .select({ value: sql<number>`count(distinct ${dailyUsage.userId})` })
    .from(dailyUsage)
    .where(sql`${dailyUsage.date} >= ${weekStart}`);

  // 4. Total questions answered
  const [totalQuestionsResult] = await db
    .select({ value: sum(sessionHistory.questionsAttempted) })
    .from(sessionHistory);

  // 5. Topic performance
  const topicRows = await db
    .select({
      topicId: topicProgress.topicId,
      totalAttempts: sum(topicProgress.questionsAttempted).mapWith(Number),
      totalCorrect: sum(topicProgress.questionsCorrect).mapWith(Number),
    })
    .from(topicProgress)
    .groupBy(topicProgress.topicId)
    .orderBy(desc(sum(topicProgress.questionsAttempted)));

  const topicPerformance = topicRows.map((row) => ({
    topicId: row.topicId,
    totalAttempts: row.totalAttempts || 0,
    accuracy:
      row.totalAttempts && row.totalAttempts > 0
        ? Math.round(((row.totalCorrect || 0) / row.totalAttempts) * PERCENT)
        : 0,
  }));

  // 6. Recent activity — last 10 sessions
  const recentSessions = await db
    .select({
      date: sessionHistory.date,
      questionsAttempted: sessionHistory.questionsAttempted,
      questionsCorrect: sessionHistory.questionsCorrect,
      xpEarned: sessionHistory.xpEarned,
      userId: sessionHistory.userId,
    })
    .from(sessionHistory)
    .orderBy(desc(sessionHistory.date))
    .limit(RECENT_SESSION_LIMIT);

  return jsonOk({
    overview: {
      totalUsers: totalUsersResult.value,
      activeToday: activeTodayResult.value,
      activeThisWeek: Number(activeWeekResult.value) || 0,
      totalQuestionsAnswered: Number(totalQuestionsResult.value) || 0,
    },
    topicPerformance,
    recentActivity: recentSessions,
  });
});
