import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contentFeedback } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { VALID_CONTENT_TYPES, VALID_REASONS } from '@/data/types';
import type { ContentFeedbackType, FeedbackReason } from '@/data/types';

const postFeedbackSchema = z.object({
  contentType: z.enum(['question', 'lesson-question'] as [ContentFeedbackType, ...ContentFeedbackType[]]),
  contentId: z.string().min(1).max(50),
  reason: z.enum(['confusing', 'incorrect', 'too-easy', 'too-hard', 'bad-graphic', 'other'] as [FeedbackReason, ...FeedbackReason[]]),
  comment: z.string().max(500).optional(),
});

const deleteFeedbackSchema = z.object({
  contentType: z.string().min(1),
  contentId: z.string().min(1),
});

// GET /api/content-feedback — fetch all flags for the authenticated user
export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select({
      contentType: contentFeedback.contentType,
      contentId: contentFeedback.contentId,
      reason: contentFeedback.reason,
      comment: contentFeedback.comment,
    })
    .from(contentFeedback)
    .where(eq(contentFeedback.userId, userId));

  return NextResponse.json({ flags: rows });
}

// POST /api/content-feedback — upsert a flag
export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const postResult = postFeedbackSchema.safeParse(rawBody);
  if (!postResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { contentType, contentId, reason, comment } = postResult.data;
  const sanitizedComment = comment ? comment.trim().slice(0, 500) || null : null;

  // Upsert: delete existing + insert
  await db.transaction(async (tx) => {
    await tx
      .delete(contentFeedback)
      .where(
        and(
          eq(contentFeedback.userId, userId),
          eq(contentFeedback.contentType, contentType),
          eq(contentFeedback.contentId, contentId)
        )
      );
    await tx.insert(contentFeedback).values({
      userId,
      contentType,
      contentId,
      reason,
      comment: sanitizedComment,
    });
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/content-feedback — remove a flag (idempotent)
export async function DELETE(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawDelBody: unknown;
  try {
    rawDelBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const deleteResult = deleteFeedbackSchema.safeParse(rawDelBody);
  if (!deleteResult.success) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const { contentType, contentId } = deleteResult.data;

  await db
    .delete(contentFeedback)
    .where(
      and(
        eq(contentFeedback.userId, userId),
        eq(contentFeedback.contentType, contentType),
        eq(contentFeedback.contentId, contentId)
      )
    );

  return NextResponse.json({ ok: true });
}
