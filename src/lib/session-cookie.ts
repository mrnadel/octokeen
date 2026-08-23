import { cookies } from 'next/headers';

/**
 * Auth.js writes the secure variant behind HTTPS and the plain one locally.
 * Kept in sync with the `session` config in `src/lib/auth.ts`.
 */
const SESSION_COOKIE_NAMES = ['__Secure-authjs.session-token', 'authjs.session-token'] as const;

/**
 * Cheap signed-in probe for server components: presence only, no JWT decode and
 * no database round trip. A stale cookie falls through to the client session
 * check, which renders the same screens it always did.
 */
export async function hasSessionCookie(): Promise<boolean> {
  const store = await cookies();
  return SESSION_COOKIE_NAMES.some((name) => Boolean(store.get(name)?.value));
}
