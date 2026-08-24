import { cookies } from 'next/headers';

/**
 * Auth.js writes the secure variant behind HTTPS and the plain one locally, and
 * splits the token into `.0`, `.1`, … chunks once it outgrows the 4 KB cookie
 * limit. Kept in sync with the `session` config in `src/lib/auth.ts`.
 */
const SESSION_COOKIE_RE = /^(?:__Secure-)?(?:authjs|next-auth)\.session-token(?:\.\d+)?$/;

/**
 * Cheap signed-in probe for server components: presence only, no JWT decode and
 * no database round trip. A stale cookie falls through to the client session
 * check, which renders the same screens it always did.
 */
export async function hasSessionCookie(): Promise<boolean> {
  const store = await cookies();
  return store.getAll().some((c) => SESSION_COOKIE_RE.test(c.name) && Boolean(c.value));
}
