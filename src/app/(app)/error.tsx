'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import ErrorDisplay from '@/components/errors/ErrorDisplay';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <ErrorDisplay
      icon={<RefreshCw className="w-10 h-10" />}
      iconBgClass="bg-amber-50"
      iconColorClass="text-amber-500"
      title="Oops — Hit a Snag"
      description="Something broke while loading this page. Your progress is safe."
      backHref="/"
      backLabel="Back to Dashboard"
      onRetry={reset}
    />
  );
}
