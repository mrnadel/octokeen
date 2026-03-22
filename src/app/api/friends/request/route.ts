import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { friendRequests, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  areFriends,
  getExistingRequest,
  isFriendCapReached,
} from '@/lib/db/friends';

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { receiverId } = body;

  if (!receiverId || typeof receiverId !== 'string') {
    return NextResponse.json({ error: 'receiverId is required' }, { status: 400 });
  }

  if (receiverId === userId) {
    return NextResponse.json({ error: 'Cannot send request to yourself' }, { status: 400 });
  }

  const [receiver] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, receiverId))
    .limit(1);

  if (!receiver) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (await areFriends(userId, receiverId)) {
    return NextResponse.json({ error: 'Already friends' }, { status: 409 });
  }

  if (await isFriendCapReached(userId)) {
    return NextResponse.json({ error: 'Friends list full (max 50)' }, { status: 409 });
  }

  const existing = await getExistingRequest(userId, receiverId);
  if (existing) {
    if (existing.status === 'pending') {
      return NextResponse.json({ error: 'Request already exists' }, { status: 409 });
    }
    if (existing.status === 'declined') {
      const updatedAt = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (updatedAt > sevenDaysAgo) {
        return NextResponse.json({ error: 'Cannot re-send yet, please wait' }, { status: 429 });
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

  return NextResponse.json({ request: newRequest }, { status: 201 });
}
