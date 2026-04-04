'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function EmailVerificationBanner() {
  const { status } = useSession();
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    // Check verification status once per session
    const dismissed = sessionStorage.getItem('email-verify-dismissed');
    if (dismissed) return;

    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.emailVerified === false || data.emailVerified === null) {
          setShow(true);
        }
      })
      .catch(() => {});
  }, [status]);

  if (!show) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await fetch('/api/auth/send-verification', { method: 'POST' });
      setSent(true);
    } catch {
      // Silent fail — user can retry
    } finally {
      setSending(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('email-verify-dismissed', '1');
    setShow(false);
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 flex items-center gap-3 text-sm">
      <span className="text-amber-700 dark:text-amber-400 font-semibold flex-1">
        {sent
          ? 'Verification email sent! Check your inbox.'
          : 'Please verify your email to secure your account.'}
      </span>
      {!sent && (
        <button
          onClick={handleResend}
          disabled={sending}
          className="text-amber-800 dark:text-amber-300 font-bold text-xs hover:underline disabled:opacity-50 shrink-0"
        >
          {sending ? 'Sending...' : 'Resend'}
        </button>
      )}
      <button
        onClick={handleDismiss}
        className="text-amber-400 hover:text-amber-600 shrink-0"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
