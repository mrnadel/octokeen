import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseQuestions } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

const updateQuestionSchema = z.object({
  lessonId: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  question: z.string().min(1).optional(),
  options: z.array(z.string()).optional(),
  correctIndex: z.number().int().min(0).optional(),
  correctAnswer: z.string().optional(),
  acceptedAnswers: z.array(z.string()).optional(),
  blanks: z.array(z.string()).optional(),
  wordBank: z.array(z.string()).optional(),
  explanation: z.string().optional(),
  hint: z.string().optional(),
  diagram: z.string().optional(),
  orderIndex: z.number().int().min(0).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No valid fields to update' });

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = updateQuestionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const allowedFields = parsed.data;

  const [updated] = await db
    .update(courseQuestions)
    .set({ ...allowedFields, updatedAt: new Date() })
    .where(eq(courseQuestions.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  return NextResponse.json({ question: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  const [deleted] = await db
    .delete(courseQuestions)
    .where(eq(courseQuestions.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
