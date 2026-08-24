import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCourseMetaForProfession, loadUnitData } from '@/data/course/course-meta';
import { PROFESSION_ID } from '@/data/professions';
import { stripAnswerKeys } from '@/lib/strip-answer-keys';
import type { Question } from '@/data/types';

// Course content is static TypeScript files baked into the deployment.
// No DB round-trip needed. Serve privately so answer keys never reach CDN caches.
const CACHE_HEADERS = {
  'Cache-Control': 'private, max-age=300',
};

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const profession = searchParams.get('profession') || PROFESSION_ID.MECHANICAL_ENGINEERING;

  const meta = getCourseMetaForProfession(profession);
  const rawCourse = await Promise.all(
    meta.map((_, i) => loadUnitData(i, profession))
  );

  const course = rawCourse.map((unit) => ({
    ...unit,
    lessons: unit.lessons.map((lesson) => ({
      ...lesson,
      questions: (lesson.questions as unknown as Question[]).map(stripAnswerKeys),
    })),
  }));

  return NextResponse.json({ course }, { headers: CACHE_HEADERS });
}
