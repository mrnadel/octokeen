// ============================================================
// Invite Code Assignment — Octokeen
// ============================================================

import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { isUniqueViolation } from '@/lib/db/errors';

const CODE_BYTES = 6;
const CODE_LENGTH = 8;
const MAX_ATTEMPTS = 5;

/** Generate a random URL-safe invite code. */
export function generateInviteCode(): string {
  return crypto.randomBytes(CODE_BYTES).toString('base64url').slice(0, CODE_LENGTH);
}

/**
 * Assign a freshly generated invite code to a user, retrying on collisions.
 * Returns the stored code, or null if every attempt collided.
 */
export async function assignInviteCode(userId: string): Promise<string | null> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateInviteCode();
    try {
      await db.update(users).set({ inviteCode: code }).where(eq(users.id, userId));
      return code;
    } catch (err) {
      if (isUniqueViolation(err)) continue;
      throw err;
    }
  }

  return null;
}
