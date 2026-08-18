import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function getAuthUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Narrow admin check: matches ADMIN_USER_ID only, ignoring ADMIN_EMAIL.
 *
 * ADMIN_USER_ID is optional (see env.ts), so it must be confirmed set before
 * comparing — otherwise an unauthenticated caller (`userId === undefined`)
 * matches an unset env var and is treated as admin.
 *
 * Deliberately NOT the same as {@link requireAdmin}, which also accepts
 * ADMIN_EMAIL. Callers of this function grant access to a strictly smaller set
 * of people; do not swap one for the other without deciding which is intended.
 */
export function isAdminUserId(userId: string | undefined | null): boolean {
  const adminId = process.env.ADMIN_USER_ID;
  return !!adminId && userId === adminId;
}

/**
 * Check if the current user is the configured admin.
 * Returns the user ID if admin, or null if not admin / not logged in.
 * Checks by email (ADMIN_EMAIL) first, falls back to ADMIN_USER_ID.
 */
export async function requireAdmin(): Promise<string | null> {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  if (!userId) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && session?.user?.email === adminEmail) {
    return userId;
  }

  const adminId = process.env.ADMIN_USER_ID;
  if (adminId && userId === adminId) {
    return userId;
  }

  logger.warn('[auth] No admin match for user', userId);
  return null;
}
