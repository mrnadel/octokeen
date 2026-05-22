import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contentFeedbackDismissals } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';

const dismissSchema = z.object({
  contentType: z.string().min(1).max(50),
  contentId: z.string().min(1).max(100),
});

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

  const parsed = dismissSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { contentType, contentId } = parsed.data;

  // Upsert: delete + insert
  await db.transaction(async (tx) => {
    await tx
      .delete(contentFeedbackDismissals)
      .where(
        and(
          eq(contentFeedbackDismissals.contentType, contentType),
          eq(contentFeedbackDismissals.contentId, contentId)
        )
      );
    await tx.insert(contentFeedbackDismissals).values({
      contentType,
      contentId,
    });
  });

  return NextResponse.json({ ok: true });
}
