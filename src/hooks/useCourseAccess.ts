'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/**
 * Returns the list of gated course profession IDs the current user has access to.
 * Uses SWR for caching so it doesn't re-fetch on every render.
 */
export function useCourseAccess(): string[] | undefined {
  const { data } = useSWR<{ courseAccess: string[] }>('/api/course-access', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  return data?.courseAccess;
}
