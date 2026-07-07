import { db } from '@/lib/db';
import { activityFeed } from '@/lib/db/schema';
import { lt } from 'drizzle-orm';
import { withCronAuth, jsonOk } from '@/lib/api-helpers';

/**
 * GET /api/cron/activity-cleanup
 * Deletes activity feed entries older than 14 days.
 * Protected by CRON_SECRET header check.
 * Activity reactions are cascade-deleted via FK constraint.
 */
export const GET = withCronAuth(async () => {
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  // Reactions cascade-delete with activities (ON DELETE CASCADE on activityReactions FK)
  await db
    .delete(activityFeed)
    .where(lt(activityFeed.createdAt, cutoff));

  return jsonOk({
    ok: true,
    deletedBefore: cutoff.toISOString(),
  });
});
