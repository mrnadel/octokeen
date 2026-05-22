import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseUnits } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

const createUnitSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).default(''),
  color: z.string().max(50).default(''),
  icon: z.string().max(100).default(''),
  orderIndex: z.number().int().min(0),
});

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

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createUnitSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { title, description, color, icon, orderIndex } = parsed.data;

  const [unit] = await db
    .insert(courseUnits)
    .values({ title, description, color, icon, orderIndex })
    .returning();

  return NextResponse.json({ unit }, { status: 201 });
}
