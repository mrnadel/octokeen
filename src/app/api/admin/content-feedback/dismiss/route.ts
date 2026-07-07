import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contentFeedbackDismissals } from '@/lib/db/schema';
import { withAdminAuth, parseBody, jsonOk } from '@/lib/api-helpers';

const dismissSchema = z.object({
  contentType: z.string().min(1).max(50),
  contentId: z.string().min(1).max(100),
});

export const POST = withAdminAuth(async (req) => {
  const { data, error } = await parseBody(req, dismissSchema);
  if (error) return error;

  const { contentType, contentId } = data;

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

  return jsonOk({ ok: true });
});
