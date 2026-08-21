'use client';

import { useSyncExternalStore } from 'react';

import { isTwaDocument } from '@/lib/twa-constants';

/** The flag is stamped before hydration and never changes, so no subscription is needed. */
function subscribe(): () => void {
  return () => {};
}

/**
 * Returns true inside the Android TWA shell, false on the web.
 *
 * SSR and the hydration pass both read `false`, so server and client markup agree;
 * the real value lands on the first post-hydration render. Callers use it to hide ads
 * and checkout entry points — see `src/lib/twa-constants.ts` for why.
 */
export function useIsTwa(): boolean {
  return useSyncExternalStore(subscribe, isTwaDocument, () => false);
}
