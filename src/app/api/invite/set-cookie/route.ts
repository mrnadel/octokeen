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

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const rl = rateLimit(`invite-set-cookie:${ip}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000).toString() },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { code } = body;
  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const [inviter] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.inviteCode, code))
    .limit(1);

  if (!inviter) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
  }

  const cookieStore = await cookies();
  cookieStore.set('invite_ref', inviter.id, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ success: true });
}
