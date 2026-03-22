import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { friendRequests, friendships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sortFriendPair, isFriendCapReached } from '@/lib/db/friends';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: requestId } = await params;
  const body = await request.json();
  const { action } = body;

  if (action !== 'accept' && action !== 'decline') {
    return NextResponse.json({ error: 'action must be "accept" or "decline"' }, { status: 400 });
  }

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
    if (await isFriendCapReached(userId) || await isFriendCapReached(req.senderId)) {
      return NextResponse.json({ error: 'Friends list full (max 50)' }, { status: 409 });
    }

    const [low, high] = sortFriendPair(userId, req.senderId);
    await db.insert(friendships).values({ userId: low, friendId: high });

    await db
      .update(friendRequests)
      .set({ status: 'accepted', updatedAt: new Date() })
      .where(eq(friendRequests.id, requestId));

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
