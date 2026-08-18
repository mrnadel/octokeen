'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

/** Depth shadow on the primary pill CTA — matches `bg-primary-500`. */
const PRIMARY_CTA_SHADOW = { boxShadow: '0 5px 0 #0F766E' } as const;

export interface AuthPrimaryLinkProps {
  href: string;
  children: ReactNode;
}

/** Full-depth pill CTA closing a successful auth flow. */
export function AuthPrimaryLink({ href, children }: AuthPrimaryLinkProps) {
  return (
    <Link
      href={href}
      className="inline-block mt-4 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-extrabold rounded-2xl transition-all text-[17px]"
      style={PRIMARY_CTA_SHADOW}
    >
      {children}
    </Link>
  );
}
