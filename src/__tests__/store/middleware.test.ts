import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted runs before vi.mock, making the variable available in the mock factory
const { middlewareHandlerRef } = vi.hoisted(() => {
  const ref = { current: null as ((req: any) => any) | null };
  return { middlewareHandlerRef: ref };
});

// Mock NextResponse. Responses carry a `cookies.set` spy because the proxy
// stamps the edge-detected country onto every response it returns.
const cookieSet = vi.fn();
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url: URL) => ({ type: 'redirect', url, cookies: { set: cookieSet } })),
    next: vi.fn(() => ({ type: 'next', cookies: { set: cookieSet } })),
  },
}));

// Capture the handler function that middleware passes to auth()
vi.mock('@/lib/auth', () => ({
  auth: (handler: any) => {
    middlewareHandlerRef.current = handler;
    return handler;
  },
}));

// Force the module to load -- this calls auth(handler) at module init time
import '@/proxy';
import { config } from '@/proxy';
import { NextResponse } from 'next/server';

function createMockRequest(
  pathname: string,
  isLoggedIn: boolean,
  opts: { geoCountry?: string; cookieCountry?: string } = {},
) {
  const url = new URL(`http://localhost:3000${pathname}`);
  const headers = new Headers();
  if (opts.geoCountry) headers.set('x-vercel-ip-country', opts.geoCountry);
  return {
    auth: isLoggedIn ? { user: { id: '1' } } : null,
    nextUrl: url,
    headers,
    cookies: {
      get: (name: string) =>
        name === 'ok-geo' && opts.cookieCountry ? { value: opts.cookieCountry } : undefined,
    },
  };
}

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('captured the middleware handler', () => {
    expect(middlewareHandlerRef.current).not.toBeNull();
    expect(typeof middlewareHandlerRef.current).toBe('function');
  });

  describe('config', () => {
    it('has a matcher that excludes api, _next, and favicon', () => {
      expect(config.matcher).toBeDefined();
      expect(config.matcher[0]).toContain('(?!api|_next|favicon');
    });
  });

  describe('authenticated user on auth pages', () => {
    it('redirects logged-in user from /login to /', () => {
      const req = createMockRequest('/login', true);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectUrl.pathname).toBe('/');
    });

    it('redirects logged-in user from /register to /', () => {
      const req = createMockRequest('/register', true);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectUrl.pathname).toBe('/');
    });

    it('redirects logged-in user from /get-started to /', () => {
      const req = createMockRequest('/get-started', true);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
    });
  });

  describe('unauthenticated user on protected routes', () => {
    it('redirects unauthenticated user from /profile to /login with callbackUrl', () => {
      const req = createMockRequest('/profile', false);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectUrl.pathname).toBe('/login');
      expect(redirectUrl.searchParams.get('callbackUrl')).toBe('/profile');
    });

    it('redirects unauthenticated user from /analytics to /login', () => {
      const req = createMockRequest('/analytics', false);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectUrl.pathname).toBe('/login');
      expect(redirectUrl.searchParams.get('callbackUrl')).toBe('/analytics');
    });

    it('redirects unauthenticated user from /analytics/topic to /login', () => {
      const req = createMockRequest('/analytics/topic', false);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.redirect).toHaveBeenCalled();
    });
  });

  describe('public routes', () => {
    it('allows unauthenticated user on /login', () => {
      const req = createMockRequest('/login', false);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('allows unauthenticated user on /', () => {
      const req = createMockRequest('/', false);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('allows authenticated user on /', () => {
      const req = createMockRequest('/', true);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('allows unauthenticated user on /course', () => {
      const req = createMockRequest('/course', false);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('allows authenticated user on /profile', () => {
      const req = createMockRequest('/profile', true);
      middlewareHandlerRef.current!(req);

      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe('geo cookie', () => {
    it('stamps the edge-detected country onto the response', () => {
      middlewareHandlerRef.current!(createMockRequest('/', false, { geoCountry: 'IL' }));

      expect(cookieSet).toHaveBeenCalledWith('ok-geo', 'IL', expect.objectContaining({ path: '/', httpOnly: false }));
    });

    it('stamps redirects too, so a login bounce does not lose the country', () => {
      middlewareHandlerRef.current!(createMockRequest('/profile', false, { geoCountry: 'GB' }));

      expect(cookieSet).toHaveBeenCalledWith('ok-geo', 'GB', expect.objectContaining({ path: '/' }));
    });

    it('leaves the cookie alone when it already matches', () => {
      middlewareHandlerRef.current!(createMockRequest('/', false, { geoCountry: 'IL', cookieCountry: 'IL' }));

      expect(cookieSet).not.toHaveBeenCalled();
    });

    it('sets nothing when the platform reports no country', () => {
      middlewareHandlerRef.current!(createMockRequest('/', false));

      expect(cookieSet).not.toHaveBeenCalled();
    });
  });
});
