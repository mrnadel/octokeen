import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUserId } from '@/lib/auth-utils';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { db } from '@/lib/db';
import { friendRequests, friendships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sortFriendPair, isFriendCapReached } from '@/lib/db/friends';

const patchSchema = z.object({
  action: z.enum(['accept', 'decline']),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`friend-request:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000).toString() },
    });
  }

  const { id: requestId } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = patchSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { action } = result.data;

  const [req] = await db
    .select()
    .from(friendRequests)
    .where(and(eq(friendRequests.id, requestId), eq(friendRequests.receiverId, userId)))
    .limit(1);

  if (!req) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  if (req.status !== 'pending') {
    return NextResponse.json({ error: 'Request already handled' }, { status: 409 });
  }

  if (action === 'accept') {
    const [low, high] = sortFriendPair(userId, req.senderId);

    try {
      await db.transaction(async (tx) => {
        // Check caps inside transaction to prevent concurrent accepts exceeding the limit
        if (await isFriendCapReached(userId) || await isFriendCapReached(req.senderId)) {
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
        return NextResponse.json({ error: 'Friends list full (max 50)' }, { status: 409 });
      }
      throw err;
    }

    return NextResponse.json({ status: 'accepted' });
  }

  await db
    .update(friendRequests)
    .set({ status: 'declined', updatedAt: new Date() })
    .where(eq(friendRequests.id, requestId));

  return NextResponse.json({ status: 'declined' });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: requestId } = await params;

  const [req] = await db
    .select()
    .from(friendRequests)
    .where(and(eq(friendRequests.id, requestId), eq(friendRequests.senderId, userId)))
    .limit(1);

  if (!req) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  if (req.status !== 'pending') {
    return NextResponse.json({ error: 'Cannot cancel non-pending request' }, { status: 409 });
  }

  await db.delete(friendRequests).where(eq(friendRequests.id, requestId));

  return NextResponse.json({ status: 'cancelled' });
}
