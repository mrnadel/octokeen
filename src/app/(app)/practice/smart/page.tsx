'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, useSessionActions } from '@/store/useStore';
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

  const topicFilter = searchParams.get('topic') as TopicId | null;

  // Auto-start session on mount — but only once per page lifecycle
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // If there's already an active session or summary, just show it
    if (session || sessionSummary) return;

    // Check if we got here via back button (no session means it was already cleared)
    // Use navigation type to detect back/forward navigation
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isBackNav = navEntries.length > 0 && navEntries[0].type === 'back_forward';
    if (isBackNav) {
      router.replace('/');
      return;
    }

    startSession('smart-practice', {
      topicId: topicFilter ?? undefined,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (session || sessionSummary) {
    return <SessionView />;
  }

  // Show loading indicator while session initializes
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-surface-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-surface-500">Preparing questions...</p>
      </div>
    </div>
  );
}
