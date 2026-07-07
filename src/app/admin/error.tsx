'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import ErrorDisplay from '@/components/errors/ErrorDisplay';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error boundary caught:', error);
  }, [error]);

  return (
    <ErrorDisplay
      icon={<AlertTriangle className="w-10 h-10" />}
      iconBgClass="bg-amber-50"
      iconColorClass="text-amber-500"
      title="Admin Panel Error"
      description="Something went wrong in the admin panel. Please try again."
      backHref="/admin"
      backLabel="Back to Admin"
      onRetry={reset}
    />
  );
}
