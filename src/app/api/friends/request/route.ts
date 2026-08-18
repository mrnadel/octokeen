import { z } from 'zod';
import { db } from '@/lib/db';
import { friendRequests, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  areFriends,
  getExistingRequest,
  isFriendCapReached,
  MAX_FRIENDS,
} from '@/lib/db/friends';
import { rateLimit } from '@/lib/rate-limit';
import { parseBody, jsonOk, jsonError, TOO_MANY_REQUESTS } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

const SEND_REQUEST_RATE_LIMIT = { limit: 20, windowMs: 3600_000 };
const RESEND_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days after a decline

const postSchema = z.object({
  receiverId: z.string().uuid(),
});

export const POST = withAuth(async (req, { userId }) => {
  const rl = rateLimit(`friend-request:${userId}`, SEND_REQUEST_RATE_LIMIT);
  if (!rl.success) {
    return jsonError(TOO_MANY_REQUESTS, 429);
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
    return jsonError(`Friends list full (max ${MAX_FRIENDS})`, 409);
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
      if (updatedAt > Date.now() - RESEND_COOLDOWN_MS) {
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
