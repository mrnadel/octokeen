import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contentFeedback } from '@/lib/db/schema';
import { parseBody, jsonOk, INVALID_REQUEST } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { VALID_CONTENT_TYPES, VALID_REASONS } from '@/data/types';
import type { ContentFeedbackType, FeedbackReason } from '@/data/types';

const MAX_COMMENT_LENGTH = 500;

const postFeedbackSchema = z.object({
  contentType: z.enum(VALID_CONTENT_TYPES as [ContentFeedbackType, ...ContentFeedbackType[]]),
  contentId: z.string().min(1).max(50),
  reason: z.enum(VALID_REASONS as [FeedbackReason, ...FeedbackReason[]]),
  comment: z.string().max(MAX_COMMENT_LENGTH).optional(),
});

const deleteFeedbackSchema = z.object({
  contentType: z.string().min(1),
  contentId: z.string().min(1),
});

/** Match a single flag row for a user. */
function flagMatcher(userId: string, contentType: string, contentId: string) {
  return and(
    eq(contentFeedback.userId, userId),
    eq(contentFeedback.contentType, contentType),
    eq(contentFeedback.contentId, contentId),
  );
}

// GET /api/content-feedback — fetch all flags for the authenticated user
export const GET = withAuth(async (_req, { userId }): Promise<NextResponse> => {
  const rows = await db
    .select({
      contentType: contentFeedback.contentType,
      contentId: contentFeedback.contentId,
      reason: contentFeedback.reason,
      comment: contentFeedback.comment,
    })
    .from(contentFeedback)
    .where(eq(contentFeedback.userId, userId));

  return jsonOk({ flags: rows });
});

// POST /api/content-feedback — upsert a flag
export const POST = withAuth(async (req, { userId }): Promise<NextResponse> => {
  const { data, error } = await parseBody(req, postFeedbackSchema, {
    invalidInput: INVALID_REQUEST,
  });
  if (error) return error;

  const { contentType, contentId, reason, comment } = data;
  const sanitizedComment = comment ? comment.trim().slice(0, MAX_COMMENT_LENGTH) || null : null;

  // Upsert: delete existing + insert
  await db.transaction(async (tx) => {
    await tx.delete(contentFeedback).where(flagMatcher(userId, contentType, contentId));
    await tx.insert(contentFeedback).values({
      userId,
      contentType,
      contentId,
      reason,
      comment: sanitizedComment,
    });
  });

  return jsonOk({ ok: true });
});

// DELETE /api/content-feedback — remove a flag (idempotent)
export const DELETE = withAuth(async (req, { userId }): Promise<NextResponse> => {
  const { data, error } = await parseBody(req, deleteFeedbackSchema, {
    invalidInput: 'Missing fields',
  });
  if (error) return error;

  const { contentType, contentId } = data;
  await db.delete(contentFeedback).where(flagMatcher(userId, contentType, contentId));

  return jsonOk({ ok: true });
});
