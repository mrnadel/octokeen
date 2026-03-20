import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import paddle from '@/lib/paddle';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`portal:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil(
            (rl.resetAt.getTime() - Date.now()) / 1000,
          ).toString(),
        },
      },
    );
  }

  const [sub] = await db
    .select({
      paddleSubscriptionId: subscriptions.paddleSubscriptionId,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (!sub?.paddleSubscriptionId) {
    return NextResponse.json(
      { error: 'No active subscription found' },
      { status: 404 },
    );
  }

  // Fetch subscription from Paddle to get management URLs
  const paddleSub = await paddle.subscriptions.get(sub.paddleSubscriptionId);

  return NextResponse.json({
    updateUrl: paddleSub.managementUrls?.updatePaymentMethod ?? null,
    cancelUrl: paddleSub.managementUrls?.cancel ?? null,
  });
}
