import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

// DEV ONLY: Grant Pro to the currently logged-in user
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  // Only admin can grant pro, even in development
  const userId = await requireAdmin();
  if (!userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Check if subscription already exists
    const [existing] = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existing) {
      // Update to pro
      await db
        .update(subscriptions)
        .set({ tier: 'pro', status: 'active' })
        .where(eq(subscriptions.userId, userId));
    } else {
      // Insert new pro subscription
      await db.insert(subscriptions).values({
        userId,
        tier: 'pro',
        status: 'active',
      });
    }

    return NextResponse.json({ success: true, message: 'You are now Pro!' });
  } catch (error) {
    console.error('Grant pro error:', error);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
