// This route is intentionally public (no auth required).
// It is called when a visitor lands on an invite link BEFORE they have signed in
// or created an account. The cookie is later consumed by the NextAuth signIn
// callback (src/lib/auth.ts) when they register/log in, or by the
// /api/invite/accept endpoint if they are already logged in.
// Requiring auth here would break the invite flow for new sign-ups.
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { jsonOk, jsonError, getClientIp, rateLimited } from '@/lib/api-helpers';
import { INVITE_REF_COOKIE, INVITE_REF_MAX_AGE_SECONDS } from '@/lib/api/cookies';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rl = rateLimit(`invite-set-cookie:${getClientIp(request)}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid body', 400);
  }

  const { code } = body;
  if (!code || typeof code !== 'string') {
    return jsonError('Code required', 400);
  }

  const [inviter] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.inviteCode, code))
    .limit(1);

  if (!inviter) {
    return jsonError('Invalid code', 404);
  }

  const cookieStore = await cookies();
  cookieStore.set(INVITE_REF_COOKIE, inviter.id, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: INVITE_REF_MAX_AGE_SECONDS,
  });

  return jsonOk({ success: true });
}
