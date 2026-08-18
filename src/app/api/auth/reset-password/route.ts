import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';
import { passwordSchema, getValidationError } from '@/lib/validation';
import { jsonError, getClientIp, TOO_MANY_REQUESTS_RETRY, INVALID_REQUEST } from '@/lib/api-helpers';
import { hashToken, validateToken, markTokenUsed } from '@/lib/auth-tokens';
import { hashPassword } from '@/lib/api/passwords';

const resetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rl = rateLimit(`reset-pw:${getClientIp(request)}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return jsonError(TOO_MANY_REQUESTS_RETRY, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(INVALID_REQUEST, 400);
  }

  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(getValidationError(parsed) ?? 'Invalid input', 400);
  }

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);

  // Find valid, unused, non-expired token
  const resetToken = await validateToken('passwordReset', tokenHash);

  if (!resetToken) {
    return jsonError(
      'This reset link is invalid or has expired. Please request a new one.',
      400,
    );
  }

  // Hash new password and update user
  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, resetToken.userId));

  // Mark token as used
  await markTokenUsed('passwordReset', resetToken.id);

  return NextResponse.json({ message: 'Password reset successfully.' });
}
