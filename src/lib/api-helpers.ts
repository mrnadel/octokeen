// ============================================================
// Shared API Route Helpers — Octokeen
// Reduces boilerplate for auth checks, body parsing, and responses.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUserId, requireAdmin } from '@/lib/auth-utils';

// ─── Response Helpers ──────────────────────────────────────────

/** Shorthand for a successful JSON response. */
export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

/** Shorthand for a JSON error response. */
export function jsonError(error: string, status: number): NextResponse {
  return NextResponse.json({ error }, { status });
}

// ─── Body Parsing ──────────────────────────────────────────────

/**
 * Safely parse and validate a JSON request body against a Zod schema.
 * Returns `{ data }` on success or `{ error }` (a ready-to-return NextResponse) on failure.
 */
export async function parseBody<T>(
  req: NextRequest,
  schema: z.ZodType<T>,
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { error: jsonError('Invalid JSON', 400) };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues[0]?.message },
        { status: 400 },
      ),
    };
  }

  return { data: parsed.data };
}

// ─── Auth Wrappers ─────────────────────────────────────────────

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
