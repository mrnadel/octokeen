import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { gameConfig } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';
import { and, eq } from 'drizzle-orm';

const patchSchema = z.object({
  category: z.string().min(1),
  value: z.unknown().refine(v => v !== null && v !== undefined, { message: 'value must not be null' }),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { key } = await params;

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { category, value } = parsed.data;

  try {
    // Fetch the existing config to check min/max constraints
    const [existing] = await db
      .select()
      .from(gameConfig)
      .where(and(eq(gameConfig.category, category), eq(gameConfig.key, key)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Config key not found' }, { status: 404 });
    }

    // Validate numeric value against min/max range
    const parsedValue = typeof value === 'number' ? value : parseFloat(String(value));
    if (!isNaN(parsedValue)) {
      if (existing.minValue !== null && parsedValue < existing.minValue) {
        return NextResponse.json({ error: `Value must be >= ${existing.minValue}` }, { status: 400 });
      }
      if (existing.maxValue !== null && parsedValue > existing.maxValue) {
        return NextResponse.json({ error: `Value must be <= ${existing.maxValue}` }, { status: 400 });
      }
    }

    const result = await db
      .update(gameConfig)
      .set({
        value,
        lastModifiedBy: adminId,
        lastModifiedAt: new Date(),
      })
      .where(and(eq(gameConfig.category, category), eq(gameConfig.key, key)))
      .returning({ id: gameConfig.id });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
