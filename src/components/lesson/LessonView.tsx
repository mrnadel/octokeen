'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { course } from '@/data/course';
import LessonProgressBar from './LessonProgressBar';
import QuestionCard from './QuestionCard';
import type { QuestionCardHandle } from './QuestionCard';
import ResultScreen from './ResultScreen';

export { LessonView };
export default function LessonView() {
  const activeLesson = useCourseStore((s) => s.activeLesson);
  const lessonResult = useCourseStore((s) => s.lessonResult);
  const submitAnswer = useCourseStore((s) => s.submitAnswer);
  const nextQuestion = useCourseStore((s) => s.nextQuestion);
  const completeLesson = useCourseStore((s) => s.completeLesson);
  const exitLesson = useCourseStore((s) => s.exitLesson);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const questionRef = useRef<QuestionCardHandle>(null);

  // Derive lesson & question data
  const lessonData = useMemo(() => {
    if (!activeLesson) return null;
    const unit = course[activeLesson.unitIndex];
    if (!unit) return null;
    const lesson = unit.lessons[activeLesson.lessonIndex];
    if (!lesson) return null;
    return { unit, lesson };
  }, [activeLesson]);

  const currentQuestion = useMemo(() => {
    if (!activeLesson || !lessonData) return null;
    return lessonData.lesson.questions[activeLesson.currentQuestionIndex] ?? null;
  }, [activeLesson, lessonData]);

  const isCurrentAnswered = useMemo(() => {
    if (!activeLesson || !currentQuestion) return false;
    return activeLesson.answers.some((a) => a.questionId === currentQuestion.id);
  }, [activeLesson, currentQuestion]);

  const isLastQuestion = useMemo(() => {
    if (!activeLesson || !lessonData) return false;
    return activeLesson.currentQuestionIndex >= lessonData.lesson.questions.length - 1;
  }, [activeLesson, lessonData]);

  const answeredCount = activeLesson?.answers.length ?? 0;
  const totalQuestions = lessonData?.lesson.questions.length ?? 0;

  // Handlers
  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (!currentQuestion) return;
      submitAnswer(currentQuestion.id, correct);
    },
    [currentQuestion, submitAnswer]
  );

  const handleSelectionChange = useCallback((value: boolean) => {
    setHasSelection(value);
  }, []);

  const handleCheck = useCallback(() => {
    questionRef.current?.check();
  }, []);

  const handleContinue = useCallback(() => {
    if (isLastQuestion) {
      completeLesson();
    } else {
      nextQuestion();
    }
  }, [isLastQuestion, completeLesson, nextQuestion]);

  const handleExitClick = useCallback(() => {
    if (!activeLesson) return;
    if (activeLesson.answers.length === 0) {
      exitLesson();
      return;
    }
    setShowExitConfirm(true);
  }, [activeLesson, exitLesson]);

  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false);
    exitLesson();
  }, [exitLesson]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  // Show result screen after lesson completion
  if (lessonResult) {
    return <ResultScreen />;
  }

  // Nothing to render if no active lesson
  if (!activeLesson || !lessonData || !currentQuestion) {
    return null;
  }

  const unitColor = lessonData.unit.color;

  return (
    <AnimatePresence>
      <motion.div
        key="lesson-view"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-50 bg-white flex flex-col"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        }}
      >
        {/* ── Top bar: close button + progress bar ── */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <button
            onClick={handleExitClick}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close lesson"
          >
            <X className="w-6 h-6" />
          </button>
          <LessonProgressBar
            current={answeredCount}
            total={totalQuestions}
            color={unitColor}
          />
        </div>

        {/* ── Scrollable question area ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <QuestionCard
                ref={questionRef}
                question={currentQuestion}
                onAnswer={handleAnswer}
                onSelectionChange={handleSelectionChange}
                answered={isCurrentAnswered}
                unitColor={unitColor}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom button area ── */}
        <div
          className="sticky bottom-0 p-4 bg-white border-t border-gray-100"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
        >
          {!isCurrentAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!hasSelection}
              className={`
                w-full rounded-xl py-4 px-6 text-white font-bold text-lg
                transition-all duration-150 min-h-[56px]
                ${hasSelection ? 'active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'}
              `}
              style={{ backgroundColor: unitColor }}
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full rounded-xl py-4 px-6 text-white font-bold text-lg transition-all duration-150 active:scale-[0.98] min-h-[56px]"
              style={{ backgroundColor: unitColor }}
            >
              {isLastQuestion ? 'Complete' : 'Continue'}
            </button>
          )}
        </div>

        {/* ── Exit confirmation modal ── */}
        <AnimatePresence>
          {showExitConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Quit lesson?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Your progress on this lesson will be lost. Are you sure you want to leave?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelExit}
                    className="flex-1 rounded-xl py-3 px-4 border border-gray-200 text-gray-700 font-semibold transition-colors hover:bg-gray-50 min-h-[44px]"
                  >
                    Keep going
                  </button>
                  <button
                    onClick={handleConfirmExit}
                    className="flex-1 rounded-xl py-3 px-4 bg-red-500 text-white font-semibold transition-colors hover:bg-red-600 min-h-[44px]"
                  >
                    Quit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
