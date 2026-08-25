import { auth } from '@/lib/auth';
import { NextResponse, type NextRequest } from 'next/server';
import { GEO_COOKIE } from '@/lib/country';

// Routes that require authentication (not necessarily Pro)
const authRequiredPrefixes = [
  '/profile',
  '/analytics',
  '/settings',
  '/friends',
  '/achievements',
  '/quests',
  '/shop',
  '/progress',
  '/skills',
  '/onboarding',
  '/checkout',
  '/admin',
  '/league',
  '/practice',
  '/switch-course',
];

// Routes that require Pro subscription — gated on the client side via
// useSubscription, but middleware redirects unauthenticated users to login
const premiumPrefixes = ['/analytics'];

/**
 * Hand the client the country the edge already knows, so the app can localize
 * content without asking the user where they live. Readable from JS on purpose
 * — `src/lib/country.ts` consumes it — and only a coarse country code, never
 * anything finer. Locally the header is absent and the client falls back to
 * locale/timezone detection.
 */
function withGeo(req: NextRequest, res: NextResponse) {
  const country = req.headers?.get('x-vercel-ip-country');
  if (country && req.cookies?.get(GEO_COOKIE)?.value !== country) {
    res.cookies.set(GEO_COOKIE, country, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
    });
  }
  return res;
}

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/get-started';

  // Authenticated users visiting auth pages -> redirect to home
  if (isAuthPage && isLoggedIn) {
    return withGeo(req, NextResponse.redirect(new URL('/', req.nextUrl)));
  }

  // Auth-required routes -> redirect to login
  if (!isLoggedIn && authRequiredPrefixes.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return withGeo(req, NextResponse.redirect(loginUrl));
  }

  // Everyone else can access all routes (subscription checks happen client-side)
  return withGeo(req, NextResponse.next());
});

export const config = {
  matcher: [
    '/((?!api|_next|favicon\\.ico|icon-.*\\.png|apple-touch-icon\\.png|manifest\\.json|og-image\\.png|sw\\.js|robots\\.txt|sitemap\\.xml|.*\\.svg).*)',
  ],
};
