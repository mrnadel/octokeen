import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Typography primitives for `/about`.
 *
 * They match `GuideBlocks` deliberately, so the page reads as part of the same
 * publication as the guides. They are components rather than blocks in the
 * guide data format because this page links to routes and to an email address,
 * and the guide format's inline markup only resolves guide slugs.
 */
const H2 = 'mt-10 mb-3 text-xl font-extrabold leading-snug text-surface-900 dark:text-surface-50 sm:text-2xl';
const H3 = 'mt-8 mb-2 text-base font-extrabold text-surface-900 dark:text-surface-50 sm:text-lg';
const PARAGRAPH = 'my-4 text-[0.9375rem] leading-7 text-surface-600 dark:text-surface-300 sm:text-base sm:leading-8';
const LIST = 'my-4 list-disc space-y-2 pl-5 text-[0.9375rem] leading-7 text-surface-600 dark:text-surface-300 sm:text-base';
const ITEM = 'pl-1 marker:text-primary-500';
const BOLD = 'font-extrabold text-surface-900 dark:text-surface-100';
const LINK =
  'font-bold text-primary-700 underline decoration-primary-300 underline-offset-2 hover:decoration-primary-600 dark:text-primary-300 dark:decoration-primary-700';

export function AboutHeading({ children }: { children: ReactNode }) {
  return <h2 className={H2}>{children}</h2>;
}

export function AboutSubheading({ children }: { children: ReactNode }) {
  return <h3 className={H3}>{children}</h3>;
}

export function AboutText({ children }: { children: ReactNode }) {
  return <p className={PARAGRAPH}>{children}</p>;
}

export function AboutList({ children }: { children: ReactNode }) {
  return <ul className={LIST}>{children}</ul>;
}

export function AboutItem({ children }: { children: ReactNode }) {
  return <li className={ITEM}>{children}</li>;
}

export function AboutStrong({ children }: { children: ReactNode }) {
  return <strong className={BOLD}>{children}</strong>;
}

export function AboutLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={LINK}>
      {children}
    </Link>
  );
}
