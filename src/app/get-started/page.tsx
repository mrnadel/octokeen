'use client';

import { useState, useCallback, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analytics } from '@/lib/mixpanel';
import Link from 'next/link';
import { ProfessionPicker } from '@/components/profession/ProfessionPicker';
import { useCourseStore } from '@/store/useCourseStore';
import { useStore } from '@/store/useStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { getProfession, PROFESSIONS, PROFESSION_ID } from '@/data/professions';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';
import { getCourseMetaForProfession } from '@/data/course/course-meta';
import type { CourseIntroData } from '@/data/course/types';
import { Mascot } from '@/components/ui/Mascot';
import { OnboardingPlacementTest } from '@/components/course/OnboardingPlacementTest';

/* ─── Constants ─── */

const TOTAL_STEPS = 5;

/* ─── Animation Variants ─── */

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

/* ─── Password Strength ─── */

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: `${PASSWORD_MIN_LENGTH}+ chars`, met: password.length >= PASSWORD_MIN_LENGTH },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
  ];
  if (!password) return null;
  const score = checks.filter((c) => c.met).length;
  return (
    <div className="space-y-2 pt-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 sm:h-1 flex-1 rounded-full transition-colors',
              i <= score
                ? score === 3 ? 'bg-primary-500' : score === 2 ? 'bg-primary-400' : 'bg-red-400'
                : 'bg-surface-200 dark:bg-surface-700'
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {checks.map((check) => (
          <span key={check.label} className={cn('text-xs font-bold', check.met ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500')}>
            {check.met ? '✓' : '•'} {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Google Icon ─── */

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

/* ─── Main Component ─── */

export default function GetStartedPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Profession selection
  const publicProfessions = PROFESSIONS.filter(p => !p.requiresAccess);
  const setActiveProfession = useCourseStore((s) => s.setActiveProfession);
  const [selectedProfession, setSelectedProfession] = useState<string>(publicProfessions[0]?.id ?? '');

  // Placement state
  const [placedUnitIndex, setPlacedUnitIndex] = useState(0);
  const [testStartFraction, setTestStartFraction] = useState(0);
  // Track experience level choice for CourseIntroData (0=new, 1=little, 2=fair, 3=lot)
  const [selfAssessLevel, setSelfAssessLevel] = useState<0 | 1 | 2 | 3>(0);

  // Navigation loading
  const [navigating, setNavigating] = useState(false);

  // Account creation
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const nextStep = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setStep((s) => {
      // From signup (step 3) or placement test (step 2), always go back to level selection (step 1)
      if (s === 2 || s === 3) return 1;
      return Math.max(s - 1, 0);
    });
  }, []);

  // Placement test complete: advance to signup step
  const handlePlacementComplete = useCallback((unitIndex: number) => {
    setPlacedUnitIndex(unitIndex);
    setDirection(1);
    setStep(3);
  }, []);

  const handlePlacementExit = useCallback(() => {
    setDirection(-1);
    setStep(1);
  }, []);

  // "I'm new" handler: skip test, place at unit 0
  const handleNewUser = () => {
    setSelfAssessLevel(0);
    setPlacedUnitIndex(0);
    setDirection(1);
    setStep(3);
  };

  // Level option handler: set the starting range and go to placement test
  const handleLevelChoice = (startFraction: number) => {
    const levelMap: Record<number, 0 | 1 | 2 | 3> = { 0: 1, 0.3: 2, 0.6: 3 };
    setSelfAssessLevel(levelMap[startFraction] ?? 1);
    setTestStartFraction(startFraction);
    nextStep();
  };

  const handleProfessionContinue = () => {
    setActiveProfession(selectedProfession);
    nextStep();
  };

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

      const result = await signIn('credentials', { email, password, redirect: false });

      if (result?.error) {
        setError('Account created but login failed. Try signing in.');
        setLoading(false);
      } else {
        nextStep();
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      analytics.error({ action: 'signup', message: 'Registration request failed', source: 'get_started' });
      setLoading(false);
    }
  };

  // Build CourseIntroData from the get-started flow so the home page
  // doesn't re-show the questionnaire after signup.
  const buildIntroData = useCallback((): CourseIntroData => ({
    experienceLevel: selfAssessLevel,
    placementChoice: selfAssessLevel === 0 ? 'scratch' : 'test',
    goal: 'interview',
    dailyMinutes: 10,
    completedAt: new Date().toISOString(),
    placementDone: true,
  }), [selfAssessLevel]);

  // Reset user-specific stores so stale localStorage from previous sessions
  // doesn't trigger false streak-break / comeback / welcome-back popups.
  const resetStoresForNewUser = useCallback(() => {
    useStore.getState().resetProgress();
    useEngagementStore.setState({
      dailyQuests: [],
      weeklyQuests: [],
      dailyQuestDate: null,
      weeklyQuestDate: null,
      dailyChestClaimed: false,
      weeklyChestClaimed: false,
      streak: {
        freezesOwned: 0,
        freezeUsedToday: false,
        lastStreakBreakDate: null,
        lastStreakValueBeforeBreak: 0,
        repairAvailable: false,
        milestonesReached: [],
      },
      comeback: {
        isInComebackFlow: false,
        comebackQuestsCompleted: 0,
        daysAway: 0,
        lastDismissedDate: null,
      },
      dismissedNudges: [],
      doubleXpExpiry: null,
    });
    useCourseStore.setState((s) => ({
      progress: {
        ...s.progress,
        completedLessons: {},
        currentStreak: 0,
        courseIntros: {},
      },
    }));
  }, []);

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    analytics.auth({ action: 'signup', method: 'google' });
    resetStoresForNewUser();
    // Mark intro as completed so home page doesn't re-show the questionnaire
    useCourseStore.getState().completeCourseIntro(selectedProfession, buildIntroData());
    // Save placement before redirecting
    try {
      sessionStorage.setItem(
        STORAGE_KEYS.PLACEMENT,
        JSON.stringify({ professionId: selectedProfession, unitIndex: placedUnitIndex })
      );
    } catch {}
    signIn('google', { callbackUrl: '/' });
  };

  const completeOnboarding = () => {
    if (navigating) return;
    setNavigating(true);
    resetStoresForNewUser();
    // Mark intro as completed so home page doesn't re-show the questionnaire
    useCourseStore.getState().completeCourseIntro(selectedProfession, buildIntroData());
    setActiveProfession(selectedProfession);
    // Apply placement: unlock units up to placed unit (without marking lessons as done)
    if (placedUnitIndex > 0) {
      useCourseStore.setState((s) => ({
        progress: { ...s.progress, placementUnitIndex: placedUnitIndex },
      }));
    }
    analytics.milestone({ type: 'onboarding_completed' });
    window.location.href = '/';
  };

  const canGoBack = step > 0 && step < TOTAL_STEPS - 1;

  // Get the placed unit name for the ready screen
  const meta = getCourseMetaForProfession(selectedProfession);
  const placedUnitName = meta[placedUnitIndex]?.title ?? `Unit ${placedUnitIndex + 1}`;

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] dark:bg-surface-950 flex flex-col">
      {/* Loading Overlay */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#FAFAFA] dark:bg-surface-950 flex flex-col items-center justify-center gap-4"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <p className="text-lg font-black text-surface-900 dark:text-white">Preparing your course...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-1.5 max-w-lg mx-auto">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 rounded-full flex-1 transition-all duration-500',
                i < step ? 'bg-primary-500' : i === step ? 'bg-primary-500/60' : 'bg-surface-200 dark:bg-surface-700'
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 max-w-lg mx-auto">
          {canGoBack ? (
            <button onClick={prevStep} className="flex items-center gap-1 text-sm font-bold text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}
          <span className="text-xs font-bold text-surface-400 dark:text-surface-600 tabular-nums">{step + 1} / {TOTAL_STEPS}</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-4 sm:px-5 flex flex-col justify-center pb-4 sm:pb-8">
        <AnimatePresence mode="wait" custom={direction}>

          {/* Step 0: Choose Course */}
          {step === 0 && (
            <motion.div
              key="profession"
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="max-w-lg mx-auto w-full"
            >
              {/* Mascot + heading */}
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
                    <Mascot pose="winking" size={100} />
                  </div>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-1.5">
                  What do you want to learn?
                </h2>
                <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base font-semibold">
                  Pick a course to get started
                </p>
              </motion.div>

              <ProfessionPicker
                selectedId={selectedProfession}
                onSelect={setSelectedProfession}
                filterOut={[PROFESSION_ID.MECHANICAL_ENGINEERING]}
              />

              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleProfessionContinue}
                  disabled={!selectedProfession}
                  className={cn(
                    'w-full py-3.5 rounded-2xl font-extrabold text-base transition-all active:translate-y-[2px]',
                    selectedProfession ? 'bg-primary-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed'
                  )}
                  style={{ boxShadow: selectedProfession ? '0 5px 0 #0F766E' : 'none' }}
                >
                  CONTINUE
                </button>
              </motion.div>

              <p className="text-center text-surface-500 dark:text-surface-400 text-sm font-semibold mt-5">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-500 font-bold">Log in</Link>
              </p>
            </motion.div>
          )}

          {/* Step 1: "Already know some?" prompt */}
          {step === 1 && (
            <motion.div
              key="know-some"
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="max-w-lg mx-auto w-full"
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
                    <Mascot pose="thinking" size={100} />
                  </div>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-1.5">
                  Already know some {getProfession(selectedProfession)?.name ?? 'of this'}?
                </h2>
                <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base font-semibold">
                  Take a quick test to find your starting level, or begin from scratch.
                </p>
              </motion.div>

              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  { emoji: '\uD83C\uDF31', label: "I'm new to this", desc: 'Start from the basics', action: () => handleNewUser() },
                  { emoji: '\uD83D\uDCA1', label: 'I know a little', desc: 'Test me on the early stuff', action: () => handleLevelChoice(0) },
                  { emoji: '\uD83D\uDCDA', label: 'I know a fair amount', desc: 'Test me on intermediate topics', action: () => handleLevelChoice(0.3) },
                  { emoji: '\uD83C\uDFAF', label: 'I know a lot', desc: 'Challenge me with advanced topics', action: () => handleLevelChoice(0.6) },
                ].map((opt, i) => (
                  <motion.button
                    key={opt.label}
                    onClick={opt.action}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-2xl border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/30 dark:hover:bg-primary-950/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800 text-2xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 transition-colors">
                        {opt.emoji}
                      </span>
                      <div>
                        <p className="text-base font-black text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {opt.label}
                        </p>
                        <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Placement Test — shared component */}
          {step === 2 && (
            <OnboardingPlacementTest
              professionId={selectedProfession}
              startFraction={testStartFraction}
              onComplete={handlePlacementComplete}
              onExit={handlePlacementExit}
            />
          )}

          {/* Step 3: Create Account */}
          {step === 3 && (
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
                onClick={handleGoogleSignIn}
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

              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-xl text-danger-600 dark:text-danger-400 text-sm text-center font-semibold">{error}</div>
                )}
                <input type="text" placeholder="Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required minLength={2} maxLength={50}
                  className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-2xl text-surface-900 dark:text-white font-semibold placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-surface-800 transition-colors" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-2xl text-surface-900 dark:text-white font-semibold placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-surface-800 transition-colors" />
                <div>
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={PASSWORD_MIN_LENGTH}
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
          )}

          {/* Step 4: Ready */}
          {step === 4 && (
            <motion.div
              key="ready"
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="text-center max-w-sm mx-auto w-full"
            >
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mb-4 flex justify-center">
                <Mascot pose="celebrating" size={140} />
              </motion.div>

              <motion.h2 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                You&apos;re all set!
              </motion.h2>

              {placedUnitIndex > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500/10 dark:bg-primary-500/20 mb-3">
                    <span className="text-lg">{meta[placedUnitIndex]?.icon ?? '\uD83C\uDFAF'}</span>
                    <span className="text-base font-black text-primary-600 dark:text-primary-400">
                      Unit {placedUnitIndex + 1}{placedUnitName !== `Unit ${placedUnitIndex + 1}` ? `: ${placedUnitName}` : ''}
                    </span>
                  </div>
                  <p className="text-surface-500 dark:text-surface-400 text-sm font-semibold leading-relaxed">
                    You placed into Unit {placedUnitIndex + 1}! We skipped {placedUnitIndex} {placedUnitIndex === 1 ? 'unit' : 'units'} based on your test.
                  </p>
                </motion.div>
              ) : (
                <motion.p className="text-surface-500 dark:text-surface-400 text-base mb-6 leading-relaxed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  Dive in and master {getProfession(selectedProfession)?.name ?? 'your course'}!
                </motion.p>
              )}

              <motion.button
                onClick={completeOnboarding}
                disabled={navigating}
                className="w-full py-4 rounded-2xl bg-primary-500 text-white font-extrabold text-lg transition-all active:translate-y-[2px] disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ boxShadow: navigating ? 'none' : '0 5px 0 #0F766E' }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.98 }}
              >
                {navigating ? <><Loader2 className="w-5 h-5 animate-spin" />Loading your course...</> : 'START LEARNING'}
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

