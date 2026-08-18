'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { isStrongPassword } from '@/components/auth/password-rules';

import { slideVariants, slideTransition } from './getStartedAnimation';
import { GetStartedStepHeading } from './GetStartedStepHeading';

interface Props {
  displayName: string;
  email: string;
  password: string;
  error: string;
  loading: boolean;
  googleLoading: boolean;
  direction: number;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
}


export function GetStartedStep3Signup({
  displayName,
  email,
  password,
  error,
  loading,
  googleLoading,
  direction,
  onDisplayNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleSignIn,
}: Props) {
  // Gate on the same rules the server enforces, so the button never enables
  // for a password `/api/auth/register` will reject.
  const submitDisabled = loading || !isStrongPassword(password);

  return (
    <motion.div
      key="signup"
      custom={direction}
      variants={slideVariants}
      initial="enter" animate="center" exit="exit"
      transition={slideTransition}
      className="max-w-sm mx-auto w-full"
    >
      <GetStartedStepHeading
        compact
        pose="excited"
        mascotSize={90}
        title="Save your progress"
        subtitle="Create a free account to start learning"
      />

      <button
        onClick={onGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white dark:bg-surface-900 border-2 border-surface-200 dark:border-surface-700 rounded-2xl text-surface-700 dark:text-surface-200 font-bold hover:border-surface-300 dark:hover:border-surface-600 disabled:opacity-60 transition-colors mb-4"
      >
        {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
        <span className="text-xs font-bold text-surface-400 dark:text-surface-600 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {error && (
          <div className="p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-xl text-danger-600 dark:text-danger-400 text-sm text-center font-semibold">{error}</div>
        )}
        <input type="text" placeholder="Name" value={displayName} onChange={(e) => onDisplayNameChange(e.target.value)} required minLength={2} maxLength={50}
          className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-2xl text-surface-900 dark:text-white font-semibold placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-surface-800 transition-colors" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => onEmailChange(e.target.value)} required
          className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-2xl text-surface-900 dark:text-white font-semibold placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-surface-800 transition-colors" />
        <div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => onPasswordChange(e.target.value)} required minLength={PASSWORD_MIN_LENGTH}
            className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-2xl text-surface-900 dark:text-white font-semibold placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-surface-800 transition-colors" />
          <PasswordStrength password={password} />
        </div>
        <button type="submit" disabled={submitDisabled}
          className={cn('w-full py-3.5 rounded-2xl font-extrabold text-base transition-all active:translate-y-[2px]',
            submitDisabled ? 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed' : 'bg-primary-500 text-white')}
          style={{ boxShadow: submitDisabled ? 'none' : '0 5px 0 #0F766E' }}>
          {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Creating account...</span> : 'CREATE ACCOUNT'}
        </button>
      </form>

      <p className="text-center text-surface-500 dark:text-surface-400 text-sm font-semibold mt-5">
        Already have an account?{' '}<Link href="/login" className="text-primary-500 font-bold">Log in</Link>
      </p>
    </motion.div>
  );
}
