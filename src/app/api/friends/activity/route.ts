import { z } from 'zod';
import { db } from '@/lib/db';
import { activityFeed, activityReactions, friendships, users } from '@/lib/db/schema';
import { eq, or, and, inArray, desc, sql } from 'drizzle-orm';
import { parseBody, jsonOk, jsonError } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { getFriendIds } from '@/lib/db/queries';

const reactSchema = z.object({
  activityId: z.string().min(1),
});

/**
 * GET /api/friends/activity — Get activity feed for the user's friends.
 * Returns last 20 activities from friends, with reaction counts.
 */
export const GET = withAuth(async (_req, { userId }) => {
  const friendIds = await getFriendIds(userId);
  if (friendIds.length === 0) {
    return jsonOk({ activities: [] });
  }

  // Get recent activities from friends
  const activities = await db
    .select({
      id: activityFeed.id,
      userId: activityFeed.userId,
      type: activityFeed.type,
      data: activityFeed.data,
      createdAt: activityFeed.createdAt,
      displayName: users.displayName,
      image: users.image,
    })
    .from(activityFeed)
    .innerJoin(users, eq(activityFeed.userId, users.id))
    .where(inArray(activityFeed.userId, friendIds))
    .orderBy(desc(activityFeed.createdAt))
    .limit(20);

  if (activities.length === 0) {
    return jsonOk({ activities: [] });
  }

  // Get reaction counts and whether current user reacted
  const activityIds = activities.map((a) => a.id);
  const reactionCounts = await db
    .select({
      activityId: activityReactions.activityId,
      count: sql<number>`count(*)::int`,
      userReacted: sql<boolean>`bool_or(${activityReactions.userId} = ${userId})`,
    })
    .from(activityReactions)
    .where(inArray(activityReactions.activityId, activityIds))
    .groupBy(activityReactions.activityId);

  const reactionMap = new Map(reactionCounts.map((r) => [r.activityId, r]));

  const enriched = activities.map((a) => {
    const reactions = reactionMap.get(a.id);
    return {
      id: a.id,
      userId: a.userId,
      displayName: a.displayName,
      image: a.image,
      type: a.type,
      data: a.data,
      createdAt: a.createdAt?.toISOString() ?? null,
      reactionCount: reactions?.count ?? 0,
      userReacted: reactions?.userReacted ?? false,
    };
  });

  return jsonOk({ activities: enriched });
});

/**
 * POST /api/friends/activity/react — React (high-five) to an activity.
 * Body: { activityId: string }
 */
export const POST = withAuth(async (req, { userId }) => {
  const { data, error } = await parseBody(req, reactSchema);
  if (error) return error;
  const { activityId } = data;

  // Verify the activity exists and belongs to a friend
  const [activity] = await db
    .select({ userId: activityFeed.userId })
    .from(activityFeed)
    .where(eq(activityFeed.id, activityId))
    .limit(1);

  if (!activity) {
    return jsonError('Activity not found', 404);
  }

  // Check friendship
  const [friendship] = await db
    .select()
    .from(friendships)
    .where(
      or(
        and(eq(friendships.userId, userId), eq(friendships.friendId, activity.userId)),
        and(eq(friendships.userId, activity.userId), eq(friendships.friendId, userId))
      )
    )
    .limit(1);

  if (!friendship) {
    return jsonError('Not friends', 403);
  }

  // Insert reaction (ignore if already exists)
  await db.insert(activityReactions).values({
    activityId,
    userId,
  }).onConflictDoNothing();

  return jsonOk({ ok: true });
});
