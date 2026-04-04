'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="h-6" />}>
      <VerifyEmailInner />
    </Suspense>
  );
}

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Missing verification token.');
      return;
    }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus('success');
        } else {
          const data = await res.json();
          setErrorMsg(data.error || 'Verification failed.');
          setStatus('error');
        }
      })
      .catch(() => {
        setErrorMsg('Something went wrong. Please try again.');
        setStatus('error');
      });
  }, [token]);

  if (status === 'verifying') {
    return (
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-surface-500 font-semibold">Verifying your email...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-black text-surface-900">Email verified</h1>
        <p className="text-sm text-surface-500 font-semibold">
          Your email has been confirmed. You're all set!
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-extrabold rounded-2xl transition-all text-[17px]"
          style={{ boxShadow: '0 5px 0 #0F766E' }}
        >
          CONTINUE
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-xl font-black text-surface-900">Verification failed</h1>
      <p className="text-sm text-surface-500 font-semibold">{errorMsg}</p>
      <Link href="/login" className="block text-sm text-[#1CB0F6] font-bold mt-4">
        Back to sign in
      </Link>
    </div>
  );
}
