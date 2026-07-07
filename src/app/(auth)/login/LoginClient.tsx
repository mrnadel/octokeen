'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/mixpanel';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { DividerOr } from '@/components/auth/DividerOr';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function LoginPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="h-6" />}>
        <LoginPageInner />
      </Suspense>
    </ErrorBoundary>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  const isLocked = lockedUntil > Date.now();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 5) {
          const lockEnd = Date.now() + 15 * 60_000;
          setLockedUntil(lockEnd);
          setError('Too many failed attempts. Please wait 15 minutes before trying again.');
        } else {
          setError('Invalid email or password');
        }
        setLoading(false);
      } else {
        analytics.auth({ action: 'login', method: 'credentials' });
        // Validate callbackUrl to prevent redirect loops (no auth pages)
        const safe = callbackUrl.startsWith('/') && !callbackUrl.startsWith('/login') && !callbackUrl.startsWith('/register')
          ? callbackUrl : '/';
        router.push(safe);
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    analytics.auth({ action: 'login', method: 'google' });
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-black text-surface-900 mb-6 sm:mb-8">Sign in</h1>

      {/* Google */}
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-surface-200 rounded-2xl text-surface-700 font-bold hover:border-surface-300 disabled:opacity-60 transition-colors"
      >
        <GoogleIcon />
        {googleLoading ? 'Redirecting...' : 'Continue with Google'}
      </button>

      <DividerOr />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-3">
        <ErrorAlert message={error || null} />

        <label htmlFor="login-email" className="sr-only">Email</label>
        <AuthInput
          id="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(v) => { setEmail(v); setError(''); }}
          required
          autoComplete="email"
        />

        <label htmlFor="login-password" className="sr-only">Password</label>
        <AuthInput
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(v) => { setPassword(v); setError(''); }}
          required
          autoComplete="current-password"
        />

        <AuthButton loading={loading} disabled={loading || isLocked}>
          {loading ? 'Signing in...' : isLocked ? 'LOCKED' : 'LOG IN'}
        </AuthButton>
      </form>

      <p className="text-center mt-4">
        <Link href="/forgot-password" className="text-sm text-surface-400 hover:text-surface-600 font-semibold transition-colors">
          Forgot password?
        </Link>
      </p>

      <p className="text-center text-surface-400 text-sm font-semibold mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#1CB0F6] font-bold">
          Sign up
        </Link>
      </p>
    </>
  );
}
