'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore, useSession, useSessionActions } from '@/store/useStore';
import SessionSummary from './SessionSummary';
import { useMasteryStore } from '@/store/useMasteryStore';
import { LessonView } from '@/components/lesson/LessonView';
import type { SessionAdapter } from '@/components/lesson/LessonView';
import { useLessonColors } from '@/lib/lessonColors';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PRACTICE_THEME } from '@/lib/session-themes';

export default function SessionView() {
  const c = useLessonColors();
  const { session, sessionSummary } = useSession();
  const { answerQuestion, nextQuestion, completeSession, abandonSession } = useSessionActions();
  const addMasteryEvent = useMasteryStore((s) => s.addEvent);
  const syncMastery = useMasteryStore((s) => s.syncToServer);
  const router = useRouter();

  // Sync mastery events when session completes
  useEffect(() => {
    if (sessionSummary) syncMastery();
  }, [sessionSummary, syncMastery]);

  const handleExit = useCallback(() => {
    abandonSession();
    router.replace('/');
  }, [abandonSession, router]);

  const handleSubmitAnswer = useCallback(
    (questionId: string, correct: boolean) => {
      answerQuestion(questionId, correct);
      // Read latest session from store for question metadata
      const s = useStore.getState().session;
      const q = s?.questions.find((q) => q.id === questionId);
      if (q?.topic) {
        addMasteryEvent({
          questionId,
          topicId: q.topic,
          subtopic: q.subtopic,
          difficulty: q.difficulty,
          correct,
          source: 'practice',
        });
      }
    },
    [answerQuestion, addMasteryEvent]
  );

  if (sessionSummary) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SessionSummary summary={sessionSummary} />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!session || !session.questions[session.currentIndex]) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: c.bg }}>
        <LoadingSpinner card={false} />
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentIndex];

  const adapter: SessionAdapter = {
    currentQuestion,
    answeredCount: Object.keys(session.answers).length,
    totalQuestions: session.questions.length - (session.retryCount ?? 0),
    isCurrentAnswered: currentQuestion.id in session.answers,
    isLastQuestion: session.currentIndex >= session.questions.length - 1,
    unitColor: PRACTICE_THEME.color,
    theme: PRACTICE_THEME,
    isGolden: false,
    submitAnswer: handleSubmitAnswer,
    nextQuestion,
    complete: completeSession,
    exit: handleExit,
    hasAnswers: Object.keys(session.answers).length > 0,
    flagContentType: 'question',
    exitLabel: 'Close practice',
    exitConfirmTitle: 'Quit practice?',
    exitConfirmMessage: 'Your progress on this session will be lost.',
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="lesson"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <LessonView adapter={adapter} />
      </motion.div>
    </AnimatePresence>
  );
}
