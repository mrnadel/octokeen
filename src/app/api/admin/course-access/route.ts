import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseAccess } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

// POST: Grant course access to a user
// DELETE: Revoke course access from a user
// Both expect { userId: string, professionId: string }

const courseAccessSchema = z.object({
  userId: z.string().min(1),
  professionId: z.string().min(1),
});

export async function POST(req: NextRequest) {
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

  const postResult = courseAccessSchema.safeParse(rawBody);
  if (!postResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { userId, professionId } = postResult.data;

  // Upsert: insert if not exists
  await db
    .insert(courseAccess)
    .values({ userId, professionId })
    .onConflictDoNothing();

  return NextResponse.json({ success: true, granted: true });
}

export async function DELETE(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let rawBody2: unknown;
  try {
    rawBody2 = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const deleteResult = courseAccessSchema.safeParse(rawBody2);
  if (!deleteResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { userId, professionId } = deleteResult.data;

  await db
    .delete(courseAccess)
    .where(and(eq(courseAccess.userId, userId), eq(courseAccess.professionId, professionId)));

  return NextResponse.json({ success: true, granted: false });
}
