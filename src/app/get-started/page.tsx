'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  ArrowLeft,
  Heart,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analytics } from '@/lib/mixpanel';
import Link from 'next/link';
import { ProfessionPicker } from '@/components/profession/ProfessionPicker';
import { useCourseStore } from '@/store/useCourseStore';
import { getProfession, PROFESSIONS } from '@/data/professions';

/* ─── Trial Questions (universal, fun) ─── */

const TRIAL_QUESTIONS = [
  {
    topic: 'Money Smarts',
    topicIcon: '💰',
    question: 'You have $1,000 in a savings account earning 5% interest per year. After one year, you have:',
    options: [
      { id: 'a', text: 'Exactly $1,050' },
      { id: 'b', text: 'Less than $1,050 after inflation' },
      { id: 'c', text: 'More than $1,050 from compound interest' },
      { id: 'd', text: '$1,005' },
    ],
    correctAnswer: 'a',
    explanation: 'Simple interest on $1,000 at 5% = $50. So you\'d have exactly $1,050 after one year. Compound interest kicks in from year two onward.',
  },
  {
    topic: 'Psychology',
    topicIcon: '🧠',
    question: 'You bought a movie ticket for $15 but the movie is terrible. Should you stay to "get your money\'s worth"?',
    options: [
      { id: 'a', text: 'Yes — you already paid, might as well watch it' },
      { id: 'b', text: 'No — the $15 is gone either way, leaving saves your time' },
    ],
    correctAnswer: 'b',
    explanation: 'This is the "sunk cost fallacy." The $15 is spent whether you stay or leave. The rational choice is to use your time on something better.',
  },
  {
    topic: 'Everyday Science',
    topicIcon: '🔬',
    question: 'Why does your phone battery drain faster in cold weather?',
    options: [
      { id: 'a', text: 'Cold slows the chemical reactions inside the battery' },
      { id: 'b', text: 'The screen uses more power to stay warm' },
      { id: 'c', text: 'Cold air blocks the wireless signal' },
      { id: 'd', text: 'The processor speeds up to generate heat' },
    ],
    correctAnswer: 'a',
    explanation: 'Lithium-ion batteries rely on chemical reactions to produce electricity. Cold temperatures slow these reactions, reducing available power and making the battery appear to drain faster.',
  },
  {
    topic: 'Space',
    topicIcon: '🚀',
    question: 'If the Sun suddenly disappeared, how long until we\'d notice?',
    options: [
      { id: 'a', text: 'Instantly' },
      { id: 'b', text: 'About 8 minutes' },
      { id: 'c', text: 'About 24 hours' },
      { id: 'd', text: 'About 1 second' },
    ],
    correctAnswer: 'b',
    explanation: 'Light takes about 8 minutes and 20 seconds to travel from the Sun to Earth. We\'d see sunlight (and feel gravity) for another 8 minutes before everything went dark.',
  },
];

const TRIAL_COUNT = 3;
const XP_CORRECT = 25;
const XP_WRONG = 5;
const STARTING_HEARTS = 3;
const TOTAL_STEPS = 4;

/* ─── Animation Variants ─── */

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

/* ─── Password Strength ─── */

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars', met: password.length >= 8 },
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
                : 'bg-gray-200'
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {checks.map((check) => (
          <span key={check.label} className={cn('text-xs font-bold', check.met ? 'text-primary-500' : 'text-gray-300')}>
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

/* ─── Hearts Display ─── */

function HeartsBar({ hearts, max }: { hearts: number; max: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Heart
          key={i}
          className={cn(
            'w-5 h-5 transition-all',
            i < hearts
              ? 'fill-red-500 text-red-500'
              : 'fill-gray-200 text-gray-200'
          )}
        />
      ))}
    </div>
  );
}

/* ─── Out of Hearts Modal ─── */

function OutOfHeartsModal({ onRefill }: { onRefill: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl"
      >
        <div className="flex justify-center gap-1 mb-4">
          {[0, 1, 2].map((i) => (
            <Heart key={i} className="w-8 h-8 fill-gray-200 text-gray-200" />
          ))}
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Out of hearts!</h3>
        <p className="text-gray-500 text-sm font-semibold mb-6 leading-relaxed">
          No worries. Tap below to refill your hearts for free and keep practicing.
        </p>
        <button
          onClick={onRefill}
          className="w-full py-3.5 rounded-2xl bg-primary-500 text-white font-extrabold text-base transition-all active:translate-y-[2px]"
          style={{ boxShadow: '0 5px 0 #0F766E' }}
        >
          REFILL HEARTS FOR FREE
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ─── */

export default function GetStartedPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Profession selection — filter out requiresAccess courses
  const publicProfessions = PROFESSIONS.filter(p => !p.requiresAccess);
  const setActiveProfession = useCourseStore((s) => s.setActiveProfession);
  const [selectedProfession, setSelectedProfession] = useState<string>(publicProfessions[0]?.id ?? '');

  // Trial questions (3 random from pool)
  const [trialQuestions] = useState(() => {
    const shuffled = [...TRIAL_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, TRIAL_COUNT);
  });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [trialAnswer, setTrialAnswer] = useState<string | null>(null);
  const [trialRevealed, setTrialRevealed] = useState(false);
  const [trialXp, setTrialXp] = useState(0);
  const [trialCorrect, setTrialCorrect] = useState(0);
  const [trialDone, setTrialDone] = useState(false);

  // Hearts
  const [hearts, setHearts] = useState(STARTING_HEARTS);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);

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
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleTrialAnswer = (optionId: string) => {
    if (trialRevealed || showOutOfHearts) return;
    setTrialAnswer(optionId);
    setTrialRevealed(true);
    const isCorrect = optionId === trialQuestions[questionIndex].correctAnswer;
    setTrialXp((prev) => prev + (isCorrect ? XP_CORRECT : XP_WRONG));
    if (isCorrect) {
      setTrialCorrect((prev) => prev + 1);
    } else {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        // Show modal after a brief delay so user sees the wrong answer feedback first
        setTimeout(() => setShowOutOfHearts(true), 800);
      }
    }
  };

  const handleRefillHearts = () => {
    setHearts(STARTING_HEARTS);
    setShowOutOfHearts(false);
  };

  const handleNextTrialQuestion = () => {
    if (questionIndex + 1 >= TRIAL_COUNT) {
      setTrialDone(true);
    } else {
      setQuestionIndex((prev) => prev + 1);
      setTrialAnswer(null);
      setTrialRevealed(false);
    }
  };

  const handleTrialContinue = () => {
    try {
      sessionStorage.setItem('octokeen-guest-xp', JSON.stringify({ xp: trialXp }));
    } catch {}
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

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    analytics.auth({ action: 'signup', method: 'google' });
    if (trialXp > 0) {
      try { sessionStorage.setItem('octokeen-guest-xp', JSON.stringify({ xp: trialXp })); } catch {}
    }
    signIn('google', { callbackUrl: '/' });
  };

  const handleProfessionContinue = () => {
    setActiveProfession(selectedProfession);
    nextStep();
  };

  const completeOnboarding = () => {
    if (navigating) return;
    setNavigating(true);
    setActiveProfession(selectedProfession);
    analytics.milestone({ type: 'onboarding_completed' });
    window.location.href = '/';
  };

  const canGoBack = step > 0 && step < TOTAL_STEPS - 1;

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      {/* ── Out of Hearts Modal ── */}
      <AnimatePresence>
        {showOutOfHearts && <OutOfHeartsModal onRefill={handleRefillHearts} />}
      </AnimatePresence>

      {/* ── Loading Overlay ── */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-4"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <p className="text-lg font-black text-gray-900">Preparing your course...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Progress Bar ── */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-1.5 max-w-lg mx-auto">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 rounded-full flex-1 transition-all duration-500',
                i < step ? 'bg-primary-500' : i === step ? 'bg-primary-500/60' : 'bg-gray-100'
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 max-w-lg mx-auto">
          {canGoBack ? (
            <button onClick={prevStep} className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}
          <span className="text-xs font-bold text-gray-300 tabular-nums">{step + 1} / {TOTAL_STEPS}</span>
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="flex-1 px-4 sm:px-5 flex flex-col justify-center pb-4 sm:pb-8">
        <AnimatePresence mode="wait" custom={direction}>

          {/* ═══ Step 0: Choose Course ═══ */}
          {step === 0 && (
            <motion.div
              key="profession"
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
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                  What do you want to learn?
                </h2>
                <p className="text-gray-400 text-sm sm:text-base font-semibold">
                  Pick a course to get started
                </p>
              </motion.div>

              <ProfessionPicker
                selectedId={selectedProfession}
                onSelect={setSelectedProfession}
                filterOut={['mechanical-engineering']}
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
                    selectedProfession ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                  style={{ boxShadow: selectedProfession ? '0 5px 0 #0F766E' : 'none' }}
                >
                  CONTINUE
                </button>
              </motion.div>

              <p className="text-center text-gray-400 text-sm font-semibold mt-5">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-500 font-bold">Log in</Link>
              </p>
            </motion.div>
          )}

          {/* ═══ Step 1: Trial Questions with Hearts ═══ */}
          {step === 1 && (
            <motion.div
              key="trial"
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="max-w-lg mx-auto w-full"
            >
              {!trialDone ? (
                <>
                  {/* Progress header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      Question {questionIndex + 1} / {TRIAL_COUNT}
                    </span>
                    <div className="flex items-center gap-4">
                      {trialXp > 0 && (
                        <motion.span
                          key={trialXp}
                          initial={{ scale: 1.4 }}
                          animate={{ scale: 1 }}
                          className="text-xs font-black text-primary-500 flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          {trialXp} XP
                        </motion.span>
                      )}
                      <HeartsBar hearts={hearts} max={STARTING_HEARTS} />
                    </div>
                  </div>

                  {/* Question card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={questionIndex}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Question */}
                      <div className="bg-gray-50 rounded-2xl px-5 py-4 mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{trialQuestions[questionIndex].topicIcon}</span>
                          <span className="text-xs font-black text-primary-500 uppercase tracking-wider">
                            {trialQuestions[questionIndex].topic}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                          {trialQuestions[questionIndex].question}
                        </h2>
                      </div>

                      {/* Options */}
                      <div className="space-y-2.5 mb-5">
                        {trialQuestions[questionIndex].options.map((opt, idx) => {
                          const isCorrect = opt.id === trialQuestions[questionIndex].correctAnswer;
                          const isSelected = trialAnswer === opt.id;
                          let optionStyle = 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50';
                          if (trialRevealed) {
                            if (isCorrect) optionStyle = 'border-primary-500 bg-primary-500/5';
                            else if (isSelected && !isCorrect) optionStyle = 'border-red-400 bg-red-50';
                            else optionStyle = 'border-gray-100 bg-gray-50 opacity-60';
                          } else if (isSelected) {
                            optionStyle = 'border-primary-400 bg-primary-50';
                          }

                          return (
                            <motion.button
                              key={opt.id}
                              onClick={() => handleTrialAnswer(opt.id)}
                              disabled={trialRevealed}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 + idx * 0.04 }}
                              className={cn(
                                'w-full flex items-start gap-3 p-3.5 min-h-[48px] rounded-xl border-2 transition-all text-left',
                                optionStyle
                              )}
                            >
                              <span className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5',
                                trialRevealed && isCorrect ? 'bg-primary-500 text-white'
                                  : trialRevealed && isSelected && !isCorrect ? 'bg-red-400 text-white'
                                  : 'bg-gray-100 text-gray-500'
                              )}>
                                {trialRevealed && isCorrect ? '✓' : trialRevealed && isSelected && !isCorrect ? '✗' : opt.id.toUpperCase()}
                              </span>
                              <span className="text-sm font-semibold text-gray-700 leading-snug">{opt.text}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Explanation + Next */}
                      <AnimatePresence>
                        {trialRevealed && !showOutOfHearts && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className={cn(
                              'p-4 rounded-xl mb-5',
                              trialAnswer === trialQuestions[questionIndex].correctAnswer
                                ? 'bg-primary-500/10 border border-primary-500/20'
                                : 'bg-orange-50 border border-orange-200'
                            )}>
                              <p className={cn(
                                'font-black text-sm mb-1',
                                trialAnswer === trialQuestions[questionIndex].correctAnswer ? 'text-primary-500' : 'text-orange-600'
                              )}>
                                {trialAnswer === trialQuestions[questionIndex].correctAnswer
                                  ? `🎉 Correct! +${XP_CORRECT} XP`
                                  : `💡 Good try! +${XP_WRONG} XP`}
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {trialQuestions[questionIndex].explanation}
                              </p>
                            </div>

                            <button
                              onClick={handleNextTrialQuestion}
                              className="w-full py-3.5 rounded-2xl bg-primary-500 text-white font-extrabold text-base transition-all active:translate-y-[2px]"
                              style={{ boxShadow: '0 5px 0 #0F766E' }}
                            >
                              {questionIndex + 1 >= TRIAL_COUNT ? 'SEE YOUR RESULTS' : 'NEXT QUESTION'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </AnimatePresence>
                </>
              ) : (
                /* ─── Trial Results ─── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="text-5xl mb-4"
                  >
                    {trialCorrect === TRIAL_COUNT ? '\uD83C\uDF89' : '\uD83D\uDCAA'}
                  </motion.div>

                  <motion.h2
                    className="text-2xl sm:text-3xl font-black text-gray-900 mb-2"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  >
                    Nice work!
                  </motion.h2>

                  <motion.p
                    className="text-gray-400 text-sm font-semibold mb-6"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                  >
                    {trialCorrect}/{TRIAL_COUNT} correct
                  </motion.p>

                  <motion.div
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-500/10 mb-8"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <Zap className="w-5 h-5 text-primary-500" />
                    <span className="text-2xl font-black text-primary-500">{trialXp} XP</span>
                    <span className="text-sm font-bold text-primary-500/70">earned</span>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                    <button
                      onClick={handleTrialContinue}
                      className="w-full py-3.5 rounded-2xl bg-primary-500 text-white font-extrabold text-base transition-all active:translate-y-[2px]"
                      style={{ boxShadow: '0 5px 0 #0F766E' }}
                    >
                      SAVE MY PROGRESS
                    </button>
                    <p className="text-gray-400 text-xs font-semibold mt-3">
                      Create a free account to keep your XP
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══ Step 2: Create Account ═══ */}
          {step === 2 && (
            <motion.div
              key="signup"
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="max-w-sm mx-auto w-full"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-1">Save your progress</h2>
                <p className="text-gray-400 text-sm font-semibold">Create a free account to start learning</p>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl text-gray-700 font-bold hover:border-gray-300 disabled:opacity-60 transition-colors mb-4"
              >
                {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-semibold">{error}</div>
                )}
                <input type="text" placeholder="Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required minLength={2} maxLength={50}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold placeholder-gray-300 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold placeholder-gray-300 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" />
                <div>
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold placeholder-gray-300 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" />
                  <PasswordStrength password={password} />
                </div>
                <button type="submit" disabled={loading || password.length < 8}
                  className={cn('w-full py-3.5 rounded-2xl font-extrabold text-base transition-all active:translate-y-[2px]',
                    loading || password.length < 8 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-500 text-white')}
                  style={{ boxShadow: loading || password.length < 8 ? 'none' : '0 5px 0 #0F766E' }}>
                  {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Creating account...</span> : 'CREATE ACCOUNT'}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm font-semibold mt-5">
                Already have an account?{' '}<Link href="/login" className="text-primary-500 font-bold">Log in</Link>
              </p>
            </motion.div>
          )}

          {/* ═══ Step 3: Ready! ═══ */}
          {step === 3 && (
            <motion.div
              key="ready"
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="text-center max-w-sm mx-auto w-full"
            >
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-5xl mb-6">
                &#x1F680;
              </motion.div>

              <motion.h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                You&apos;re all set!
              </motion.h2>

              <motion.p className="text-gray-500 text-base mb-8 leading-relaxed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                Dive in and master {getProfession(selectedProfession)?.name ?? 'your course'}!
              </motion.p>

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
