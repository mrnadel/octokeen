import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, accounts } from '@/lib/db/schema';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { parseBody, jsonOk, jsonError, rateLimited, INVALID_REQUEST } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import {
  updateDisplayName,
  updateCountry,
  updateProfilePublic,
  updateImage,
} from './profile-updates';

const patchProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  country: z.string().nullable().optional(),
  profilePublic: z.boolean().optional(),
  image: z.string().nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'No valid fields to update' }
);

export const GET = withAuth(async (_req, { userId }): Promise<NextResponse> => {
  const [user] = await db
    .select({ hasPasswordHash: isNotNull(users.passwordHash), country: users.country, profilePublic: users.profilePublic, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Check if user has a credentials (email/password) account vs OAuth-only
  const oauthAccounts = await db
    .select({ provider: accounts.provider })
    .from(accounts)
    .where(eq(accounts.userId, userId));

  const isOAuthOnly = oauthAccounts.length > 0 && !user?.hasPasswordHash;

  return jsonOk({
    hasPassword: !isOAuthOnly && !!user?.hasPasswordHash,
    country: user?.country ?? null,
    profilePublic: user?.profilePublic ?? true,
    emailVerified: user?.emailVerified ? true : false,
  });
});

export const PATCH = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`user-profile:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  const { data: body, error } = await parseBody(request, patchProfileSchema, {
    invalidInput: INVALID_REQUEST,
  });
  if (error) return error;

  // Exactly one field is applied per request, in this precedence order.
  if (body.displayName !== undefined) return updateDisplayName(userId, body.displayName);
  if (body.country !== undefined) return updateCountry(userId, body.country);
  if (body.profilePublic !== undefined) return updateProfilePublic(userId, body.profilePublic === true);
  if (body.image !== undefined) return updateImage(userId, body.image);

  return jsonError('No valid fields to update', 400);
});
