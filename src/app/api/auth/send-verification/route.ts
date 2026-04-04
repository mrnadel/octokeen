import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, emailVerificationTokens } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';

const TOKEN_EXPIRY_MS = 24 * 60 * 60_000; // 24 hours

export async function POST() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`verify-email:${userId}`, { limit: 3, windowMs: 5 * 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please wait a few minutes.' }, { status: 429 });
  }

  const [user] = await db
    .select({ id: users.id, email: users.email, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.email) {
    return NextResponse.json({ error: 'No email found' }, { status: 400 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ message: 'Email already verified' });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

  await db.insert(emailVerificationTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/verify-email?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Verify your Octokeen email',
    html: `
      <h2>Verify your email</h2>
      <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>If you didn't create an Octokeen account, you can safely ignore this email.</p>
    `,
  });

  return NextResponse.json({ message: 'Verification email sent' });
}
