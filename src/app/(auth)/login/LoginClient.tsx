'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/mixpanel';
import { AuthSuspenseBoundary } from '@/components/auth/AuthSuspenseBoundary';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { DividerOr } from '@/components/auth/DividerOr';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

/**
 * The `<h1>` sits outside the Suspense boundary on purpose. `LoginPageInner`
 * reads `useSearchParams`, which makes everything inside the boundary render
 * as the fallback during prerender, so a heading placed in there is missing
 * from the served HTML entirely.
 */
export default function LoginPage() {
  return (
    <>
      <h1 className="text-xl sm:text-2xl font-black text-surface-900 mb-6 sm:mb-8">Sign in</h1>
      <AuthSuspenseBoundary>
        <LoginPageInner />
      </AuthSuspenseBoundary>
    </>
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
      <GoogleSignInButton onClick={handleGoogleSignIn} loading={googleLoading} />

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
