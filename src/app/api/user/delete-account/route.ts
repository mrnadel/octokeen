import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { cleanupBeforeDeletion } from '@/lib/account-cleanup';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const deleteAccountSchema = z.object({
  confirmation: z.literal('DELETE MY ACCOUNT'),
});

export async function DELETE(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`delete-account:${userId}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000).toString() },
    });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = deleteAccountSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid confirmation phrase' },
      { status: 400 }
    );
  }

  // Cancel Paddle subscription, archive payment history, delete Mixpanel
  // profile — all best-effort so failures don't block deletion.
  await cleanupBeforeDeletion(userId);

  // Delete user row. All related tables have onDelete: 'cascade',
  // so progress, subscriptions, sessions, friendships, etc. are wiped automatically.
  await db.delete(users).where(eq(users.id, userId));

  return NextResponse.json({ ok: true });
}
