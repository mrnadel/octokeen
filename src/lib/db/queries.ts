// ============================================================
// Shared Database Queries — Octokeen
// Common single-table lookups used across multiple API routes.
// ============================================================

import { eq, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  users,
  userProgress,
  subscriptions,
  friendships,
} from '@/lib/db/schema';

// ─── User Lookups ──────────────────────────────────────────────

/** Fetch a single user by ID. Returns undefined if not found. */
export async function getUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user;
}

/** Fetch user progress for a given user. Returns undefined if no row exists. */
export async function getUserProgress(userId: string) {
  const [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  return progress;
}

/** Fetch subscription for a given user. Returns undefined if no row exists. */
export async function getSubscription(userId: string) {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return sub;
}

/** Fields accepted when writing a subscription row. */
export type SubscriptionUpsert = Partial<Omit<typeof subscriptions.$inferInsert, 'userId'>>;

/**
 * Insert or update the single subscription row for a user, stamping `updatedAt`.
 * Missing `tier`/`status` default to a free, active row on insert.
 */
export async function upsertSubscription(
  userId: string,
  data: SubscriptionUpsert,
): Promise<void> {
  const updatedAt = new Date();

  const [existing] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (existing) {
    await db
      .update(subscriptions)
      .set({ ...data, updatedAt })
      .where(eq(subscriptions.userId, userId));
    return;
  }

  await db.insert(subscriptions).values({
    userId,
    tier: data.tier ?? 'free',
    status: data.status ?? 'active',
    ...data,
    updatedAt,
  });
}

// ─── Friends ───────────────────────────────────────────────────

/**
 * Extract all friend user IDs for a given user.
 * Handles the friendships table constraint (user_id < friend_id)
 * by checking both columns.
 */
export async function getFriendIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ usrId: friendships.userId, frnId: friendships.friendId })
    .from(friendships)
    .where(or(eq(friendships.userId, userId), eq(friendships.friendId, userId)));

  return rows.map((r) => (r.usrId === userId ? r.frnId : r.usrId));
}
