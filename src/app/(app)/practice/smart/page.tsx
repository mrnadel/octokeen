'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore, useSession, useSessionActions } from '@/store/useStore';
import SessionView from '@/components/session/SessionView';
import type { TopicId } from '@/data/types';

export default function SmartPracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-surface-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-surface-500">Preparing questions...</p>
        </div>
      </div>
    }>
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
  const [timedOut, setTimedOut] = useState(false);

  const topicFilter = searchParams.get('topic') as TopicId | null;

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Already have an active session or summary — just show it
    if (session || sessionSummary) return;

    startSession('smart-practice', {
      topicId: topicFilter ?? undefined,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fallback: if session never starts after async course data load, show retry
  useEffect(() => {
    if (started.current && !session && !sessionSummary) {
      const timer = setTimeout(() => {
        if (!useStore.getState().session && !useStore.getState().sessionSummary) {
          setTimedOut(true);
        }
      }, 15000); // Allow time for async course data loading
      return () => clearTimeout(timer);
    }
  }, [session, sessionSummary]);

  if (session || sessionSummary) {
    return <SessionView />;
  }

  // Show loading indicator while session initializes, or retry on timeout
  if (timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <p className="text-sm font-semibold text-surface-700 mb-2">Failed to load questions</p>
          <p className="text-xs text-surface-400 mb-4">Course data may still be loading</p>
          <div className="flex gap-3 justify-center">
            <button
              className="btn-primary text-sm py-2 px-4"
              onClick={() => {
                setTimedOut(false);
                started.current = false;
                startSession('smart-practice', { topicId: topicFilter ?? undefined });
                started.current = true;
              }}
            >
              Retry
            </button>
            <button
              className="btn-secondary text-sm py-2 px-4"
              onClick={() => router.replace('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-surface-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-surface-500">Preparing questions...</p>
      </div>
    </div>
  );
}
