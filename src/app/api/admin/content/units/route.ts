import { NextRequest, NextResponse } from 'next/server';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseUnits } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const units = await db
    .select()
    .from(courseUnits)
    .orderBy(asc(courseUnits.orderIndex));

  return NextResponse.json({ units });
}

export async function POST() {
  return NextResponse.json(
    { error: 'Content is managed via TypeScript source files. Edit src/data/course/ and run npm run seed-content.' },
    { status: 405 }
  );
}
