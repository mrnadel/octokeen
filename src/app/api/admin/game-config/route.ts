import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { gameConfig } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';
import { asc, eq, and } from 'drizzle-orm';

const upsertSchema = z.object({
  category: z.string().min(1),
  key: z.string().min(1),
  value: z.unknown(),
  description: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  isLocked: z.boolean().optional(),
});

export async function GET() {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const rows = await db
      .select()
      .from(gameConfig)
      .orderBy(asc(gameConfig.category), asc(gameConfig.key));

    return NextResponse.json({ configs: rows });
  } catch {
    // Table may not exist yet in DB — return empty gracefully
    return NextResponse.json({ configs: [] });
  }
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

  const parsed = upsertSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { category, key, value, description, minValue, maxValue, isLocked } = parsed.data;

  try {
    const [existing] = await db
      .select({ id: gameConfig.id })
      .from(gameConfig)
      .where(and(eq(gameConfig.category, category), eq(gameConfig.key, key)))
      .limit(1);

    if (existing) {
      await db
        .update(gameConfig)
        .set({
          value,
          description,
          minValue,
          maxValue,
          isLocked: isLocked ?? false,
          lastModifiedBy: adminId,
          lastModifiedAt: new Date(),
        })
        .where(eq(gameConfig.id, existing.id));
    } else {
      await db.insert(gameConfig).values({
        category,
        key,
        value,
        description,
        minValue,
        maxValue,
        isLocked: isLocked ?? false,
        lastModifiedBy: adminId,
        lastModifiedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
