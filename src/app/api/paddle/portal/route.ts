import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import paddle from '@/lib/paddle';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { jsonOk, jsonError, rateLimited, TOO_MANY_REQUESTS_RETRY } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

export const POST = withAuth(async (_req, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`portal:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return rateLimited(rl.resetAt, TOO_MANY_REQUESTS_RETRY);
  }

  const [sub] = await db
    .select({
      paddleSubscriptionId: subscriptions.paddleSubscriptionId,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (!sub?.paddleSubscriptionId) {
    return jsonError('No active subscription found', 404);
  }

  // Fetch subscription from Paddle to get management URLs
  try {
    const paddleSub = await paddle.subscriptions.get(sub.paddleSubscriptionId);

    return jsonOk({
      updateUrl: paddleSub.managementUrls?.updatePaymentMethod ?? null,
      cancelUrl: paddleSub.managementUrls?.cancel ?? null,
    });
  } catch (err) {
    logger.error('Failed to fetch Paddle subscription:', err);
    return jsonError('Failed to load subscription details', 502);
  }
});
