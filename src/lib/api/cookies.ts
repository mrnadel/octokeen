/**
 * Cookie holding the inviter's user ID while a visitor completes sign-up.
 * Written by /api/invite/set-cookie, consumed by the NextAuth signIn callback
 * (src/lib/auth.ts) and /api/invite/accept.
 */
export const INVITE_REF_COOKIE = 'invite_ref';

/** Lifetime of {@link INVITE_REF_COOKIE}. */
export const INVITE_REF_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
