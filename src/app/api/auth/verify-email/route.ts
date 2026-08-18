import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { jsonError, getClientIp, INVALID_REQUEST } from '@/lib/api-helpers';
import { hashToken, validateToken, markTokenUsed } from '@/lib/auth-tokens';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rl = rateLimit(`verify:${getClientIp(request)}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return jsonError('Too many requests.', 429);
  }

  let token: string;
  try {
    const body = await request.json();
    token = body.token;
  } catch {
    return jsonError(INVALID_REQUEST, 400);
  }

  if (!token) {
    return jsonError('Token is required', 400);
  }

  const tokenHash = hashToken(token);

  // Find valid, unused, non-expired token
  const verifyToken = await validateToken('emailVerification', tokenHash);

  if (!verifyToken) {
    return jsonError('This verification link is invalid or has expired.', 400);
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
