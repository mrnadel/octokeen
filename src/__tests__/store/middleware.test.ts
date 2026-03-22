import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url: URL) => ({ type: 'redirect', url: url.toString() })),
    next: vi.fn(() => ({ type: 'next' })),
  },
}));

// We need to capture the handler passed to auth()
let capturedHandler: any = null;

vi.mock('@/lib/auth', () => ({
  auth: (handler: any) => {
    capturedHandler = handler;
    return handler;
  },
}));

function createMockRequest(pathname: string, isLoggedIn: boolean) {
  const url = new URL(`http://localhost:3000${pathname}`);
  return {
    auth: isLoggedIn ? { user: { id: '1' } } : null,
    nextUrl: url,
  };
}

describe('middleware', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Force re-import so the auth() call happens and capturedHandler is set
    capturedHandler = null;
    // Dynamic import to trigger the module code
    await import('@/middleware');
  });

  describe('config', () => {
    it('has a matcher that excludes api, _next, and favicon', async () => {
      const mod = await import('@/middleware');
      expect(mod.config.matcher).toBeDefined();
      expect(mod.config.matcher[0]).toContain('(?!api|_next/static|_next/image|favicon.ico)');
    });
  });

  describe('authenticated user on auth pages', () => {
    it('redirects logged-in user from /login to /', () => {
      const req = createMockRequest('/login', true);
      capturedHandler(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectUrl.pathname).toBe('/');
    });

    it('redirects logged-in user from /register to /', () => {
      const req = createMockRequest('/register', true);
      capturedHandler(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectUrl.pathname).toBe('/');
    });

    it('redirects logged-in user from /get-started to /', () => {
      const req = createMockRequest('/get-started', true);
      capturedHandler(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
    });
  });

  describe('unauthenticated user on protected routes', () => {
    it('redirects unauthenticated user from /profile to /login with callbackUrl', () => {
      const req = createMockRequest('/profile', false);
      capturedHandler(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectUrl.pathname).toBe('/login');
      expect(redirectUrl.searchParams.get('callbackUrl')).toBe('/profile');
    });

    it('redirects unauthenticated user from /analytics to /login', () => {
      const req = createMockRequest('/analytics', false);
      capturedHandler(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectUrl.pathname).toBe('/login');
      expect(redirectUrl.searchParams.get('callbackUrl')).toBe('/analytics');
    });

    it('redirects unauthenticated user from /analytics/topic to /login', () => {
      const req = createMockRequest('/analytics/topic', false);
      capturedHandler(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
    });
  });

  describe('public routes', () => {
    it('allows unauthenticated user on /login', () => {
      const req = createMockRequest('/login', false);
      capturedHandler(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('allows unauthenticated user on /', () => {
      const req = createMockRequest('/', false);
      capturedHandler(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('allows authenticated user on /', () => {
      const req = createMockRequest('/', true);
      capturedHandler(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('allows unauthenticated user on /course', () => {
      const req = createMockRequest('/course', false);
      capturedHandler(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('allows authenticated user on /profile', () => {
      const req = createMockRequest('/profile', true);
      capturedHandler(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });
  });
});
