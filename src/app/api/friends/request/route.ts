import { z } from 'zod';
import { db } from '@/lib/db';
import { friendRequests, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  areFriends,
  getExistingRequest,
  isFriendCapReached,
} from '@/lib/db/friends';
import { rateLimit } from '@/lib/rate-limit';
import { withAuth, parseBody, jsonOk, jsonError } from '@/lib/api-helpers';

const postSchema = z.object({
  receiverId: z.string().uuid(),
});

export const POST = withAuth(async (req, { userId }) => {
  const rl = rateLimit(`friend-request:${userId}`, { limit: 20, windowMs: 3600_000 });
  if (!rl.success) {
    return jsonError('Too many requests', 429);
  }

  const { data, error } = await parseBody(req, postSchema);
  if (error) return error;
  const { receiverId } = data;

  if (receiverId === userId) {
    return jsonError('Cannot send request to yourself', 400);
  }

  const [receiver] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, receiverId))
    .limit(1);

  if (!receiver) {
    return jsonError('User not found', 404);
  }

  if (await areFriends(userId, receiverId)) {
    return jsonError('Already friends', 409);
  }

  if (await isFriendCapReached(userId)) {
    return jsonError('Friends list full (max 50)', 409);
  }

  const existing = await getExistingRequest(userId, receiverId);
  if (existing) {
    if (existing.status === 'pending') {
      return jsonError('Request already exists', 409);
    }
    if (existing.status === 'accepted') {
      return jsonError('Already friends', 409);
    }
    if (existing.status === 'declined') {
      const updatedAt = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (updatedAt > sevenDaysAgo) {
        return jsonError('Cannot re-send yet, please wait', 429);
      }
      await db.delete(friendRequests).where(eq(friendRequests.id, existing.id));
    }
  }

  const [newRequest] = await db
    .insert(friendRequests)
    .values({
      senderId: userId,
      receiverId,
      status: 'pending',
    })
    .returning();

  return jsonOk({ request: newRequest }, { status: 201 });
});
