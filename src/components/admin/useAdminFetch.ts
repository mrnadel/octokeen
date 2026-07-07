'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseAdminFetchOptions {
  /** When true, skip the automatic fetch (e.g. while auth is loading) */
  skip?: boolean;
}

interface UseAdminFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAdminFetch<T>(
  url: string,
  options?: UseAdminFetchOptions
): UseAdminFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        setError(res.status === 403 ? 'Access denied' : 'Failed to load');
        return;
      }
      const json = (await res.json()) as T;
      setData(json);
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options?.skip) return;
    refetch();
  }, [refetch, options?.skip]);

  return { data, loading, error, refetch };
}
