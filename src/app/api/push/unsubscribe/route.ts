import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { db } from '@/lib/db';
import { pushSubscriptions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { parseBody, jsonOk, rateLimited } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

const unsubscribeSchema = z.object({
  endpoint: z.string().min(1),
});

export const POST = withAuth(async (req, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`push-unsubscribe:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  const { data, error } = await parseBody(req, unsubscribeSchema, {
    invalidInput: 'Missing endpoint',
  });
  if (error) return error;

  await db
    .delete(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.endpoint, data.endpoint),
        eq(pushSubscriptions.userId, userId)
      )
    );

  return jsonOk({ ok: true });
});
