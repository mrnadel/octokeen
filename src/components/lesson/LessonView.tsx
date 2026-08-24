'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourseStore } from '@/store/useCourseStore';
import { useLessonColors, LESSON_ACCENT } from '@/lib/lessonColors';
import { useBackHandler } from '@/hooks/useBackHandler';
import { useScrollLock } from '@/hooks/useScrollLock';
import type { QuestionCardHandle } from './QuestionCard';
import TeachingCard from './TeachingCard';
import { QuestionRenderer } from './shared/QuestionRenderer';
import { LessonTypeSwitch } from './types/LessonTypeSwitch';
import { useMasteryStore } from '@/store/useMasteryStore';
import { useDoubleXpActive } from '@/store/useEngagementStore';
import { useHeartsStore } from '@/store/useHeartsStore';
import { playSound } from '@/lib/sounds';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { PROFESSION_ID } from '@/data/professions';
import { OutOfHeartsModal } from '@/components/ui/OutOfHeartsModal';
import type { CourseQuestion } from '@/data/course/types';
import type { ContentFeedbackType } from '@/data/types';
import { GlossaryProvider } from '@/components/lesson/GlossaryContext';
import { AdaptiveToast } from '@/components/lesson/AdaptiveToast';
import { MicroCelebration } from '@/components/lesson/MicroCelebration';
import { LessonExitConfirmModal } from './LessonExitConfirmModal';
import { LessonCalculatorPanel } from './LessonCalculatorPanel';
import { LessonTopBar } from './LessonTopBar';
import { LessonDebugControls } from './LessonDebugControls';
import { LessonCheckBar } from './LessonCheckBar';
import { LessonAnswerFeedback } from './LessonAnswerFeedback';
import { LessonHotkeyHint } from './LessonHotkeyHint';
import { useLessonHotkeys } from './useLessonHotkeys';
import { useLessonNarration } from './useLessonNarration';
import { useLessonAdaptive } from '@/hooks/useLessonAdaptive';
import { useLessonBackground } from '@/hooks/useLessonBackground';
import { useLessonCelebration } from '@/hooks/useLessonCelebration';
import { useLessonCharacter } from '@/hooks/useLessonCharacter';

/** Courses whose lessons include calculation questions and get the in-lesson calculator. */
const CALCULATOR_PROFESSIONS: readonly string[] = [
  PROFESSION_ID.MECHANICAL_ENGINEERING,
  PROFESSION_ID.PERSONAL_FINANCE,
  PROFESSION_ID.SPACE_ASTRONOMY,
];

/**
 * Adapter for driving LessonView from an external data source (e.g. practice sessions).
 * When provided, LessonView uses these values instead of its internal useCourseStore hooks.
 */
export interface SessionAdapter {
  currentQuestion: CourseQuestion;
  answeredCount: number;
  totalQuestions: number;
  isCurrentAnswered: boolean;
  isLastQuestion: boolean;
  unitColor: string;
  theme: { color: string; dark: string; bg: string };
  isGolden: boolean;
  /** Handle answer submission + mastery logging for this mode. */
  submitAnswer: (questionId: string, correct: boolean) => void;
  nextQuestion: () => void;
  complete: () => void;
  /** Direct exit (bypasses confirmation). */
  exit: () => void;
  /** Whether any answers exist — determines if exit confirmation shows. */
  hasAnswers: boolean;
  flagContentType: ContentFeedbackType;
  exitLabel: string;
  exitConfirmTitle: string;
  exitConfirmMessage: string;
  /** Skip heart deduction and out-of-hearts checks (e.g. placement tests). */
  noHearts?: boolean;
}

export { LessonView };
export default function LessonView({ adapter }: { adapter?: SessionAdapter } = {}) {
  // === LESSON-MODE HOOKS (always called — rules of hooks) ===
  const activeLesson = useCourseStore((s) => s.activeLesson);
  const lessonResult = useCourseStore((s) => s.lessonResult);
  const _submitAnswer = useCourseStore((s) => s.submitAnswer);
  const _nextQuestion = useCourseStore((s) => s.nextQuestion);
  const _completeLesson = useCourseStore((s) => s.completeLesson);
  const _exitLesson = useCourseStore((s) => s.exitLesson);
  const courseData = useCourseStore((s) => s.courseData);
  const activeProfession = useCourseStore((s) => s.activeProfession);

  // === SHARED LOCAL STATE ===
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | undefined>(undefined);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);

  // Adaptive difficulty
  const { adaptiveMode, adaptiveSeed, pushAnswer } = useLessonAdaptive();

  // Micro-celebration state
  const {
    celebration,
    correctStreak,
    milestoneGlow,
    setCorrectStreak,
    triggerStreakCelebration,
    triggerHalfwayCelebration,
    triggerLastQuestionCelebration,
    dismissCelebration,
  } = useLessonCelebration();

  const questionRef = useRef<QuestionCardHandle>(null);
  const continueBtnRef = useRef<HTMLButtonElement>(null);
  const questionAreaRef = useRef<HTMLDivElement>(null);
  const isDoubleXp = useDoubleXpActive();
  const addMasteryEvent = useMasteryStore((s) => s.addEvent);
  useScrollLock(true);
  const c = useLessonColors();
  const syncMastery = useMasteryStore((s) => s.syncToServer);
  const loseHeart = useHeartsStore((s) => s.loseHeart);
  const hasHearts = useHeartsStore((s) => s.hasHearts);

  // Localized variant support
  const [userCountry, setUserCountry] = useState<string | null>(null);
  useEffect(() => {
    setUserCountry(localStorage.getItem(STORAGE_KEYS.COUNTRY));
  }, []);

  // Sync mastery when lesson completes (lesson mode only; practice handles its own)
  useEffect(() => {
    if (!adapter && lessonResult) syncMastery();
  }, [adapter, lessonResult, syncMastery]);

  // Focus the continue button when an answer is submitted
  useEffect(() => {
    if (lastAnswerCorrect !== null) {
      requestAnimationFrame(() => continueBtnRef.current?.focus());
    }
  }, [lastAnswerCorrect]);

  // Focus trap for exit confirm dialog is handled inside LessonExitConfirmModal

  // Scroll lock handled by useScrollLock(true) above

  // === LESSON-MODE DERIVED DATA ===
  const lessonData = useMemo(() => {
    if (adapter || !activeLesson) return null;
    const unit = courseData[activeLesson.unitIndex];
    if (!unit) return null;
    const lesson = unit.lessons[activeLesson.lessonIndex];
    if (!lesson) return null;
    return { unit, lesson };
  }, [adapter, activeLesson, courseData]);

  const currentSectionIndex = lessonData?.unit?.sectionIndex;

  // === LESSON BACKGROUND ===
  const bgStepIndex = adapter ? (adapter.answeredCount ?? 0) : (activeLesson?.currentQuestionIndex ?? 0);
  const { backgroundHtml, bgTheme, bgRef } = useLessonBackground(
    lessonData?.lesson.background,
    bgStepIndex,
  );

  // Load section character + character lines when lesson starts (lesson mode only)
  const characterSectionIndex = adapter ? undefined : lessonData?.unit?.sectionIndex;
  const { lessonCharacter, charLines } = useLessonCharacter(
    characterSectionIndex,
    activeProfession,
    adapter ? undefined : activeLesson?.unitIndex,
  );

  const overlayActive = showExitConfirm || showOutOfHearts;

  const lessonSessionQuestions = useMemo(() => {
    if (adapter || !activeLesson || !lessonData) return [];
    // Build lookup from current lesson's questions
    const questionMap = new Map(lessonData.lesson.questions.map((q) => [q.id, q]));
    // Include review questions from other units in the lookup
    if (activeLesson.reviewQuestionIds?.length) {
      const reviewIds = new Set(activeLesson.reviewQuestionIds);
      for (const unit of courseData) {
        if (!unit?.lessons) continue;
        for (const lesson of unit.lessons) {
          if (!lesson?.questions) continue;
          for (const q of lesson.questions) {
            if (reviewIds.has(q.id) && !questionMap.has(q.id)) {
              questionMap.set(q.id, q);
            }
          }
        }
      }
    }
    return activeLesson.sessionQuestionIds
      .map((id) => questionMap.get(id))
      .filter(Boolean) as typeof lessonData.lesson.questions;
  }, [adapter, activeLesson, lessonData, courseData]);

  const lessonCurrentQuestion = useMemo(() => {
    if (adapter || !activeLesson) return null;
    return lessonSessionQuestions[activeLesson.currentQuestionIndex] ?? null;
  }, [adapter, activeLesson, lessonSessionQuestions]);

  const lessonIsCurrentAnswered = useMemo(() => {
    if (adapter || !activeLesson) return false;
    // Index-based: each position in the queue gets one answer sequentially
    return activeLesson.answers.length > activeLesson.currentQuestionIndex;
  }, [adapter, activeLesson]);

  const lessonIsLastQuestion = useMemo(() => {
    if (adapter || !activeLesson) return false;
    return activeLesson.currentQuestionIndex >= lessonSessionQuestions.length - 1;
  }, [adapter, activeLesson, lessonSessionQuestions]);

  // Progress bar: unique questions correctly answered / unique question count
  // This keeps a fixed number of segments and only advances on correct answers.
  const lessonUniqueCorrect = useMemo(() => {
    if (adapter || !activeLesson) return 0;
    const correctIds = new Set<string>();
    for (const a of activeLesson.answers) {
      if (a.correct) correctIds.add(a.questionId);
    }
    return correctIds.size;
  }, [adapter, activeLesson]);

  const lessonUniqueTotal = useMemo(() => {
    if (adapter || !activeLesson) return 0;
    return new Set(activeLesson.sessionQuestionIds).size;
  }, [adapter, activeLesson]);

  // === RESOLVED STATE — adapter wins, else lesson-mode ===
  const currentQuestion = adapter ? adapter.currentQuestion : lessonCurrentQuestion;
  const answeredCount = adapter ? adapter.answeredCount : lessonUniqueCorrect;
  const totalQuestions = adapter ? adapter.totalQuestions : lessonUniqueTotal;
  const isCurrentAnswered = adapter ? adapter.isCurrentAnswered : lessonIsCurrentAnswered;
  const isLastQuestion = adapter ? adapter.isLastQuestion : lessonIsLastQuestion;
  const unitColor = LESSON_ACCENT.color;
  const theme = LESSON_ACCENT;
  const isGolden = adapter ? adapter.isGolden : (activeLesson?.isGolden ?? false);
  const flagContentType = adapter ? adapter.flagContentType : 'lesson-question';
  const exitLabel = adapter ? adapter.exitLabel : 'Close lesson';
  const exitConfirmTitle = adapter ? adapter.exitConfirmTitle : 'Quit lesson?';
  const exitConfirmMessage = adapter ? adapter.exitConfirmMessage : 'Your progress on this lesson will be lost.';
  const isTeaching = currentQuestion?.type === 'teaching';
  const hasBackground = backgroundHtml !== null && isTeaching;
  const hasCalculator = CALCULATOR_PROFESSIONS.includes(activeProfession);

  // === LESSON TYPE ===
  const lessonType = useMemo(() => {
    if (adapter) return 'standard' as const;
    if (!lessonData) return 'standard' as const;
    return lessonData.lesson.type ?? ('standard' as const);
  }, [adapter, lessonData]);
  const isNonStandard = lessonType !== 'standard';

  // Progress state for non-standard types
  const [typeAnsweredCount, setTypeAnsweredCount] = useState(0);
  const [typeTotalCount, setTypeTotalCount] = useState(0);

  // Override progress for non-standard types
  if (isNonStandard) {
    // These will be set by the type component via handleTypeProgress
    // We reassign the resolved values below
  }
  const resolvedAnsweredCount = isNonStandard ? typeAnsweredCount : answeredCount;
  const resolvedTotalQuestions = isNonStandard ? typeTotalCount : totalQuestions;

  // Callbacks for non-standard lesson type components
  const handleTypeAnswer = useCallback(
    (questionId: string, correct: boolean) => {
      _submitAnswer(questionId, correct);
      const topicId = lessonData?.unit.topicId;
      if (topicId) {
        addMasteryEvent({
          questionId,
          topicId,
          difficulty: 'intermediate',
          correct,
          source: 'course',
        });
      }
      if (!correct) {
        playSound('heartLost');
        loseHeart();
      }

      // Streak tracking for non-standard lesson types
      const newStreak = correct ? correctStreak + 1 : 0;
      setCorrectStreak(newStreak);
      if (correct && newStreak >= 3 && adaptiveMode !== 'cruising') {
        triggerStreakCelebration(newStreak);
      }
    },
    [_submitAnswer, lessonData, addMasteryEvent, loseHeart, correctStreak, adaptiveMode, triggerStreakCelebration],
  );

  const handleTypeProgress = useCallback((current: number, total: number) => {
    setTypeAnsweredCount(current);
    setTypeTotalCount(total);
  }, []);

  const handleTypeComplete = useCallback(() => {
    _completeLesson();
  }, [_completeLesson]);

  const checkHeartsForType = useCallback((): boolean => {
    if (!hasHearts()) {
      setShowOutOfHearts(true);
      return false;
    }
    return true;
  }, [hasHearts]);

  // === CALLBACKS ===
  const handleAnswer = useCallback(
    (correct: boolean, selectedOriginalIndex?: number) => {
      if (!currentQuestion) return;
      if (adapter) {
        adapter.submitAnswer(currentQuestion.id, correct);
      } else {
        _submitAnswer(currentQuestion.id, correct, adaptiveMode === 'cruising' && correct);
        const topicId = lessonData?.unit.topicId;
        if (topicId) {
          addMasteryEvent({
            questionId: currentQuestion.id,
            topicId,
            difficulty: 'intermediate',
            correct,
            source: 'course',
            selectedIndex: selectedOriginalIndex,
          });
        }
      }
      setLastAnswerCorrect(correct);
      setLastSelectedIndex(selectedOriginalIndex);
      // Track rolling accuracy for adaptive difficulty
      pushAnswer(correct);
      if (!correct && !adapter?.noHearts) {
        playSound('heartLost');
        loseHeart();
      }

      // Track correct streak (skip teaching cards — they use handleTeachingGotIt)
      if (!isTeaching) {
        const newStreak = correct ? correctStreak + 1 : 0;
        setCorrectStreak(newStreak);

        // Trigger streak celebration at 3+ in a row
        // Suppress when adaptive mode is cruising (they convey similar info)
        const currentAdaptiveMode = adapter ? 'normal' : adaptiveMode;
        if (correct && newStreak >= 3 && currentAdaptiveMode !== 'cruising') {
          triggerStreakCelebration(newStreak);
        }
      }
    },
    [adapter, currentQuestion, _submitAnswer, lessonData, addMasteryEvent, loseHeart, adaptiveMode, isTeaching, correctStreak, pushAnswer, triggerStreakCelebration]
  );

  const handleSelectionChange = useCallback((value: boolean) => {
    setHasSelection(value);
  }, []);

  const handleCheck = useCallback(() => {
    questionRef.current?.check();
  }, []);

  const handleContinue = useCallback(() => {
    setLastAnswerCorrect(null);
    setLastSelectedIndex(undefined);
    setHasSelection(false);

    // Milestone detection — fires BEFORE advancing to the next question
    const nextIndex = adapter
      ? adapter.answeredCount
      : (activeLesson?.currentQuestionIndex ?? 0) + 1;
    const total = resolvedTotalQuestions;

    // Halfway check: fire once when crossing the midpoint (4+ questions only)
    if (total >= 4 && nextIndex === Math.floor(total / 2)) {
      triggerHalfwayCelebration();
    }

    // Last question check: fire when advancing to the final question (3+ questions)
    if (total >= 3 && nextIndex === total - 1 && !isLastQuestion) {
      // Only trigger if we don't already have a streak celebration showing
      if (!celebration || celebration.type !== 'streak') {
        triggerLastQuestionCelebration();
      }
    }

    if (isLastQuestion) {
      adapter ? adapter.complete() : _completeLesson();
    } else {
      // Check if user has hearts before showing next question
      if (!adapter?.noHearts && !hasHearts()) {
        setShowOutOfHearts(true);
        return;
      }
      adapter ? adapter.nextQuestion() : _nextQuestion();
      requestAnimationFrame(() => questionAreaRef.current?.focus());
    }
  }, [adapter, activeLesson, isLastQuestion, _completeLesson, _nextQuestion, hasHearts, resolvedTotalQuestions, celebration, triggerHalfwayCelebration, triggerLastQuestionCelebration]);

  const handleExitClick = useCallback(() => {
    if (adapter) {
      if (!adapter.hasAnswers) { adapter.exit(); return; }
    } else {
      if (!activeLesson) return;
      if (activeLesson.answers.length === 0) { _exitLesson(); return; }
    }
    setShowExitConfirm(true);
  }, [adapter, activeLesson, _exitLesson]);

  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false);
    adapter ? adapter.exit() : _exitLesson();
  }, [adapter, _exitLesson]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  // Mobile back button
  const isActive = adapter ? !!currentQuestion : (!!activeLesson && !lessonResult);
  useBackHandler(isActive, handleExitClick);

  // Hotkey hint — only on devices with a physical keyboard
  const [showHotkeyHint, setShowHotkeyHint] = useState(false);
  useEffect(() => {
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (hasPointer) setShowHotkeyHint(true);
  }, []);
  useEffect(() => {
    if (showHotkeyHint) {
      const timer = setTimeout(() => setShowHotkeyHint(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showHotkeyHint]);

  // Teaching cards auto-submit as correct but must NOT affect adaptive
  // difficulty tracking (recentAnswers). This callback deliberately
  // bypasses handleAnswer to avoid inflating the rolling accuracy window.
  const handleTeachingGotIt = useCallback(() => {
    if (!currentQuestion) return;
    // Auto-submit teaching card as correct (won't count toward accuracy)
    if (adapter) {
      adapter.submitAnswer(currentQuestion.id, true);
    } else {
      _submitAnswer(currentQuestion.id, true);
    }
    // Immediately advance
    if (isLastQuestion) {
      adapter ? adapter.complete() : _completeLesson();
    } else {
      adapter ? adapter.nextQuestion() : _nextQuestion();
    }
  }, [adapter, currentQuestion, isLastQuestion, _submitAnswer, _completeLesson, _nextQuestion]);

  const handleToggleCalculator = useCallback(() => {
    setIsCalcOpen((open) => !open);
  }, []);

  useLessonHotkeys({
    questionRef,
    showExitConfirm,
    isCurrentAnswered,
    isTeaching,
    hasSelection,
    onCheck: handleCheck,
    onContinue: handleContinue,
    onTeachingGotIt: handleTeachingGotIt,
    onExit: handleExitClick,
    onCancelExit: handleCancelExit,
    onToggleCalculator: handleToggleCalculator,
  });

  const displayQuestion = currentQuestion;

  // Compute character celebration line
  const celebrationCharLine = useMemo(() => {
    if (!lessonCharacter || !charLines || !celebration) return null;
    const { getCelebrationLine } = require('@/lib/story-utils') as typeof import('@/lib/story-utils');
    return getCelebrationLine(celebration.type, lessonCharacter.id, charLines);
  }, [lessonCharacter, charLines, celebration]);

  // === NARRATION (Kokoro TTS via Blob CDN, browser TTS fallback) ===
  const currentLessonId = lessonData?.lesson.id ?? null;
  useLessonNarration(displayQuestion, currentLessonId, lastAnswerCorrect);

  if (!displayQuestion && !isNonStandard) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lesson-view"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-[60] flex items-center justify-center"
        role="main"
        aria-label={adapter ? 'Practice view' : 'Lesson view'}
        style={{
          backgroundColor: hasBackground ? '#05080F' : c.bg,
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {/* Background layer — placed on outer div so gradient fills entire viewport */}
        {hasBackground && (
          <div
            ref={bgRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              overflow: 'hidden',
              animationPlayState: overlayActive ? 'paused' : 'running',
            }}
            dangerouslySetInnerHTML={{ __html: backgroundHtml! }}
          />
        )}
        <GlossaryProvider sectionIndex={currentSectionIndex} accentColor={unitColor}>
        <div
          className={`w-full h-full max-w-3xl flex flex-col lg:shadow-lg lg:border-x ${hasBackground ? 'lg:border-transparent' : 'lg:border-gray-200'}`}
          style={{ position: 'relative', background: hasBackground ? 'transparent' : undefined }}
        >
        <LessonTopBar
          onExit={handleExitClick}
          exitLabel={exitLabel}
          isGolden={isGolden}
          answeredCount={resolvedAnsweredCount}
          totalQuestions={resolvedTotalQuestions}
          unitColor={unitColor}
          progressGlowing={adaptiveMode === 'cruising'}
          milestoneGlow={milestoneGlow}
          showHearts={!adapter?.noHearts}
          isDoubleXp={isDoubleXp}
          debugControls={
            <LessonDebugControls
              activeLesson={activeLesson}
              adapterComplete={adapter?.complete}
              submitAnswer={_submitAnswer}
              completeLesson={_completeLesson}
            />
          }
        />

        {/* Content area — type component or standard question flow */}
        {isNonStandard && lessonData ? (
          <LessonTypeSwitch
            lessonType={lessonType}
            lesson={lessonData.lesson}
            unitColor={unitColor}
            theme={theme}
            isGolden={isGolden}
            isDoubleXp={isDoubleXp}
            onAnswer={handleTypeAnswer}
            onProgress={handleTypeProgress}
            onComplete={handleTypeComplete}
            checkHearts={checkHeartsForType}
          />
        ) : displayQuestion ? (
        <>
        <div
          ref={questionAreaRef}
          tabIndex={-1}
          className={`flex-1 overflow-y-auto overflow-x-hidden${hasBackground ? ' lesson-has-background' : ''}`}
          style={{
            padding: '16px 20px 20px',
            position: 'relative',
            zIndex: 1,
            outline: 'none',
          }}
        >
          <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
            <LessonHotkeyHint
              show={showHotkeyHint && !isCurrentAnswered}
              isTeaching={isTeaching}
              questionType={currentQuestion?.type}
            />

            {/* Adaptive difficulty toast (encouraging when struggling, bonus when cruising) */}
            {lastAnswerCorrect === null && displayQuestion.type !== 'teaching' && (
              <AdaptiveToast mode={adaptiveMode} seed={adaptiveSeed.current} />
            )}

            {/* Mid-lesson micro-celebration toast — hidden when AdaptiveToast is showing */}
            <AnimatePresence>
              {celebration && !(lastAnswerCorrect === null && adaptiveMode !== 'normal' && displayQuestion.type !== 'teaching') && (
                <MicroCelebration
                  key={celebration.key}
                  type={celebration.type}
                  streakCount={celebration.streakCount}
                  onDismiss={dismissCelebration}
                  characterId={lessonCharacter?.id}
                  characterLine={celebrationCharLine}
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={displayQuestion.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                {displayQuestion.type === 'teaching' ? (
                  <TeachingCard
                    question={displayQuestion}
                    unitColor={unitColor}
                    onGotIt={handleTeachingGotIt}
                    hasBackground={hasBackground}
                    bgTheme={bgTheme}
                    characterId={lessonCharacter?.id}
                    characterName={lessonCharacter?.name}
                    lessonId={currentLessonId ?? undefined}
                  />
                ) : (
                  <QuestionRenderer
                    ref={questionRef}
                    question={displayQuestion}
                    onAnswer={handleAnswer}
                    onSelectionChange={handleSelectionChange}
                    answered={isCurrentAnswered}
                    unitColor={unitColor}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            {process.env.NODE_ENV === 'development' && (
              <div
                className="text-[10px] text-gray-300 text-center py-1 select-all cursor-text font-mono"
                title="Question ID (dev only)"
              >
                {displayQuestion.id}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar — hidden for teaching cards (they have their own button) */}
        {isTeaching ? null : !isCurrentAnswered ? (
          <LessonCheckBar
            hasSelection={hasSelection}
            onCheck={handleCheck}
            onToggleCalculator={hasCalculator ? handleToggleCalculator : undefined}
            isCalcOpen={isCalcOpen}
            unitColor={unitColor}
            accentBg={theme.bg}
            accentDark={theme.dark}
          />
        ) : (
          <LessonAnswerFeedback
            question={displayQuestion}
            correct={!!lastAnswerCorrect}
            selectedIndex={lastSelectedIndex}
            isLastQuestion={isLastQuestion}
            onContinue={handleContinue}
            continueRef={continueBtnRef}
            flagContentType={flagContentType}
            lessonId={currentLessonId ?? undefined}
            userCountry={userCountry}
          />
        )}
        </>
        ) : null}

        </div>{/* end centered wrapper */}
        </GlossaryProvider>


        {/* Calculator panel — shows the right calculator per course */}
        <LessonCalculatorPanel
          isOpen={isCalcOpen}
          profession={activeProfession}
          onClose={() => setIsCalcOpen(false)}
          unitColor={unitColor}
          accentDark={theme.dark}
        />

        {/* Out of hearts modal */}
        <OutOfHeartsModal
          isOpen={showOutOfHearts}
          onClose={() => setShowOutOfHearts(false)}
        />

        {/* Exit confirmation modal */}
        <LessonExitConfirmModal
          show={showExitConfirm}
          title={exitConfirmTitle}
          message={exitConfirmMessage}
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
        />
      </motion.div>

    </AnimatePresence>
  );
}
