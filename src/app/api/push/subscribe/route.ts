import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { db } from '@/lib/db';
import { pushSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { parseBody, jsonOk, rateLimited } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export const POST = withAuth(async (req, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`push-subscribe:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  const { data, error } = await parseBody(req, subscribeSchema, {
    invalidInput: 'Invalid subscription',
  });
  if (error) return error;
  const { endpoint, keys } = data;

  // Upsert — replace if same endpoint exists
  const existing = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(pushSubscriptions)
      .set({ userId, p256dh: keys.p256dh, auth: keys.auth })
      .where(eq(pushSubscriptions.endpoint, endpoint));
  } else {
    await db.insert(pushSubscriptions).values({
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    });
  }

  return jsonOk({ ok: true });
});
