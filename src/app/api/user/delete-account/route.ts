import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { cleanupBeforeDeletion } from '@/lib/account-cleanup';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { parseBody, jsonOk, rateLimited, INVALID_CONFIRMATION } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

const deleteAccountSchema = z.object({
  confirmation: z.literal('DELETE MY ACCOUNT'),
});

export const DELETE = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`delete-account:${userId}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  const { error } = await parseBody(request, deleteAccountSchema, {
    invalidInput: INVALID_CONFIRMATION,
  });
  if (error) return error;

  // Cancel Paddle subscription, archive payment history, delete Mixpanel
  // profile — all best-effort so failures don't block deletion.
  await cleanupBeforeDeletion(userId);

  // Delete user row. All related tables have onDelete: 'cascade',
  // so progress, subscriptions, sessions, friendships, etc. are wiped automatically.
  await db.delete(users).where(eq(users.id, userId));

  return jsonOk({ ok: true });
});
