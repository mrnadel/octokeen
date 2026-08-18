import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, courseProgress } from '@/lib/db/schema';
import { getLessonByIdMeta } from '@/data/course/api';
import { courseProgressSyncSchema } from '@/lib/validation';
import { insertActivity } from '@/lib/activity-feed';
import { incrementDailyUsageBatch } from '@/lib/access-control';
import { parseBody, jsonOk, jsonError } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { getUserById } from '@/lib/db/queries';
import type { CourseProgress } from '@/data/course/types';
import { PROFESSION_ID } from '@/data/professions';
import { logger } from '@/lib/logger';

export const GET = withAuth(async (_req, { userId }) => {
  const user = await getUserById(userId);
  if (!user) {
    return jsonError('User not found', 404);
  }

  const [progress] = await db
    .select()
    .from(courseProgress)
    .where(eq(courseProgress.userId, userId))
    .limit(1);

  const assembled: CourseProgress = {
    displayName: user.displayName || user.name || 'Engineer',
    totalXp: progress?.totalXp ?? 0,
    currentStreak: progress?.currentStreak ?? 0,
    longestStreak: progress?.longestStreak ?? 0,
    lastActiveDate: progress?.lastActiveDate ?? '',
    activeDays: [],  // Client-only field — tracked in localStorage, not DB
    placementUnitIndex: progress?.placementUnitIndex ?? 0,
    completedLessons:
      (progress?.completedLessons as CourseProgress['completedLessons']) ?? {},
    courseIntros:
      (progress?.courseIntros as CourseProgress['courseIntros']) ?? undefined,
  };

  return jsonOk({
    progress: assembled,
    activeProfession: progress?.activeProfession ?? PROFESSION_ID.MECHANICAL_ENGINEERING,
  });
});

export const POST = withAuth(async (request, { userId }) => {
  const { data: body, error } = await parseBody(request, courseProgressSyncSchema);
  if (error) {
    // Log validation failures for debugging sync issues
    logger.error('course-progress validation failed');
    return error;
  }
  const { progress, activeProfession } = body as unknown as {
    progress: CourseProgress;
    activeProfession?: string;
  };

  // Store ALL progress regardless of current tier.
  // Access control is enforced at lesson-start time (client + server).
  // Filtering here would silently discard progress when users upgrade.
  const validLessons: CourseProgress['completedLessons'] = {};
  for (const [lessonId, lessonData] of Object.entries(progress.completedLessons)) {
    const info = getLessonByIdMeta(lessonId, activeProfession);
    if (!info) continue; // Skip unknown lesson IDs
    validLessons[lessonId] = lessonData;
  }

  const existing = await db
    .select({ id: courseProgress.id, completedLessons: courseProgress.completedLessons })
    .from(courseProgress)
    .where(eq(courseProgress.userId, userId))
    .limit(1);

  // Merge incoming lessons with existing DB lessons to avoid overwriting
  // completions from other devices that are not present in this sync payload.
  const existingCompletedLessons =
    (existing[0]?.completedLessons as CourseProgress['completedLessons']) ?? {};
  const mergedLessons = { ...existingCompletedLessons, ...validLessons };

  const data = {
    userId,
    totalXp: progress.totalXp,
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    lastActiveDate: progress.lastActiveDate,
    placementUnitIndex: progress.placementUnitIndex ?? 0,
    completedLessons: mergedLessons,
    activeProfession: activeProfession ?? PROFESSION_ID.MECHANICAL_ENGINEERING,
    courseIntros: (progress.courseIntros ?? {}) as Record<string, unknown>,
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db
      .update(courseProgress)
      .set(data)
      .where(eq(courseProgress.userId, userId));
  } else {
    await db.insert(courseProgress).values(data);
  }

  // Check for new lesson completions, increment daily usage, and insert activity
  if (existing.length > 0 && progress.completedLessons) {
    const prevLessons = Object.keys(
      (existing[0].completedLessons as Record<string, unknown>) ?? {},
    );
    const newLessons = Object.keys(mergedLessons);
    const newCompletions = newLessons.filter((id) => !prevLessons.includes(id));
    if (newCompletions.length > 0) {
      await incrementDailyUsageBatch(userId, newCompletions.length);
      await insertActivity(userId, 'lesson_complete', {
        count: newCompletions.length,
      });
    }
  }

  // Also update display name
  await db
    .update(users)
    .set({ displayName: progress.displayName, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return jsonOk({ ok: true });
});
