import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useCountryInit } from '@/hooks/useCountryInit';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { GEO_COOKIE } from '@/lib/country';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ status: 'unauthenticated', data: null })),
}));

const mockedUseSession = vi.mocked(useSession);

function signedIn() {
  mockedUseSession.mockReturnValue({ status: 'authenticated', data: { user: { id: '1' } } } as never);
}

function signedOut() {
  mockedUseSession.mockReturnValue({ status: 'unauthenticated', data: null } as never);
}

/** Stub `/api/user/profile`: GET returns `serverCountry`, PATCH bodies are recorded. */
function mockProfileApi(serverCountry: string | null) {
  const patched: unknown[] = [];
  const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
    if (init?.method === 'PATCH') {
      patched.push(JSON.parse(String(init.body)));
      return { ok: true, json: async () => ({}) } as Response;
    }
    return { ok: true, json: async () => ({ country: serverCountry }) } as Response;
  });
  vi.stubGlobal('fetch', fetchMock);
  return { patched, fetchMock };
}

function stored() {
  return localStorage.getItem(STORAGE_KEYS.COUNTRY);
}

describe('useCountryInit', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = `${GEO_COOKIE}=; max-age=0; path=/`;
    signedOut();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    document.cookie = `${GEO_COOKIE}=; max-age=0; path=/`;
  });

  describe('signed out', () => {
    it('stores the detected country when nothing is saved', async () => {
      document.cookie = `${GEO_COOKIE}=IL; path=/`;

      renderHook(() => useCountryInit());

      await waitFor(() => expect(stored()).toBe('IL'));
    });

    it('leaves an existing choice alone', async () => {
      localStorage.setItem(STORAGE_KEYS.COUNTRY, 'JP');
      document.cookie = `${GEO_COOKIE}=IL; path=/`;

      renderHook(() => useCountryInit());

      await waitFor(() => expect(stored()).toBe('JP'));
    });

    it('never calls the profile API', async () => {
      const { fetchMock } = mockProfileApi(null);
      document.cookie = `${GEO_COOKIE}=IL; path=/`;

      renderHook(() => useCountryInit());

      await waitFor(() => expect(stored()).toBe('IL'));
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('signed in', () => {
    it('adopts the server country, so a choice follows the user across devices', async () => {
      signedIn();
      const { patched } = mockProfileApi('JP');
      document.cookie = `${GEO_COOKIE}=IL; path=/`;

      renderHook(() => useCountryInit());

      await waitFor(() => expect(stored()).toBe('JP'));
      expect(patched).toHaveLength(0);
    });

    it('pushes the detected country up when the server has none', async () => {
      signedIn();
      const { patched } = mockProfileApi(null);
      document.cookie = `${GEO_COOKIE}=IL; path=/`;

      renderHook(() => useCountryInit());

      await waitFor(() => expect(patched).toEqual([{ country: 'IL' }]));
      expect(stored()).toBe('IL');
    });

    it('translates a legacy server code instead of guessing over it', async () => {
      signedIn();
      const { patched } = mockProfileApi('INT');
      document.cookie = `${GEO_COOKIE}=IL; path=/`;

      renderHook(() => useCountryInit());

      await waitFor(() => expect(stored()).toBe('XX'));
      expect(patched).toHaveLength(0);
    });

    it('falls back to the local value when the profile fetch fails', async () => {
      signedIn();
      localStorage.setItem(STORAGE_KEYS.COUNTRY, 'GB');
      vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));

      renderHook(() => useCountryInit());

      await waitFor(() => expect(stored()).toBe('GB'));
    });
  });

  it('does nothing while the session is still resolving', async () => {
    mockedUseSession.mockReturnValue({ status: 'loading', data: null } as never);
    const { fetchMock } = mockProfileApi(null);
    document.cookie = `${GEO_COOKIE}=IL; path=/`;

    renderHook(() => useCountryInit());

    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled());
    expect(stored()).toBeNull();
  });
});
