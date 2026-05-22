import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { masteryEvents } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { canStartPracticeSession, canAccessPracticeMode } from '@/lib/access-control';

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

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Server-side daily limit enforcement ──
  // Reject mastery events if the user has exceeded their daily question limit
  const limitCheck = await canStartPracticeSession(userId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: 'Daily question limit reached', remaining: 0, limit: limitCheck.limit },
      { status: 403 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = masteryEventsBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const { events } = parsed.data;

  if (events.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 });
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

  return NextResponse.json({ ok: true, inserted: rows.length });
}
