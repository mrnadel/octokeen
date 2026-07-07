import { z } from 'zod';
import { db } from '@/lib/db';
import { gameConfig } from '@/lib/db/schema';
import { withAdminAuth, parseBody, jsonOk, jsonError } from '@/lib/api-helpers';
import { asc, eq, and } from 'drizzle-orm';

const upsertSchema = z.object({
  category: z.string().min(1),
  key: z.string().min(1),
  value: z.unknown().refine(v => v !== null && v !== undefined, { message: 'value must not be null' }),
  description: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  isLocked: z.boolean().optional(),
});

export const GET = withAdminAuth(async () => {
  try {
    const rows = await db
      .select()
      .from(gameConfig)
      .orderBy(asc(gameConfig.category), asc(gameConfig.key));

    return jsonOk({ configs: rows });
  } catch {
    // Table may not exist yet in DB — return empty gracefully
    return jsonOk({ configs: [] });
  }
});

export const POST = withAdminAuth(async (req, { adminId }) => {
  const { data, error } = await parseBody(req, upsertSchema);
  if (error) return error;

  const { category, key, value, description, minValue, maxValue, isLocked } = data;

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

    return jsonOk({ success: true });
  } catch {
    return jsonError('Database error', 500);
  }
});
