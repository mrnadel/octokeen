import { db } from '@/lib/db';
import { friendRequests, users, userProgress } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { withAuth, jsonOk } from '@/lib/api-helpers';

export const GET = withAuth(async (_req, { userId }) => {
  const [incoming, outgoing] = await Promise.all([
    db
      .select({
        id: friendRequests.id,
        senderId: friendRequests.senderId,
        createdAt: friendRequests.createdAt,
        senderName: users.displayName,
        senderImage: users.image,
        senderLevel: userProgress.currentLevel,
      })
      .from(friendRequests)
      .leftJoin(users, eq(friendRequests.senderId, users.id))
      .leftJoin(userProgress, eq(friendRequests.senderId, userProgress.userId))
      .where(and(eq(friendRequests.receiverId, userId), eq(friendRequests.status, 'pending'))),
    db
      .select({
        id: friendRequests.id,
        receiverId: friendRequests.receiverId,
        createdAt: friendRequests.createdAt,
        receiverName: users.displayName,
        receiverImage: users.image,
        receiverLevel: userProgress.currentLevel,
      })
      .from(friendRequests)
      .leftJoin(users, eq(friendRequests.receiverId, users.id))
      .leftJoin(userProgress, eq(friendRequests.receiverId, userProgress.userId))
      .where(and(eq(friendRequests.senderId, userId), eq(friendRequests.status, 'pending'))),
  ]);

  return jsonOk({ incoming, outgoing });
});
