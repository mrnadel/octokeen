'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, useSessionActions } from '@/store/useStore';
import SessionView from '@/components/session/SessionView';
import type { TopicId } from '@/data/types';

export default function SmartPracticePage() {
  return (
    <Suspense>
      <SmartPracticeInner />
    </Suspense>
  );
}

function SmartPracticeInner() {
  const { session, sessionSummary } = useSession();
  const { startSession } = useSessionActions();
  const searchParams = useSearchParams();
  const router = useRouter();
  const started = useRef(false);

  const topicFilter = searchParams.get('topic') as TopicId | null;

  // Auto-start session on mount — questions are selected from course data inside startSession
  useEffect(() => {
    if (started.current || session || sessionSummary) return;
    started.current = true;

    startSession('smart-practice', {
      topicId: topicFilter ?? undefined,
    });

    // If startSession produced no session (no questions), redirect
    setTimeout(() => {
      const s = useSession;
      if (!started.current) return;
      // Session was set synchronously by startSession, so check right away via store
    }, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (session || sessionSummary) {
    return <SessionView />;
  }

  // Brief blank while session initializes (typically <1 frame)
  return null;
}
