'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { analytics } from '@/lib/mixpanel';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { DividerOr } from '@/components/auth/DividerOr';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { PasswordStrength } from '@/components/auth/PasswordStrength';

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isPasswordValid = password.length >= PASSWORD_MIN_LENGTH
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      analytics.auth({ action: 'signup', method: 'credentials' });

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Account was created successfully - redirect to login with pre-filled email
        router.push(`/login?callbackUrl=${encodeURIComponent('/onboarding')}`);
        return;
      } else {
        router.push('/onboarding');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
      analytics.error({ action: 'signup', message: 'Registration request failed', source: 'register_page' });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    analytics.auth({ action: 'signup', method: 'google' });
    try {
      await signIn('google', { callbackUrl: '/onboarding' });
    } catch {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-black text-surface-900 mb-6 sm:mb-8">Create account</h1>

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

        <label htmlFor="register-name" className="sr-only">Name</label>
        <AuthInput
          id="register-name"
          type="text"
          placeholder="Name"
          value={displayName}
          onChange={(v) => { setDisplayName(v); setError(''); }}
          required
          minLength={2}
          maxLength={50}
          autoComplete="name"
        />

        <label htmlFor="register-email" className="sr-only">Email</label>
        <AuthInput
          id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(v) => { setEmail(v); setError(''); }}
          required
          autoComplete="email"
        />

        <div>
          <label htmlFor="register-password" className="sr-only">Password</label>
          <AuthInput
            id="register-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(v) => { setPassword(v); setError(''); }}
            required
            minLength={PASSWORD_MIN_LENGTH}
            autoComplete="new-password"
          />
          <PasswordStrength password={password} />
        </div>

        <AuthButton loading={loading} disabled={loading || !isPasswordValid}>
          {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
        </AuthButton>
      </form>

      <p className="text-center text-surface-400 text-sm font-semibold mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-[#1CB0F6] font-bold">
          Sign in
        </Link>
      </p>
    </>
  );
}
