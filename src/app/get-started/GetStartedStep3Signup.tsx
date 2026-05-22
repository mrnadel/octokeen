'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';
import { Mascot } from '@/components/ui/Mascot';
import { PasswordStrength } from '@/components/ui/PasswordStrength';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

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

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

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
  return (
    <motion.div
      key="signup"
      custom={direction}
      variants={slideVariants}
      initial="enter" animate="center" exit="exit"
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="max-w-sm mx-auto w-full"
    >
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="flex justify-center mb-3"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
        >
          <div className="relative">
            <div className="absolute inset-0 scale-150 rounded-full bg-primary-400/10 dark:bg-primary-500/10 blur-2xl" />
            <Mascot pose="excited" size={90} />
          </div>
        </motion.div>
        <h2 className="text-2xl font-black text-surface-900 dark:text-white mb-1">Save your progress</h2>
        <p className="text-surface-500 dark:text-surface-400 text-sm font-semibold">Create a free account to start learning</p>
      </motion.div>

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
        <button type="submit" disabled={loading || password.length < PASSWORD_MIN_LENGTH}
          className={cn('w-full py-3.5 rounded-2xl font-extrabold text-base transition-all active:translate-y-[2px]',
            loading || password.length < PASSWORD_MIN_LENGTH ? 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed' : 'bg-primary-500 text-white')}
          style={{ boxShadow: loading || password.length < PASSWORD_MIN_LENGTH ? 'none' : '0 5px 0 #0F766E' }}>
          {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Creating account...</span> : 'CREATE ACCOUNT'}
        </button>
      </form>

      <p className="text-center text-surface-500 dark:text-surface-400 text-sm font-semibold mt-5">
        Already have an account?{' '}<Link href="/login" className="text-primary-500 font-bold">Log in</Link>
      </p>
    </motion.div>
  );
}
