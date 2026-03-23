import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users, friendships } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { areFriends, sortFriendPair, countFriends } from '@/lib/db/friends';
import { rateLimit } from '@/lib/rate-limit';

const MAX_FRIENDS = 50;

export async function POST() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`invite-accept:${userId}`, { limit: 5, windowMs: 3600_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const cookieStore = await cookies();
  const inviterId = cookieStore.get('invite_ref')?.value;

  if (!inviterId) {
    return NextResponse.json({ error: 'No invite found' }, { status: 400 });
  }

  cookieStore.delete('invite_ref');

  const [inviter] = await db
    .select({ id: users.id, displayName: users.displayName })
    .from(users)
    .where(eq(users.id, inviterId))
    .limit(1);

  if (!inviter) {
    return NextResponse.json({ error: 'Inviter not found' }, { status: 404 });
  }

  if (inviterId === userId) {
    return NextResponse.json({ error: 'Cannot add yourself' }, { status: 400 });
  }

  if (await areFriends(userId, inviterId)) {
    return NextResponse.json({ already: true, name: inviter.displayName });
  }

  const [userCount, inviterCount] = await Promise.all([
    countFriends(userId),
    countFriends(inviterId),
  ]);

  if (userCount >= MAX_FRIENDS) {
    return NextResponse.json({ error: 'Your friends list is full' }, { status: 409 });
  }
  if (inviterCount >= MAX_FRIENDS) {
    return NextResponse.json({ error: "Inviter's friends list is full" }, { status: 409 });
  }

  const [low, high] = sortFriendPair(userId, inviterId);
  try {
    await db.insert(friendships).values({ userId: low, friendId: high });
  } catch (err: any) {
    if (err?.code === '23505') {
      return NextResponse.json({ already: true, name: inviter.displayName });
    }
    throw err;
  }

  return NextResponse.json({ success: true, name: inviter.displayName });
}
