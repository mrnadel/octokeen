'use client';

import { GoogleIcon } from './GoogleIcon';

export interface GoogleSignInButtonProps {
  onClick: () => void;
  loading: boolean;
}

/** "Continue with Google" button shared by the sign-in and sign-up pages. */
export function GoogleSignInButton({ onClick, loading }: GoogleSignInButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-surface-200 rounded-2xl text-surface-700 font-bold hover:border-surface-300 disabled:opacity-60 transition-colors"
    >
      <GoogleIcon />
      {loading ? 'Redirecting...' : 'Continue with Google'}
    </button>
  );
}
