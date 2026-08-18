'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Two header treatments exist in the app shell and are visually distinct:
 * `light` on the static/legal pages, `themed` on the dark-mode-aware settings pages.
 */
const VARIANTS = {
  light: {
    bar: 'sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200',
    back: 'p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors',
    arrow: 'w-5 h-5 text-gray-700',
    title: 'text-lg font-bold text-gray-900 ml-2',
  },
  themed: {
    bar: 'sticky top-0 z-30 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-surface-700',
    back: 'p-3 -ml-3 rounded-full hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center',
    arrow: 'w-5 h-5 text-gray-600 dark:text-surface-400',
    title: 'text-lg font-extrabold text-gray-900 dark:text-surface-50 ml-2',
  },
} as const;

export type AppPageHeaderVariant = keyof typeof VARIANTS;

export interface AppPageHeaderProps {
  title: string;
  variant: AppPageHeaderVariant;
  /** Navigate to a fixed route. Mutually exclusive with `onBack`. */
  backHref?: string;
  /** Go back in history. Mutually exclusive with `backHref`. */
  onBack?: () => void;
}

/** Sticky page header with a back affordance and a title. */
export function AppPageHeader({ title, variant, backHref, onBack }: AppPageHeaderProps) {
  const v = VARIANTS[variant];

  return (
    <div className={v.bar}>
      <div className="flex items-center h-14 px-4">
        {backHref ? (
          <Link href={backHref} className={v.back}>
            <ArrowLeft className={v.arrow} />
          </Link>
        ) : (
          <button onClick={onBack} className={v.back}>
            <ArrowLeft className={v.arrow} />
          </button>
        )}
        <h1 className={v.title}>{title}</h1>
      </div>
    </div>
  );
}
