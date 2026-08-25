import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  users,
  userProgress,
  topicProgress as topicProgressTable,
  sessionHistory,
} from '@/lib/db/schema';
import { incrementDailyUsageBatch, canStartPracticeSession } from '@/lib/access-control';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { progressSyncSchema } from '@/lib/validation';
import { insertActivity } from '@/lib/activity-feed';
import { parseBody, jsonOk, jsonError, rateLimited } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { getUserById, getUserProgress } from '@/lib/db/queries';
import { getUtcToday, isValidTimeZone } from '@/lib/server-dates';
import type { UserProgress, TopicProgress, SessionRecord, TopicId } from '@/data/types';

export const GET = withAuth(async (_req, { userId }) => {
  // Fetch all user data in parallel instead of sequentially
  // Limit session history to last 100 entries to reduce egress
  const [user, progress, topics, sessions] = await Promise.all([
    getUserById(userId),
    getUserProgress(userId),
    db.select().from(topicProgressTable).where(eq(topicProgressTable.userId, userId)),
    db.select().from(sessionHistory).where(eq(sessionHistory.userId, userId))
      .orderBy(desc(sessionHistory.date)).limit(100),
  ]);

  if (!user) {
    return jsonError('User not found', 404);
  }

  // Assemble into UserProgress shape
  const topicProgressData: TopicProgress[] = topics.map((t) => ({
    topicId: t.topicId as TopicProgress['topicId'],
    questionsAttempted: t.questionsAttempted,
    questionsCorrect: t.questionsCorrect,
    averageConfidence: t.averageConfidence,
    lastAttempted: t.lastAttempted ?? '',
    subtopicBreakdown:
      (t.subtopicBreakdown as Record<string, { attempted: number; correct: number }>) ?? {},
  }));

  const sessionRecords: SessionRecord[] = sessions.map((s) => ({
    id: s.sessionId,
    date: s.date,
    durationMinutes: s.durationMinutes,
    questionsAttempted: s.questionsAttempted,
    questionsCorrect: s.questionsCorrect,
    topicsCovered: (s.topicsCovered as TopicId[]) ?? [],
    xpEarned: s.xpEarned,
  }));

  const assembled: UserProgress = {
    userId,
    displayName: user.displayName || user.name || 'Engineer',
    joinedDate: user.joinedDate || '',
    currentLevel: progress?.currentLevel ?? 1,
    totalXp: progress?.totalXp ?? 0,
    currentStreak: progress?.currentStreak ?? 0,
    longestStreak: progress?.longestStreak ?? 0,
    lastActiveDate: progress?.lastActiveDate ?? '',
    activeDays: (progress?.activeDays as string[]) ?? [],
    achievementsUnlocked: (progress?.achievementsUnlocked as string[]) ?? [],
    topicProgress: topicProgressData,
    sessionHistory: sessionRecords,
    dailyChallengesCompleted: progress?.dailyChallengesCompleted ?? 0,
    totalQuestionsAttempted: progress?.totalQuestionsAttempted ?? 0,
    totalQuestionsCorrect: progress?.totalQuestionsCorrect ?? 0,
    bookmarkedQuestions: (progress?.bookmarkedQuestions as string[]) ?? [],
    weakAreas: (progress?.weakAreas as string[]) ?? [],
    strongAreas: (progress?.strongAreas as string[]) ?? [],
  };

  return jsonOk({ progress: assembled });
});

export const POST = withAuth(async (request, { userId }) => {
  const rl = rateLimit(`progress:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  const { data: body, error } = await parseBody(request, progressSyncSchema);
  if (error) return error;
  const { progress } = body as { progress: UserProgress };

  // Upsert user_progress row
  const existing = await db
    .select({ id: userProgress.id, currentLevel: userProgress.currentLevel })
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  // Cap JSONB array sizes to prevent unbounded growth
  const MAX_BOOKMARKS = 500;
  const MAX_AREAS = 100;
  const MAX_ACHIEVEMENTS = 200;

  // The client sets X-Timezone on every sync; storing it lets the streak-reminder
  // cron resolve this user's own calendar day instead of the server's UTC one.
  // The header is untrusted, so a value the runtime cannot resolve is dropped
  // rather than written — and dropped silently, because a malformed header must
  // never be able to fail an otherwise valid progress sync. Omitting the key
  // entirely (rather than writing null) also keeps a previously captured zone
  // intact when a later request arrives without the header.
  const timezoneHeader = request.headers.get('x-timezone');
  const timezonePatch = isValidTimeZone(timezoneHeader) ? { timezone: timezoneHeader } : {};

  const progressData = {
    userId,
    currentLevel: progress.currentLevel,
    totalXp: progress.totalXp,
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    lastActiveDate: progress.lastActiveDate,
    achievementsUnlocked: (progress.achievementsUnlocked || []).slice(0, MAX_ACHIEVEMENTS),
    dailyChallengesCompleted: progress.dailyChallengesCompleted,
    totalQuestionsAttempted: progress.totalQuestionsAttempted,
    totalQuestionsCorrect: progress.totalQuestionsCorrect,
    bookmarkedQuestions: (progress.bookmarkedQuestions || []).slice(0, MAX_BOOKMARKS),
    weakAreas: (progress.weakAreas || []).slice(0, MAX_AREAS),
    strongAreas: (progress.strongAreas || []).slice(0, MAX_AREAS),
    activeDays: (progress.activeDays || []).slice(0, 14),
    ...timezonePatch,
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db
      .update(userProgress)
      .set(progressData)
      .where(eq(userProgress.userId, userId));
  } else {
    await db.insert(userProgress).values(progressData);
  }

  // Check if level increased and insert activity
  if (existing.length > 0 && progress.currentLevel) {
    const prevLevel = existing[0].currentLevel ?? 1;
    const newLevel = progress.currentLevel;
    if (newLevel > prevLevel) {
      await insertActivity(userId, 'level_up', { level: newLevel });
    }
  }

  // Update display name on user row
  await db
    .update(users)
    .set({ displayName: progress.displayName, updatedAt: new Date() })
    .where(eq(users.id, userId));

  // Delete and re-insert topic progress atomically (capped to prevent abuse)
  const MAX_TOPICS = 100;
  const topicData = progress.topicProgress.slice(0, MAX_TOPICS);

  await db.transaction(async (tx) => {
    await tx
      .delete(topicProgressTable)
      .where(eq(topicProgressTable.userId, userId));

    if (topicData.length > 0) {
      await tx.insert(topicProgressTable).values(
        topicData.map((tp) => ({
          userId,
          topicId: tp.topicId,
          questionsAttempted: tp.questionsAttempted,
          questionsCorrect: tp.questionsCorrect,
          averageConfidence: tp.averageConfidence,
          lastAttempted: tp.lastAttempted,
          subtopicBreakdown: tp.subtopicBreakdown,
        }))
      );
    }
  });

  // Cap sessions per sync to prevent abuse
  const MAX_SESSIONS_PER_SYNC = 50;
  const sessions = progress.sessionHistory.slice(0, MAX_SESSIONS_PER_SYNC);

  if (sessions.length > 0) {
    // ── Server-side daily usage enforcement ──
    const limitCheck = await canStartPracticeSession(userId);
    const todayStr = getUtcToday();
    const todaySessions = sessions.filter((s) => s.date === todayStr);
    const todayQuestionsAttempted = todaySessions.reduce((sum, s) => sum + s.questionsAttempted, 0);

    if (!limitCheck.allowed && todayQuestionsAttempted > 0) {
      return jsonError('Daily question limit reached', 403);
    }

    // Use ON CONFLICT DO NOTHING instead of manual dedup query
    await db.insert(sessionHistory).values(
      sessions.map((s) => ({
        userId,
        sessionId: s.id,
        date: s.date,
        durationMinutes: s.durationMinutes,
        questionsAttempted: s.questionsAttempted,
        questionsCorrect: s.questionsCorrect,
        topicsCovered: s.topicsCovered,
        xpEarned: s.xpEarned,
      }))
    ).onConflictDoNothing();

    if (todayQuestionsAttempted > 0) {
      await incrementDailyUsageBatch(userId, todayQuestionsAttempted);
    }
  }

  // Legacy engagement sync removed — /api/engagement is now the sole authority.
  // Gem balance is computed from the gem_transactions ledger server-side,
  // never accepted from the client.

  return jsonOk({ ok: true });
});
