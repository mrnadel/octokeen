import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import paddle from '@/lib/paddle';
import { db } from '@/lib/db';
import { users, subscriptions } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { serverEnv } from '@/lib/env';
import { logger } from '@/lib/logger';
import { jsonOk, jsonError, rateLimited, TOO_MANY_REQUESTS_RETRY } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

export const POST = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`checkout:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return rateLimited(rl.resetAt, TOO_MANY_REQUESTS_RETRY);
  }

  let body: { priceId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON', 400);
  }
  const priceId = body.priceId?.trim();

  // Validate the priceId is one we recognise
  const env = serverEnv();
  const validPrices = [
    env.PADDLE_PRO_MONTHLY_PRICE_ID || '',
    env.PADDLE_PRO_YEARLY_PRICE_ID || '',
  ].filter(Boolean);

  if (!priceId || !validPrices.includes(priceId)) {
    logger.error('Checkout price validation failed', {
      priceId,
      validPrices,
      envMonthly: env.PADDLE_PRO_MONTHLY_PRICE_ID ?? 'MISSING',
      envYearly: env.PADDLE_PRO_YEARLY_PRICE_ID ?? 'MISSING',
    });
    return jsonError('Invalid price', 400);
  }

  // Fetch user email
  const [user] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.email) {
    return jsonError('User not found', 404);
  }

  // Create a transaction server-side and return its ID
  // This avoids client-side transaction creation issues
  try {
    // Look up existing Paddle customer ID for this user
    const [sub] = await db
      .select({ paddleCustomerId: subscriptions.paddleCustomerId })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    const transaction = sub?.paddleCustomerId
      ? await paddle.transactions.create({
          items: [{ priceId, quantity: 1 }],
          customerId: sub.paddleCustomerId,
        })
      : await paddle.transactions.create({
          items: [{ priceId, quantity: 1 }],
          customer: { email: user.email },
        } as never);
    return jsonOk({ transactionId: transaction.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const details = err && typeof err === 'object' && 'code' in err ? (err as Record<string, unknown>).code : undefined;
    logger.error('Paddle transaction create failed:', message, details);
    // Do not leak internal error details to the client
    return jsonError('Failed to create checkout', 500);
  }
});
