'use client';

import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export interface AuthSuspenseBoundaryProps {
  children: ReactNode;
}

/**
 * Error + Suspense wrapper required by every auth page that reads search params.
 * The fallback is a bare spacer so the card doesn't jump while params resolve.
 */
export function AuthSuspenseBoundary({ children }: AuthSuspenseBoundaryProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="h-6" />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
