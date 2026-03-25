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

export async function POST(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { title, description, color, icon, orderIndex } = body;

  const [unit] = await db
    .insert(courseUnits)
    .values({ title, description, color, icon, orderIndex })
    .returning();

  return NextResponse.json({ unit }, { status: 201 });
}
