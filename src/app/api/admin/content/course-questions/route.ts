import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseQuestions } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

const createQuestionSchema = z.object({
  lessonId: z.string().min(1),
  type: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctIndex: z.number().int().min(0).optional(),
  correctAnswer: z.string().optional(),
  acceptedAnswers: z.array(z.string()).optional(),
  blanks: z.array(z.string()).optional(),
  wordBank: z.array(z.string()).optional(),
  explanation: z.string().default(''),
  hint: z.string().optional(),
  diagram: z.string().optional(),
  orderIndex: z.number().int().min(0),
});

export async function GET(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const lessonId = req.nextUrl.searchParams.get('lessonId');

  if (!lessonId) {
    return NextResponse.json(
      { error: 'lessonId query parameter is required' },
      { status: 400 }
    );
  }

  const questions = await db
    .select()
    .from(courseQuestions)
    .where(eq(courseQuestions.lessonId, lessonId))
    .orderBy(asc(courseQuestions.orderIndex));

  return NextResponse.json({ questions });
}

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

  const parsed = createQuestionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const {
    lessonId,
    type,
    question,
    options,
    correctIndex,
    correctAnswer,
    acceptedAnswers,
    blanks,
    wordBank,
    explanation,
    hint,
    diagram,
    orderIndex,
  } = parsed.data;

  const [created] = await db
    .insert(courseQuestions)
    .values({
      lessonId,
      type,
      question,
      options,
      correctIndex,
      correctAnswer,
      acceptedAnswers,
      blanks,
      wordBank,
      explanation,
      hint,
      diagram,
      orderIndex,
    })
    .returning();

  return NextResponse.json({ question: created }, { status: 201 });
}
