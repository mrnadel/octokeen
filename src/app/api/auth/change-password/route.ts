import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { changePasswordSchema, getValidationError } from '@/lib/validation';
import { hashPassword, verifyPassword } from '@/lib/api/passwords';
import { jsonOk, jsonError, rateLimited, TOO_MANY_REQUESTS_RETRY } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';

export const POST = withAuth(async (request, { userId }) => {
  // Rate limit by user ID
  const rl = rateLimit(`change-password:${userId}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return rateLimited(rl.resetAt, TOO_MANY_REQUESTS_RETRY);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON', 400);
  }
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(getValidationError(parsed) ?? 'Invalid input', 400);
  }

  const { currentPassword, newPassword } = parsed.data;

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user || !user.passwordHash) {
    return jsonError('Password change not available for this account', 400);
  }

  const isValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isValid) {
    return jsonError('Current password is incorrect', 400);
  }

  const newHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return jsonOk({ ok: true });
});
