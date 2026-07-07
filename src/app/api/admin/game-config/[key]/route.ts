import { NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { gameConfig } from '@/lib/db/schema';
import { withAdminAuth, parseBody, jsonOk, jsonError } from '@/lib/api-helpers';
import { and, eq } from 'drizzle-orm';

const patchSchema = z.object({
  category: z.string().min(1),
  value: z.unknown().refine(v => v !== null && v !== undefined, { message: 'value must not be null' }),
});

export const PATCH = withAdminAuth(async (
  req: NextRequest & { __routeParams?: Promise<{ key: string }> },
  { adminId },
) => {
  // Next.js App Router passes route params as second argument to the raw handler,
  // but withAdminAuth wraps the handler so we need to extract from the URL instead.
  const key = req.nextUrl.pathname.split('/').pop()!;

  const { data, error } = await parseBody(req, patchSchema);
  if (error) return error;

  const { category, value } = data;

  try {
    // Fetch the existing config to check min/max constraints
    const [existing] = await db
      .select()
      .from(gameConfig)
      .where(and(eq(gameConfig.category, category), eq(gameConfig.key, key)))
      .limit(1);

    if (!existing) {
      return jsonError('Config key not found', 404);
    }

    // Validate numeric value against min/max range
    const parsedValue = typeof value === 'number' ? value : parseFloat(String(value));
    if (!isNaN(parsedValue)) {
      if (existing.minValue !== null && parsedValue < existing.minValue) {
        return jsonError(`Value must be >= ${existing.minValue}`, 400);
      }
      if (existing.maxValue !== null && parsedValue > existing.maxValue) {
        return jsonError(`Value must be <= ${existing.maxValue}`, 400);
      }
    }

    await db
      .update(gameConfig)
      .set({
        value,
        lastModifiedBy: adminId,
        lastModifiedAt: new Date(),
      })
      .where(and(eq(gameConfig.category, category), eq(gameConfig.key, key)));

    return jsonOk({ success: true });
  } catch {
    return jsonError('Database error', 500);
  }
});
