import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import { withAdminAuth, jsonOk, jsonError } from '@/lib/api-helpers';

// DEV ONLY: Grant Pro to the currently logged-in user
export const POST = withAdminAuth(async (_req, { adminId }) => {
  if (process.env.NODE_ENV !== 'development') {
    return jsonError('Not available', 403);
  }

  try {
    // Check if subscription already exists
    const [existing] = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.userId, adminId))
      .limit(1);

    if (existing) {
      // Update to pro
      await db
        .update(subscriptions)
        .set({ tier: 'pro', status: 'active' })
        .where(eq(subscriptions.userId, adminId));
    } else {
      // Insert new pro subscription
      await db.insert(subscriptions).values({
        userId: adminId,
        tier: 'pro',
        status: 'active',
      });
    }

    return jsonOk({ success: true, message: 'You are now Pro!' });
  } catch (error) {
    logger.error('Grant pro error:', error);
    return jsonError('DB error', 500);
  }
});
