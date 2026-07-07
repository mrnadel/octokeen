// ============================================================
// Auth Token Helpers — Octokeen
// Shared utilities for password-reset and email-verification tokens.
// ============================================================

import crypto from 'crypto';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { passwordResetTokens, emailVerificationTokens } from '@/lib/db/schema';

// ─── Token Generation ──────────────────────────────────────────

/** Generate a cryptographically secure random token (hex string). */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/** Hash a raw token with SHA-256 for safe database storage. */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ─── Token Validation ──────────────────────────────────────────

type TokenTable = 'passwordReset' | 'emailVerification';

const tableMap = {
  passwordReset: passwordResetTokens,
  emailVerification: emailVerificationTokens,
} as const;

/**
 * Validate a token by looking up its hash in the specified token table.
 * Returns the token row if it is valid (hash matches, not used, not expired),
 * or `undefined` if invalid.
 */
export async function validateToken(table: TokenTable, tokenHash: string) {
  const schema = tableMap[table];

  const [row] = await db
    .select()
    .from(schema)
    .where(
      and(
        eq(schema.tokenHash, tokenHash),
        isNull(schema.usedAt),
        gt(schema.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return row;
}

// ─── Mark Token Used ───────────────────────────────────────────

/** Mark a token as used by setting its `usedAt` timestamp. */
export async function markTokenUsed(table: TokenTable, tokenId: string): Promise<void> {
  const schema = tableMap[table];

  await db
    .update(schema)
    .set({ usedAt: new Date() })
    .where(eq(schema.id, tokenId));
}

// ─── URL Helper ────────────────────────────────────────────────

/** Get the base URL for constructing email links (reset password, verify email, etc.). */
export function getBaseUrl(): string {
  return process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
}
