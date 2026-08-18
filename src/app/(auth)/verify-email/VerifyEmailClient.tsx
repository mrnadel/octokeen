'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthSuspenseBoundary } from '@/components/auth/AuthSuspenseBoundary';
import { AuthResultCard } from '@/components/auth/AuthResultCard';
import { AuthSuccessIcon, AuthFailureIcon } from '@/components/auth/AuthResultIcons';
import { AuthPrimaryLink } from '@/components/auth/AuthPrimaryLink';

export default function VerifyEmailPage() {
  return (
    <AuthSuspenseBoundary>
      <VerifyEmailInner />
    </AuthSuspenseBoundary>
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
      <AuthResultCard title="Email verified" icon={<AuthSuccessIcon />} iconBgClass="bg-green-50">
        <p className="text-sm text-surface-500 font-semibold">
          Your email has been confirmed. You&apos;re all set!
        </p>
        <AuthPrimaryLink href="/">CONTINUE</AuthPrimaryLink>
      </AuthResultCard>
    );
  }

  return (
    <AuthResultCard title="Verification failed" icon={<AuthFailureIcon />} iconBgClass="bg-red-50">
      <p className="text-sm text-surface-500 font-semibold">{errorMsg}</p>
      <Link href="/login" className="block text-sm text-[#1CB0F6] font-bold mt-4">
        Back to sign in
      </Link>
    </AuthResultCard>
  );
}
