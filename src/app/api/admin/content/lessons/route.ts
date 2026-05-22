import { NextRequest, NextResponse } from 'next/server';
import { eq, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseLessons } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

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

export async function POST() {
  return NextResponse.json(
    { error: 'Content is managed via TypeScript source files. Edit src/data/course/ and run npm run seed-content.' },
    { status: 405 }
  );
}
