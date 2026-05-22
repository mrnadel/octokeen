import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/get-started',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    req.auth ||
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/mp/') ||
    pathname.startsWith('/invite/')
  ) {
    return NextResponse.next();
  }

  return Response.redirect(new URL('/login', req.url));
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
