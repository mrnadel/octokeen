'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthResultCard } from '@/components/auth/AuthResultCard';
import { AuthMailIcon } from '@/components/auth/AuthResultIcons';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthResultCard title="Check your email" icon={<AuthMailIcon />} iconBgClass="bg-primary-50">
        <p className="text-sm text-surface-500 font-semibold">
          If an account exists with <span className="text-surface-700">{email}</span>,
          we sent a reset link. It expires in 15 minutes.
        </p>
        <p className="text-xs text-surface-400 font-semibold pt-2">
          Didn&apos;t get it? Check your spam folder or{' '}
          <button
            onClick={() => { setSent(false); setError(''); }}
            className="text-[#1CB0F6] font-bold"
          >
            try again
          </button>
        </p>
        <Link href="/login" className="block text-sm text-[#1CB0F6] font-bold mt-6">
          Back to sign in
        </Link>
      </AuthResultCard>
    );
  }

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-black text-surface-900 mb-2">Reset password</h1>
      <p className="text-sm text-surface-400 font-semibold mb-6">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <ErrorAlert message={error || null} />

        <label htmlFor="forgot-email" className="sr-only">Email</label>
        <AuthInput
          id="forgot-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(v) => { setEmail(v); setError(''); }}
          required
          autoComplete="email"
          autoFocus
        />

        <AuthButton loading={loading} disabled={loading || !email}>
          {loading ? 'Sending...' : 'SEND RESET LINK'}
        </AuthButton>
      </form>

      <p className="text-center text-surface-400 text-sm font-semibold mt-8">
        Remember your password?{' '}
        <Link href="/login" className="text-[#1CB0F6] font-bold">
          Sign in
        </Link>
      </p>
    </>
  );
}
