'use client';

import type { ReactNode } from 'react';

export interface AuthResultCardProps {
  /** Icon rendered inside the circular badge. Omit for a text-only result. */
  icon?: ReactNode;
  /** Tailwind background class for the icon badge, e.g. `bg-green-50`. */
  iconBgClass?: string;
  title: string;
  children?: ReactNode;
}

/** Centered terminal state for auth flows: sent, verified, failed, invalid link. */
export function AuthResultCard({ icon, iconBgClass, title, children }: AuthResultCardProps) {
  return (
    <div className="text-center space-y-4">
      {icon && (
        <div className={`w-14 h-14 ${iconBgClass} rounded-full flex items-center justify-center mx-auto`}>
          {icon}
        </div>
      )}
      <h1 className="text-xl font-black text-surface-900">{title}</h1>
      {children}
    </div>
  );
}
