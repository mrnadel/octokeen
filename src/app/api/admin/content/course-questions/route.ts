import { eq, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseQuestions } from '@/lib/db/schema';
import { jsonOk, jsonError } from '@/lib/api-helpers';
import { withAdminAuth } from '@/lib/api/guards';
import { contentManagedError } from '@/lib/api/content-managed-response';

export const GET = withAdminAuth(async (req) => {
  const lessonId = req.nextUrl.searchParams.get('lessonId');

  if (!lessonId) {
    return jsonError('lessonId query parameter is required', 400);
  }

  const questions = await db
    .select()
    .from(courseQuestions)
    .where(eq(courseQuestions.lessonId, lessonId))
    .orderBy(asc(courseQuestions.orderIndex));

  return jsonOk({ questions });
});

export async function POST() {
  return contentManagedError();
}
