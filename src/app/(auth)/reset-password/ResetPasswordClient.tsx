'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';
import { AuthSuspenseBoundary } from '@/components/auth/AuthSuspenseBoundary';
import { AuthResultCard } from '@/components/auth/AuthResultCard';
import { AuthSuccessIcon } from '@/components/auth/AuthResultIcons';
import { AuthPrimaryLink } from '@/components/auth/AuthPrimaryLink';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { isStrongPassword } from '@/components/auth/password-rules';

export default function ResetPasswordPage() {
  return (
    <AuthSuspenseBoundary>
      <ResetPasswordInner />
    </AuthSuspenseBoundary>
  );
}

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isPasswordValid = isStrongPassword(password);

  if (!token) {
    return (
      <AuthResultCard title="Invalid link">
        <p className="text-sm text-surface-500 font-semibold">
          This reset link is missing or malformed.
        </p>
        <Link href="/forgot-password" className="block text-sm text-[#1CB0F6] font-bold mt-4">
          Request a new reset link
        </Link>
      </AuthResultCard>
    );
  }

  if (success) {
    return (
      <AuthResultCard title="Password updated" icon={<AuthSuccessIcon />} iconBgClass="bg-green-50">
        <p className="text-sm text-surface-500 font-semibold">
          Your password has been reset. You can now sign in.
        </p>
        <AuthPrimaryLink href="/login">SIGN IN</AuthPrimaryLink>
      </AuthResultCard>
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
