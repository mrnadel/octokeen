import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseUnits } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

const updateUnitSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  color: z.string().max(50).optional(),
  icon: z.string().max(100).optional(),
  orderIndex: z.number().int().min(0).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No valid fields to update' });

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = updateUnitSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const allowedFields = parsed.data;

  const [updated] = await db
    .update(courseUnits)
    .set({ ...allowedFields, updatedAt: new Date() })
    .where(eq(courseUnits.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
  }

  return NextResponse.json({ unit: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  // Schema has onDelete: cascade on courseLessons.unitId and courseQuestions.lessonId,
  // so deleting the unit automatically cascades to lessons and questions.
  const [deleted] = await db
    .delete(courseUnits)
    .where(eq(courseUnits.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
