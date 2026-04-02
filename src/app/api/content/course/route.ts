import { NextResponse } from 'next/server';
import { getCourseMetaForProfession, loadUnitData } from '@/data/course/course-meta';
import { PROFESSION_ID } from '@/data/professions';

// Course content is static TypeScript files baked into the deployment.
// No DB round-trip needed. Immutable until the next deploy.
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=31536000, immutable',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profession = searchParams.get('profession') || PROFESSION_ID.MECHANICAL_ENGINEERING;

  const meta = getCourseMetaForProfession(profession);
  const course = await Promise.all(
    meta.map((_, i) => loadUnitData(i, profession))
  );

  return NextResponse.json({ course }, { headers: CACHE_HEADERS });
}
