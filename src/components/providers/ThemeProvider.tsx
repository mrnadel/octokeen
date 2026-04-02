'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { APP_THEME_COLOR_LIGHT, APP_THEME_COLOR_DARK } from '@/lib/constants';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (dark: boolean) => {
      root.classList.toggle('dark', dark);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? APP_THEME_COLOR_DARK : APP_THEME_COLOR_LIGHT);
    };

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mq.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }

    apply(mode === 'dark');
  }, [mode]);

  return <>{children}</>;
}
