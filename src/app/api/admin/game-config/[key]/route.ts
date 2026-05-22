import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { gameConfig } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';
import { and, eq } from 'drizzle-orm';

const patchSchema = z.object({
  category: z.string().min(1),
  value: z.unknown(),
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
    const result = await db
      .update(gameConfig)
      .set({
        value,
        lastModifiedBy: adminId,
        lastModifiedAt: new Date(),
      })
      .where(and(eq(gameConfig.category, category), eq(gameConfig.key, key)))
      .returning({ id: gameConfig.id });

    if (result.length === 0) {
      return NextResponse.json({ error: 'Config key not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
