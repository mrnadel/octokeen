import { db } from '@/lib/db';
import { friendships, friendRequests } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { sortFriendPair } from '@/lib/db/friends';
import { jsonOk, jsonError, lastPathSegment } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

export const DELETE = withAuth(async (req, { userId }) => {
  const friendId = lastPathSegment(req);
  const [low, high] = sortFriendPair(userId, friendId);

  const result = await db
    .delete(friendships)
    .where(and(eq(friendships.userId, low), eq(friendships.friendId, high)))
    .returning();

  if (result.length === 0) {
    return jsonError('Friendship not found', 404);
  }

  await db
    .delete(friendRequests)
    .where(
      or(
        and(eq(friendRequests.senderId, userId), eq(friendRequests.receiverId, friendId)),
        and(eq(friendRequests.senderId, friendId), eq(friendRequests.receiverId, userId))
      )
    );

  return jsonOk({ status: 'removed' });
});
