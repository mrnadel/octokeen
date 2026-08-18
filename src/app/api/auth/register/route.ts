import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { registerSchema, getValidationError } from '@/lib/validation';
import { logger } from '@/lib/logger';
import {
  jsonOk,
  jsonError,
  getClientIp,
  rateLimited,
  TOO_MANY_REQUESTS_RETRY,
} from '@/lib/api-helpers';
import { getUtcToday } from '@/lib/server-dates';
import { hashPassword } from '@/lib/api/passwords';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limit by IP
    const rl = rateLimit(`register:${getClientIp(request)}`, RATE_LIMITS.auth);
    if (!rl.success) {
      return rateLimited(rl.resetAt, TOO_MANY_REQUESTS_RETRY);
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(getValidationError(parsed) ?? 'Invalid input', 400);
    }

    const { email, password, displayName } = parsed.data;

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      // Use generic message to prevent account enumeration
      return jsonError('Unable to create account. Please try a different email or sign in.', 409);
    }

    const passwordHash = await hashPassword(password);
    const joinedDate = getUtcToday();

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        displayName,
        name: displayName,
        joinedDate,
      })
      .returning({ id: users.id, email: users.email, displayName: users.displayName });

    // Email verification disabled — uncomment when email provider is configured
    // When re-enabling, use generateToken() + hashToken() from '@/lib/auth-tokens'
    // and getBaseUrl() for the verification URL.

    return jsonOk(
      { user: { id: newUser.id, email: newUser.email, displayName: newUser.displayName } },
      { status: 201 },
    );
  } catch (error) {
    logger.error('Registration error:', error);
    return jsonError('Internal server error', 500);
  }
}
