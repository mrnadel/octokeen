import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, courseProgress } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { getLessonByIdMeta } from '@/data/course/api';
import { courseProgressSyncSchema } from '@/lib/validation';
import { insertActivity } from '@/lib/activity-feed';
import { incrementDailyUsageBatch } from '@/lib/access-control';
import type { CourseProgress } from '@/data/course/types';
import { PROFESSION_ID } from '@/data/professions';
import { logger } from '@/lib/logger';

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

  return NextResponse.json({
    progress: assembled,
    activeProfession: progress?.activeProfession ?? PROFESSION_ID.MECHANICAL_ENGINEERING,
  });
}

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
  const parsed = courseProgressSyncSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    logger.error('course-progress validation failed:', JSON.stringify({ path: issue?.path, message: issue?.message, code: issue?.code }));
    return NextResponse.json(
      { error: 'Invalid input', details: issue?.message, path: issue?.path },
      { status: 400 }
    );
  }
  const { progress, activeProfession } = parsed.data as unknown as {
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

  return NextResponse.json({ ok: true });
}
