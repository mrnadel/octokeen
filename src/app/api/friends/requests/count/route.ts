import { db } from '@/lib/db';
import { friendRequests } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { jsonOk } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

export const GET = withAuth(async (_req, { userId }) => {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(friendRequests)
    .where(and(eq(friendRequests.receiverId, userId), eq(friendRequests.status, 'pending')));

  return jsonOk({ count: result?.count ?? 0 });
});
