import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, passwordResetTokens } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';
import { emailSchema } from '@/lib/api-schemas';
import { generateToken, hashToken, getBaseUrl } from '@/lib/auth-tokens';

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const TOKEN_EXPIRY_MS = 15 * 60_000; // 15 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const rl = rateLimit(`forgot-pw:${ip}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000).toString() } }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();

  // Always return success to prevent account enumeration
  const successResponse = NextResponse.json({
    message: 'If an account exists with that email, a reset link has been sent.',
  });

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // No user found, or user has no password (Google-only account)
  if (!user || !user.passwordHash) return successResponse;

  // Generate a secure random token
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  // Build reset URL
  const resetUrl = `${getBaseUrl()}/reset-password?token=${rawToken}`;

  await sendEmail({
    to: email,
    subject: 'Reset your Octokeen password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });

  return successResponse;
}
