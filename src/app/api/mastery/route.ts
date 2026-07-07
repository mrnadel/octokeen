import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { masteryEvents } from '@/lib/db/schema';
import { canStartPracticeSession } from '@/lib/access-control';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { withAuth, parseBody, jsonOk, jsonError } from '@/lib/api-helpers';

const masteryEventSchema = z.object({
  id: z.string().min(1),
  questionId: z.string().min(1),
  topicId: z.string().min(1),
  subtopic: z.string().optional(),
  difficulty: z.string().min(1),
  correct: z.boolean(),
  source: z.string().min(1),
  answeredAt: z.string().datetime(),
});

const masteryEventsBodySchema = z.object({
  events: z.array(masteryEventSchema).max(200),
});

export const GET = withAuth(async (_req, { userId }) => {
  // Limit to last 2000 events to reduce egress. Mastery computation
  // is dominated by recent activity anyway (spaced-repetition decay).
  const events = await db
    .select({
      id: masteryEvents.id,
      questionId: masteryEvents.questionId,
      topicId: masteryEvents.topicId,
      subtopic: masteryEvents.subtopic,
      difficulty: masteryEvents.difficulty,
      correct: masteryEvents.correct,
      source: masteryEvents.source,
      answeredAt: masteryEvents.answeredAt,
    })
    .from(masteryEvents)
    .where(eq(masteryEvents.userId, userId))
    .orderBy(desc(masteryEvents.answeredAt))
    .limit(2000);

  return jsonOk({ events });
});

export const POST = withAuth(async (request, { userId }) => {
  const rl = rateLimit(`mastery:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000).toString() },
    });
  }

  // ── Server-side daily limit enforcement ──
  // Reject mastery events if the user has exceeded their daily question limit
  const limitCheck = await canStartPracticeSession(userId);
  if (!limitCheck.allowed) {
    return jsonError('Daily question limit reached', 403);
  }

  const { data, error } = await parseBody(request, masteryEventsBodySchema);
  if (error) return error;

  const { events } = data;

  if (events.length === 0) {
    return jsonOk({ ok: true, inserted: 0 });
  }

  const rows = events.map((event) => ({
    id: event.id,
    userId,
    questionId: event.questionId,
    topicId: event.topicId,
    subtopic: event.subtopic ?? null,
    difficulty: event.difficulty,
    correct: event.correct,
    source: event.source,
    answeredAt: event.answeredAt,
  }));

  await db.insert(masteryEvents).values(rows).onConflictDoNothing();

  return jsonOk({ ok: true, inserted: rows.length });
});
