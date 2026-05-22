'use client';

import { useState } from 'react';
import Link from 'next/link';

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
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-black text-surface-900">Check your email</h1>
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
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-black text-surface-900 mb-2">Reset password</h1>
      <p className="text-sm text-surface-400 font-semibold mb-6">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <label htmlFor="forgot-email" className="sr-only">Email</label>
        <input
          id="forgot-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          className="w-full px-4 py-3.5 bg-surface-50 border-2 border-surface-200 rounded-2xl text-surface-900 font-semibold placeholder-surface-300 focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
        />

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-200 disabled:shadow-none disabled:translate-y-0 text-white font-extrabold rounded-2xl transition-all text-[17px] tracking-wide active:translate-y-[2px]"
          style={{
            boxShadow: loading || !email ? 'none' : '0 5px 0 #0F766E',
          }}
        >
          {loading ? 'Sending...' : 'SEND RESET LINK'}
        </button>
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
