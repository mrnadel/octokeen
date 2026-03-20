'use client';

import { useLocaleStore, type Locale } from '@/store/useLocaleStore';
import { en } from './en';
import { he } from './he';

const translationMap: Record<Locale, Record<string, string>> = { en, he };

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const translations = translationMap[locale];

  const t = (key: string, params?: Record<string, string | number>): string => {
    let str = translations[key] ?? en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replaceAll(`{${k}}`, String(v));
      }
    }
    return str;
  };

  const dir = locale === 'he' ? 'rtl' : 'ltr';

  return { t, locale, dir } as const;
}
