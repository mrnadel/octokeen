import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import paddle from '@/lib/paddle';
import { db } from '@/lib/db';
import { users, subscriptions } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { PADDLE_PRICES } from '@/lib/pricing';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`checkout:${userId}`, RATE_LIMITS.api);
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

  const { priceId } = (await request.json()) as { priceId?: string };

  // Validate the priceId is one we recognise
  const validPrices = [
    process.env.PADDLE_PRO_MONTHLY_PRICE_ID || '',
    process.env.PADDLE_PRO_YEARLY_PRICE_ID || '',
  ];

  if (!priceId || !validPrices.includes(priceId)) {
    console.error('Checkout price validation failed', {
      priceId,
      validPrices,
      envMonthly: process.env.PADDLE_PRO_MONTHLY_PRICE_ID ?? 'MISSING',
      envYearly: process.env.PADDLE_PRO_YEARLY_PRICE_ID ?? 'MISSING',
    });
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  // Fetch user email
  const [user] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.email) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Create a transaction server-side and return its ID
  // This avoids client-side transaction creation issues
  try {
    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
    });
    return NextResponse.json({ transactionId: transaction.id });
  } catch (err) {
    console.error('Paddle transaction create failed:', err);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
