'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1h13.36"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-black text-surface-900 mb-2">
          Oops — Hit a Snag
        </h1>
        <p className="text-surface-500 mb-8 leading-relaxed">
          Something broke while loading this page. Your progress is safe.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
