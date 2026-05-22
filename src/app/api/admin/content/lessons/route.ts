import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseLessons } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

const createLessonSchema = z.object({
  unitId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).default(''),
  icon: z.string().max(100).default(''),
  xpReward: z.number().int().min(0).optional(),
  orderIndex: z.number().int().min(0),
});

export async function GET(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const unitId = req.nextUrl.searchParams.get('unitId');

  if (!unitId) {
    return NextResponse.json(
      { error: 'unitId query parameter is required' },
      { status: 400 }
    );
  }

  const lessons = await db
    .select()
    .from(courseLessons)
    .where(eq(courseLessons.unitId, unitId))
    .orderBy(asc(courseLessons.orderIndex));

  return NextResponse.json({ lessons });
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

  const parsed = createLessonSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { unitId, title, description, icon, xpReward, orderIndex } = parsed.data;

  const [lesson] = await db
    .insert(courseLessons)
    .values({ unitId, title, description, icon, xpReward, orderIndex })
    .returning();

  return NextResponse.json({ lesson }, { status: 201 });
}
