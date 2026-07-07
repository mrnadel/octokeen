import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseAccess } from '@/lib/db/schema';
import { withAdminAuth, parseBody, jsonOk } from '@/lib/api-helpers';

// POST: Grant course access to a user
// DELETE: Revoke course access from a user
// Both expect { userId: string, professionId: string }

const courseAccessSchema = z.object({
  userId: z.string().min(1),
  professionId: z.string().min(1),
});

export const POST = withAdminAuth(async (req) => {
  const { data, error } = await parseBody(req, courseAccessSchema);
  if (error) return error;

  const { userId, professionId } = data;

  // Upsert: insert if not exists
  await db
    .insert(courseAccess)
    .values({ userId, professionId })
    .onConflictDoNothing();

  return jsonOk({ success: true, granted: true });
});

export const DELETE = withAdminAuth(async (req) => {
  const { data, error } = await parseBody(req, courseAccessSchema);
  if (error) return error;

  const { userId, professionId } = data;

  await db
    .delete(courseAccess)
    .where(and(eq(courseAccess.userId, userId), eq(courseAccess.professionId, professionId)));

  return jsonOk({ success: true, granted: false });
});
