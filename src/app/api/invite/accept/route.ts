import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, friendships } from '@/lib/db/schema';
import { areFriends, sortFriendPair, countFriends, MAX_FRIENDS } from '@/lib/db/friends';
import { isUniqueViolation } from '@/lib/db/errors';
import { rateLimit } from '@/lib/rate-limit';
import { jsonOk, jsonError, TOO_MANY_REQUESTS } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { INVITE_REF_COOKIE } from '@/lib/api/cookies';

const ACCEPT_RATE_LIMIT = { limit: 5, windowMs: 3600_000 };

export const POST = withAuth(async (_req, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`invite-accept:${userId}`, ACCEPT_RATE_LIMIT);
  if (!rl.success) {
    return jsonError(TOO_MANY_REQUESTS, 429);
  }

  const cookieStore = await cookies();
  const inviterId = cookieStore.get(INVITE_REF_COOKIE)?.value;

  if (!inviterId) {
    return jsonError('No invite found', 400);
  }

  cookieStore.delete(INVITE_REF_COOKIE);

  const [inviter] = await db
    .select({ id: users.id, displayName: users.displayName })
    .from(users)
    .where(eq(users.id, inviterId))
    .limit(1);

  if (!inviter) {
    return jsonError('Inviter not found', 404);
  }

  if (inviterId === userId) {
    return jsonError('Cannot add yourself', 400);
  }

  if (await areFriends(userId, inviterId)) {
    return jsonOk({ already: true, name: inviter.displayName });
  }

  const [userCount, inviterCount] = await Promise.all([
    countFriends(userId),
    countFriends(inviterId),
  ]);

  if (userCount >= MAX_FRIENDS) {
    return jsonError('Your friends list is full', 409);
  }
  if (inviterCount >= MAX_FRIENDS) {
    return jsonError("Inviter's friends list is full", 409);
  }

  const [low, high] = sortFriendPair(userId, inviterId);
  try {
    await db.insert(friendships).values({ userId: low, friendId: high });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return jsonOk({ already: true, name: inviter.displayName });
    }
    throw err;
  }

  return jsonOk({ success: true, name: inviter.displayName });
});
