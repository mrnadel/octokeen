'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { detectCountry, normalizeCountry } from '@/lib/country';

/**
 * Settle the user's region once per app load, without asking them.
 *
 * A saved choice always wins, and a signed-in user's saved choice follows them
 * across devices, so the server value is adopted before anything is detected.
 * Only an empty slot gets filled with a guess, and the guess is pushed to the
 * server so the next device starts from the same place. Settings → Region is
 * the correction path.
 */
export function useCountryInit() {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    let cancelled = false;

    const read = () => {
      try {
        return normalizeCountry(localStorage.getItem(STORAGE_KEYS.COUNTRY));
      } catch {
        return null;
      }
    };
    const write = (code: string) => {
      try {
        localStorage.setItem(STORAGE_KEYS.COUNTRY, code);
      } catch {
        /* private mode — detection just runs again next load */
      }
    };

    if (status !== 'authenticated') {
      if (!read()) {
        const detected = detectCountry();
        if (detected) write(detected);
      }
      return;
    }

    (async () => {
      let serverCountry: string | null = null;
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) serverCountry = normalizeCountry((await res.json()).country);
      } catch {
        /* offline — fall through to the local value */
      }
      if (cancelled) return;

      if (serverCountry) {
        write(serverCountry);
        return;
      }

      const local = read();
      const code = local ?? detectCountry();
      if (!code) return;
      if (!local) write(code);

      fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: code }),
      }).catch(() => {
        /* best effort — the local value is the one that drives content */
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);
}
