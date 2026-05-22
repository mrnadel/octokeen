import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users, userProgress, subscriptions, courseAccess } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';
import { eq, desc, inArray } from 'drizzle-orm';
import { cleanupBeforeBulkDeletion } from '@/lib/account-cleanup';

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

export async function GET() {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

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

  return NextResponse.json({ users: result, total: result.length });
}

// PATCH: Update a user's subscription tier
export async function PATCH(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const patchResult = patchUserSchema.safeParse(rawBody);
  if (!patchResult.success) {
    return NextResponse.json({ error: 'Invalid userId or tier' }, { status: 400 });
  }
  const { userId, tier } = patchResult.data;

  // If setting to free, delete the subscription row
  if (tier === 'free') {
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    return NextResponse.json({ success: true, tier: 'free' });
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

  return NextResponse.json({ success: true, tier });
}

// DELETE: Remove a user and all related data
export async function DELETE(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let rawDelBody: unknown;
  try {
    rawDelBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const deleteResult = deleteUserSchema.safeParse(rawDelBody);
  if (!deleteResult.success) {
    return NextResponse.json({ error: 'Invalid userId or userIds' }, { status: 400 });
  }

  // Support both single userId and bulk userIds
  const { userId, userIds } = deleteResult.data;
  const idsToDelete: string[] = userIds && Array.isArray(userIds) && userIds.length > 0
    ? userIds
    : userId
      ? [userId]
      : [];

  // Prevent deleting yourself
  if (idsToDelete.includes(adminId)) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  // Cancel Paddle subscriptions, archive payments, delete Mixpanel profiles
  await cleanupBeforeBulkDeletion(idsToDelete);

  // All related tables have onDelete: 'cascade'
  await db.delete(users).where(inArray(users.id, idsToDelete));

  return NextResponse.json({ success: true, deleted: idsToDelete.length });
}
