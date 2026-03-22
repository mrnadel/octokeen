import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users, userProgress, friendRequests } from '@/lib/db/schema';
import { eq, ilike, ne, sql, and, notInArray, type SQL } from 'drizzle-orm';
import { rateLimit } from '@/lib/rate-limit';

function escapeIlike(input: string): string {
  return input.replace(/[%_\\]/g, '\\$&');
}

export async function GET(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`user-search:${userId}`, { limit: 30, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ users: [] });
  }

  // Get IDs of users who have declined this user's requests (within 7 day cooldown)
  const declinedByUsers = await db
    .select({ receiverId: friendRequests.receiverId })
    .from(friendRequests)
    .where(
      and(
        eq(friendRequests.senderId, userId),
        eq(friendRequests.status, 'declined'),
        sql`${friendRequests.updatedAt} > NOW() - INTERVAL '7 days'`
      )
    );
  const declinedIds = declinedByUsers.map((r) => r.receiverId);

  // Build conditions array (avoids passing undefined to and())
  const conditions: SQL[] = [
    ilike(users.displayName, `%${escapeIlike(query)}%`),
    ne(users.id, userId),
  ];
  if (declinedIds.length > 0) {
    conditions.push(notInArray(users.id, declinedIds));
  }

  // Search users by display name
  const results = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      image: users.image,
      level: userProgress.currentLevel,
    })
    .from(users)
    .leftJoin(userProgress, eq(users.id, userProgress.userId))
    .where(and(...conditions))
    .limit(10);

  const safeResults = results.map((u) => ({
    ...u,
    displayName: u.displayName ?? 'Unknown',
    level: u.level ?? 1,
  }));

  return NextResponse.json({ users: safeResults });
}
