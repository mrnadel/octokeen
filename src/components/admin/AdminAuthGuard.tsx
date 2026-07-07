'use client';

import type { ReactNode } from 'react';
import { AdminSpinner } from './AdminSpinner';

interface AdminAuthGuardProps {
  loading: boolean;
  session: unknown;
  children: ReactNode;
}

export function AdminAuthGuard({ loading, session, children }: AdminAuthGuardProps) {
  if (loading) {
    return <AdminSpinner />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">Not authenticated</p>
          <a
            href="/login"
            className="text-primary-600 text-sm font-medium hover:underline mt-1 inline-block"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
