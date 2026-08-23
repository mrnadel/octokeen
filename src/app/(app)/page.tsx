import { LandingPage } from '@/components/landing/LandingPage';
import { hasSessionCookie } from '@/lib/session-cookie';

import HomeApp from './HomeApp';

/**
 * Signed-out visitors get the marketing page as real server-rendered HTML.
 * Signed-in visitors get the course map, exactly as before. The cookie probe is
 * a hint, not an authorisation check: the client session still decides what the
 * app renders once it hydrates.
 */
export default async function HomePage() {
  const signedIn = await hasSessionCookie();
  return signedIn ? <HomeApp /> : <LandingPage />;
}
