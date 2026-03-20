'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/store/useLocaleStore';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', locale);
    html.setAttribute('dir', locale === 'he' ? 'rtl' : 'ltr');
  }, [locale]);

  return <>{children}</>;
}
