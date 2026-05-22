import { NextRequest, NextResponse } from 'next/server';
import { eq, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseQuestions } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

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

export async function POST() {
  return NextResponse.json(
    { error: 'Content is managed via TypeScript source files. Edit src/data/course/ and run npm run seed-content.' },
    { status: 405 }
  );
}
