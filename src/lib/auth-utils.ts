import { auth } from '@/lib/auth';

export async function getAuthUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
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

  console.warn('[auth] No admin match for user', userId);
  return null;
}
