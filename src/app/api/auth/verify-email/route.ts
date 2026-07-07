import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { hashToken, validateToken, markTokenUsed } from '@/lib/auth-tokens';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const rl = rateLimit(`verify:${ip}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  let token: string;
  try {
    const body = await request.json();
    token = body.token;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const tokenHash = hashToken(token);

  // Find valid, unused, non-expired token
  const verifyToken = await validateToken('emailVerification', tokenHash);

  if (!verifyToken) {
    return NextResponse.json(
      { error: 'This verification link is invalid or has expired.' },
      { status: 400 }
    );
  }

  // Mark email as verified
  await db
    .update(users)
    .set({ emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.id, verifyToken.userId));

  // Mark token as used
  await markTokenUsed('emailVerification', verifyToken.id);

  return NextResponse.json({ message: 'Email verified successfully.' });
}
