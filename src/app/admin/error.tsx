'use client';

import { useEffect } from 'react';

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
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-black text-surface-900 mb-2">
          Admin Panel Error
        </h1>
        <p className="text-surface-500 mb-8 leading-relaxed">
          Something went wrong in the admin panel. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <a href="/admin" className="btn-secondary">
            Back to Admin
          </a>
        </div>
      </div>
    </div>
  );
}
