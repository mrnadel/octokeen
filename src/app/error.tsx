'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import ErrorDisplay from '@/components/errors/ErrorDisplay';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root error boundary caught:', error);
  }, [error]);

  return (
    <ErrorDisplay
      icon={<AlertTriangle className="w-10 h-10" />}
      iconBgClass="bg-red-50"
      iconColorClass="text-red-500"
      title="Something Went Wrong"
      description="An unexpected error occurred. Don't worry — your progress is saved."
      backHref="/"
      backLabel="Back to Dashboard"
      onRetry={reset}
    />
  );
}
