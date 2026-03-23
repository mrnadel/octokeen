'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, useSessionActions, useProgress } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import SessionView from '@/components/session/SessionView';
import {
  selectSmartPracticeQuestions,
  buildPerformance,
} from '@/lib/practice-algorithm';
import type { TopicId } from '@/data/types';

export default function SmartPracticePage() {
  const { session, sessionSummary } = useSession();
  const { startSession } = useSessionActions();
  const progress = useProgress();
  const searchParams = useSearchParams();
  const router = useRouter();
  const started = useRef(false);

  const topicFilter = searchParams.get('topic') as TopicId | null;

  // Auto-start session on mount — no splash screen
  useEffect(() => {
    if (started.current || session || sessionSummary) return;
    started.current = true;

    const questions = useStore.getState().questions;
    const courseData = useCourseStore.getState().courseData;
    const perf = buildPerformance(
      progress.topicProgress,
      progress.sessionHistory,
    );

    const selected = selectSmartPracticeQuestions(
      questions,
      courseData,
      perf,
      { topicId: topicFilter ?? undefined },
    );

    if (selected.length === 0) {
      // No questions available — go back instead of showing a dead-end
      router.replace(topicFilter ? '/skills' : '/');
      return;
    }

    startSession('smart-practice', {
      topicId: topicFilter ?? undefined,
      questionIds: selected.map(s => s.question.id),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (session || sessionSummary) {
    return <SessionView />;
  }

  // Brief blank while session initializes (typically <1 frame)
  return null;
}
