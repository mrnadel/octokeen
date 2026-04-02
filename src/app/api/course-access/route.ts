import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth-utils';
import { getUserCourseAccess } from '@/lib/access-control';
import { PROFESSION_ID } from '@/data/professions';

// GET: Returns the list of gated course IDs the current user has access to
export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Admin has access to everything
  const adminId = process.env.ADMIN_USER_ID;
  if (adminId && userId === adminId) {
    return NextResponse.json({ courseAccess: [PROFESSION_ID.MECHANICAL_ENGINEERING] });
  }

  const access = await getUserCourseAccess(userId);
  return NextResponse.json({ courseAccess: access });
}
