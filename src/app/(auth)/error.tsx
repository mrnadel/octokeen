'use client';

import { useEffect } from 'react';

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
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-black text-surface-900 mb-2">
          Authentication Error
        </h1>
        <p className="text-surface-500 mb-8 leading-relaxed">
          Something went wrong during sign-in. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <a href="/login" className="btn-secondary">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
