import { NextResponse } from 'next/server';
import { getAuthUserId, isAdminUserId } from '@/lib/auth-utils';
import { getUserCourseAccess } from '@/lib/access-control';
import { jsonOk, jsonError } from '@/lib/api-helpers';
import { PROFESSION_ID } from '@/data/professions';

// GET: Returns the list of gated course IDs the current user has access to
export async function GET(): Promise<NextResponse> {
  const userId = await getAuthUserId();
  if (!userId) {
    return jsonError('Not authenticated', 401);
  }

  // Admin has access to everything
  if (isAdminUserId(userId)) {
    return jsonOk({ courseAccess: [PROFESSION_ID.MECHANICAL_ENGINEERING] });
  }

  const access = await getUserCourseAccess(userId);
  return jsonOk({ courseAccess: access });
}
