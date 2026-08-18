// ============================================================
// Password hashing — Octokeen
// Leaf module: must NOT import @/lib/auth, or every route that
// hashes a password would transitively pull in the NextAuth stack.
// ============================================================

import bcrypt from 'bcryptjs';

/**
 * bcrypt cost factor. Changing this only affects newly written hashes;
 * existing hashes carry their own cost and keep verifying.
 */
const BCRYPT_COST = 12;

/** Hash a plaintext password for storage. */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

/** Verify a plaintext password against a stored bcrypt hash. */
export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
