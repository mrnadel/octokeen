// ============================================================
// Shared Database Queries — Octokeen
// Common single-table lookups used across multiple API routes.
// ============================================================

import { eq, or, type SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  users,
  userProgress,
  subscriptions,
  friendships,
} from '@/lib/db/schema';
import type { PgTable } from 'drizzle-orm/pg-core';

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

// ─── Generic Upsert ────────────────────────────────────────────

/**
 * Generic select-then-insert-or-update pattern.
 *
 * Looks up existing rows matching `whereClause`. If a row exists, updates it
 * with `updateData`. Otherwise inserts `insertData`.
 *
 * Returns `{ existed: boolean }` to indicate which path was taken.
 *
 * @example
 * ```ts
 * await upsertRecord(
 *   userProgress,
 *   eq(userProgress.userId, userId),
 *   { userId, currentLevel: 1, totalXp: 0 },
 *   { currentLevel: 2, totalXp: 100, updatedAt: new Date() },
 * );
 * ```
 */
export async function upsertRecord<T extends PgTable>(
  table: T,
  whereClause: SQL,
  insertData: T['$inferInsert'],
  updateData: Partial<T['$inferInsert']>,
): Promise<{ existed: boolean }> {
  const existing = await (db.select() as any).from(table).where(whereClause).limit(1);

  if (existing.length > 0) {
    await (db.update(table) as any).set(updateData).where(whereClause);
    return { existed: true };
  }

  await (db.insert(table) as any).values(insertData);
  return { existed: false };
}
