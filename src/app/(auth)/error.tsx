'use client';

import { useEffect } from 'react';
import { Lock } from 'lucide-react';
import ErrorDisplay from '@/components/errors/ErrorDisplay';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Auth error boundary caught:', error);
  }, [error]);

  return (
    <ErrorDisplay
      icon={<Lock className="w-10 h-10" />}
      iconBgClass="bg-red-50"
      iconColorClass="text-red-400"
      title="Authentication Error"
      description="Something went wrong during sign-in. Please try again."
      backHref="/login"
      backLabel="Back to Login"
      onRetry={reset}
    />
  );
}
