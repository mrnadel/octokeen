import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users, userProgress, subscriptions, courseAccess } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';
import { eq, desc, inArray } from 'drizzle-orm';
import { cleanupBeforeBulkDeletion } from '@/lib/account-cleanup';
import { withAdminAuth, parseBody, jsonOk, jsonError } from '@/lib/api-helpers';

const patchUserSchema = z.object({
  userId: z.string().min(1),
  tier: z.enum(['free', 'pro']),
});

const deleteUserSchema = z.object({
  userId: z.string().min(1).optional(),
  userIds: z.array(z.string().min(1)).min(1).optional(),
}).refine(d => d.userId || (d.userIds && d.userIds.length > 0), {
  message: 'userId or userIds required',
});

export async function HEAD() {
  const adminId = await requireAdmin();
  if (!adminId) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, { status: 200 });
}

export const GET = withAdminAuth(async () => {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      displayName: users.displayName,
      joinedDate: users.joinedDate,
      createdAt: users.createdAt,
      totalXp: userProgress.totalXp,
      currentStreak: userProgress.currentStreak,
      totalQuestionsAttempted: userProgress.totalQuestionsAttempted,
      lastActiveDate: userProgress.lastActiveDate,
      tier: subscriptions.tier,
    })
    .from(users)
    .leftJoin(userProgress, eq(users.id, userProgress.userId))
    .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
    .orderBy(desc(users.createdAt));

  // Fetch all course access grants in one query
  const accessRows = await db
    .select({ userId: courseAccess.userId, professionId: courseAccess.professionId })
    .from(courseAccess);

  const accessMap = new Map<string, string[]>();
  for (const row of accessRows) {
    const existing = accessMap.get(row.userId) ?? [];
    existing.push(row.professionId);
    accessMap.set(row.userId, existing);
  }

  const result = rows.map((row) => ({
    id: row.id,
    name: row.displayName || row.name || null,
    email: row.email,
    joinedDate: row.joinedDate || row.createdAt?.toISOString() || null,
    totalXp: row.totalXp ?? 0,
    currentStreak: row.currentStreak ?? 0,
    totalQuestionsAttempted: row.totalQuestionsAttempted ?? 0,
    lastActiveDate: row.lastActiveDate || null,
    tier: row.tier || 'free',
    courseAccess: accessMap.get(row.id) ?? [],
  }));

  return jsonOk({ users: result, total: result.length });
});

// PATCH: Update a user's subscription tier
export const PATCH = withAdminAuth(async (req) => {
  const { data, error } = await parseBody(req, patchUserSchema);
  if (error) return error;

  const { userId, tier } = data;

  // If setting to free, delete the subscription row
  if (tier === 'free') {
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    return jsonOk({ success: true, tier: 'free' });
  }

  // Upsert: check if subscription exists
  const [existing] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (existing) {
    await db
      .update(subscriptions)
      .set({ tier, status: 'active', updatedAt: new Date() })
      .where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values({
      userId,
      tier,
      status: 'active',
    });
  }

  return jsonOk({ success: true, tier });
});

// DELETE: Remove a user and all related data
export const DELETE = withAdminAuth(async (req, { adminId }) => {
  const { data, error } = await parseBody(req, deleteUserSchema);
  if (error) return error;

  // Support both single userId and bulk userIds
  const { userId, userIds } = data;
  const idsToDelete: string[] = userIds && Array.isArray(userIds) && userIds.length > 0
    ? userIds
    : userId
      ? [userId]
      : [];

  // Prevent deleting yourself
  if (idsToDelete.includes(adminId)) {
    return jsonError('Cannot delete your own account', 400);
  }

  // Cancel Paddle subscriptions, archive payments, delete Mixpanel profiles
  await cleanupBeforeBulkDeletion(idsToDelete);

  // All related tables have onDelete: 'cascade'
  await db.delete(users).where(inArray(users.id, idsToDelete));

  return jsonOk({ success: true, deleted: idsToDelete.length });
});
