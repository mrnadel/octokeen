'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analytics } from '@/lib/mixpanel';
import { useCourseStore } from '@/store/useCourseStore';
import { useStore } from '@/store/useStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { PROFESSIONS } from '@/data/professions';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';
import { getCourseMetaForProfession } from '@/data/course/course-meta';
import type { CourseIntroData } from '@/data/course/types';
import { OnboardingPlacementTest } from '@/components/course/OnboardingPlacementTest';
import { GetStartedStep0Profession } from './GetStartedStep0Profession';
import { GetStartedStep1LevelChoice } from './GetStartedStep1LevelChoice';
import { GetStartedStep3Signup } from './GetStartedStep3Signup';
import { GetStartedStep4Ready } from './GetStartedStep4Ready';

/* ─── Constants ─── */

const TOTAL_STEPS = 5;

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
    placementUnitIndex: placedUnitIndex > 0 ? placedUnitIndex : undefined,
  }), [selfAssessLevel, placedUnitIndex]);

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
            <GetStartedStep0Profession
              selectedProfession={selectedProfession}
              onSelect={setSelectedProfession}
              onContinue={handleProfessionContinue}
              direction={direction}
            />
          )}

          {/* Step 1: "Already know some?" prompt */}
          {step === 1 && (
            <GetStartedStep1LevelChoice
              selectedProfession={selectedProfession}
              onNewUser={handleNewUser}
              onLevelChoice={handleLevelChoice}
              direction={direction}
            />
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
            <GetStartedStep3Signup
              displayName={displayName}
              email={email}
              password={password}
              error={error}
              loading={loading}
              googleLoading={googleLoading}
              direction={direction}
              onDisplayNameChange={setDisplayName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
              onGoogleSignIn={handleGoogleSignIn}
            />
          )}

          {/* Step 4: Ready */}
          {step === 4 && (
            <GetStartedStep4Ready
              selectedProfession={selectedProfession}
              placedUnitIndex={placedUnitIndex}
              placedUnitName={placedUnitName}
              meta={meta}
              navigating={navigating}
              direction={direction}
              onComplete={completeOnboarding}
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
