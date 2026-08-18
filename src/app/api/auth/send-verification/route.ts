import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, emailVerificationTokens } from '@/lib/db/schema';
import { rateLimit } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';
import { jsonOk, jsonError } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { generateToken, hashToken, getBaseUrl } from '@/lib/auth-tokens';

const TOKEN_EXPIRY_MS = 24 * 60 * 60_000; // 24 hours

export const POST = withAuth(async (_req, { userId }) => {
  const rl = rateLimit(`verify-email:${userId}`, { limit: 3, windowMs: 5 * 60_000 });
  if (!rl.success) {
    return jsonError('Too many requests. Please wait a few minutes.', 429);
  }

  const [user] = await db
    .select({ id: users.id, email: users.email, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.email) {
    return jsonError('No email found', 400);
  }

  if (user.emailVerified) {
    return jsonOk({ message: 'Email already verified' });
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

  await db.insert(emailVerificationTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const verifyUrl = `${getBaseUrl()}/verify-email?token=${rawToken}`;

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

  return jsonOk({ message: 'Verification email sent' });
});
