import { eq, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseLessons } from '@/lib/db/schema';
import { withAdminAuth, jsonOk, jsonError } from '@/lib/api-helpers';
import { contentManagedError } from '@/lib/api/content-managed-response';

export const GET = withAdminAuth(async (req) => {
  const unitId = req.nextUrl.searchParams.get('unitId');

  if (!unitId) {
    return jsonError('unitId query parameter is required', 400);
  }

  const lessons = await db
    .select()
    .from(courseLessons)
    .where(eq(courseLessons.unitId, unitId))
    .orderBy(asc(courseLessons.orderIndex));

  return jsonOk({ lessons });
});

export async function POST() {
  return contentManagedError();
}
