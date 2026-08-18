import { z } from 'zod';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { db } from '@/lib/db';
import { friendRequests, friendships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sortFriendPair, isFriendCapReached, MAX_FRIENDS } from '@/lib/db/friends';
import { parseBody, jsonOk, jsonError, rateLimited, lastPathSegment } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

const patchSchema = z.object({
  action: z.enum(['accept', 'decline']),
});

export const PATCH = withAuth(async (req, { userId }) => {
  const rl = rateLimit(`friend-request:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  const requestId = lastPathSegment(req);

  const { data, error } = await parseBody(req, patchSchema);
  if (error) return error;
  const { action } = data;

  const [pendingReq] = await db
    .select()
    .from(friendRequests)
    .where(and(eq(friendRequests.id, requestId), eq(friendRequests.receiverId, userId)))
    .limit(1);

  if (!pendingReq) {
    return jsonError('Request not found', 404);
  }

  if (pendingReq.status !== 'pending') {
    return jsonError('Request already handled', 409);
  }

  if (action === 'accept') {
    const [low, high] = sortFriendPair(userId, pendingReq.senderId);

    try {
      await db.transaction(async (tx) => {
        // Check caps inside transaction to prevent concurrent accepts exceeding the limit
        if (await isFriendCapReached(userId) || await isFriendCapReached(pendingReq.senderId)) {
          throw new Error('FRIEND_CAP');
        }
        await tx.insert(friendships).values({ userId: low, friendId: high });
        await tx
          .update(friendRequests)
          .set({ status: 'accepted', updatedAt: new Date() })
          .where(eq(friendRequests.id, requestId));
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'FRIEND_CAP') {
        return jsonError(`Friends list full (max ${MAX_FRIENDS})`, 409);
      }
      throw err;
    }

    return jsonOk({ status: 'accepted' });
  }

  await db
    .update(friendRequests)
    .set({ status: 'declined', updatedAt: new Date() })
    .where(eq(friendRequests.id, requestId));

  return jsonOk({ status: 'declined' });
});

export const DELETE = withAuth(async (req, { userId }) => {
  const requestId = lastPathSegment(req);

  const [pendingReq] = await db
    .select()
    .from(friendRequests)
    .where(and(eq(friendRequests.id, requestId), eq(friendRequests.senderId, userId)))
    .limit(1);

  if (!pendingReq) {
    return jsonError('Request not found', 404);
  }

  if (pendingReq.status !== 'pending') {
    return jsonError('Cannot cancel non-pending request', 409);
  }

  await db.delete(friendRequests).where(eq(friendRequests.id, requestId));

  return jsonOk({ status: 'cancelled' });
});
