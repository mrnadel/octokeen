// ============================================================
// Route Auth Guards — Octokeen
// Kept separate from api-helpers so response/parsing helpers can be
// imported without pulling in the NextAuth stack.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId, requireAdmin } from '@/lib/auth-utils';
import { jsonError } from '@/lib/api-helpers';

type AuthContext = { userId: string };
type AuthHandler = (req: NextRequest, ctx: AuthContext) => Promise<NextResponse>;

/**
 * Wraps an API route handler with authentication.
 * Extracts the current user ID via `getAuthUserId()`.
 * Returns 401 automatically if the user is not authenticated.
 */
export function withAuth(handler: AuthHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const userId = await getAuthUserId();
    if (!userId) {
      return jsonError('Unauthorized', 401);
    }
    return handler(req, { userId });
  };
}

type AdminContext = { adminId: string };
type AdminHandler = (req: NextRequest, ctx: AdminContext) => Promise<NextResponse>;

/**
 * Wraps an API route handler with admin authentication.
 * Verifies the current user is an admin via `requireAdmin()`.
 * Returns 403 automatically if not.
 */
export function withAdminAuth(handler: AdminHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const adminId = await requireAdmin();
    if (!adminId) {
      return jsonError('Forbidden', 403);
    }
    return handler(req, { adminId });
  };
}

type CronHandler = (req: NextRequest) => Promise<NextResponse>;

/**
 * Wraps an API route handler with CRON_SECRET Bearer token authentication.
 * Used by Vercel Cron Jobs. Returns 500 if CRON_SECRET is not configured,
 * or 401 if the Bearer token does not match.
 */
export function withCronAuth(handler: CronHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return jsonError('Server misconfigured', 500);
    }

    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return jsonError('Unauthorized', 401);
    }

    return handler(req);
  };
}
