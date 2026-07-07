'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { PasswordStrength } from '@/components/auth/PasswordStrength';

export default function ResetPasswordPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="h-6" />}>
        <ResetPasswordInner />
      </Suspense>
    </ErrorBoundary>
  );
}

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isPasswordValid = password.length >= PASSWORD_MIN_LENGTH
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-xl font-black text-surface-900">Invalid link</h1>
        <p className="text-sm text-surface-500 font-semibold">
          This reset link is missing or malformed.
        </p>
        <Link href="/forgot-password" className="block text-sm text-[#1CB0F6] font-bold mt-4">
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-black text-surface-900">Password updated</h1>
        <p className="text-sm text-surface-500 font-semibold">
          Your password has been reset. You can now sign in.
        </p>
        <Link
          href="/login"
          className="inline-block mt-4 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-extrabold rounded-2xl transition-all text-[17px]"
          style={{ boxShadow: '0 5px 0 #0F766E' }}
        >
          SIGN IN
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-black text-surface-900 mb-2">New password</h1>
      <p className="text-sm text-surface-400 font-semibold mb-6">
        Choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <ErrorAlert message={error || null} />

        <div>
          <label htmlFor="reset-password" className="sr-only">New password</label>
          <AuthInput
            id="reset-password"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(v) => { setPassword(v); setError(''); }}
            required
            minLength={PASSWORD_MIN_LENGTH}
            autoComplete="new-password"
            autoFocus
          />
          <PasswordStrength password={password} />
        </div>

        <AuthButton loading={loading} disabled={loading || !isPasswordValid}>
          {loading ? 'Resetting...' : 'RESET PASSWORD'}
        </AuthButton>
      </form>

      <p className="text-center text-surface-400 text-sm font-semibold mt-8">
        <Link href="/login" className="text-[#1CB0F6] font-bold">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
