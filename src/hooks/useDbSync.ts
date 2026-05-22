'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCourseStore } from '@/store/useCourseStore';
import { useFeedbackStore } from '@/store/useFeedbackStore';
import { useToastStore } from '@/components/ui/ToastNotification';
import { makeFetchOpts, HYDRATE_TIMEOUT_MS } from '@/lib/db-sync/utils';
import { hydrateProgressStore, mergeGuestXp, subscribeProgressSync } from '@/lib/db-sync/progress-sync';
import { hydrateCourseStore, applyServerStreak, subscribeCourseSync } from '@/lib/db-sync/course-sync';
import { hydrateEngagementStore, subscribeEngagementSync, makeBeforeUnloadHandler } from '@/lib/db-sync/engagement-sync';

export function useDbSync() {
  const { status } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = status === 'authenticated';

  /** Track gem transactions that have already been synced to avoid double-inserting.
   *  Kept in a ref so each hook instance gets its own isolated counter. */
  const lastSyncedGemTxCountRef = useRef(0);

  // On mount: fetch from DB and hydrate stores
  useEffect(() => {
    if (!isAuthenticated) {
      setIsHydrated(true);
      return;
    }

    let cancelled = false;
    let hydrateTimeout: ReturnType<typeof setTimeout>;

    async function hydrate() {
      try {
        const activeProfession = useCourseStore.getState().activeProfession;

        // Add a timeout so hydration doesn't hang forever on slow/dead network
        const controller = new AbortController();
        hydrateTimeout = setTimeout(() => controller.abort(), HYDRATE_TIMEOUT_MS);

        const fetchOpts = makeFetchOpts(controller.signal);
        const [progressRes, courseRes, feedbackRes, contentCourseRes, engagementRes, streakRes] = await Promise.all([
          fetch('/api/progress', fetchOpts),
          fetch('/api/course-progress', fetchOpts),
          fetch('/api/content-feedback', fetchOpts),
          fetch(`/api/content/course?profession=${encodeURIComponent(activeProfession)}`, fetchOpts),
          fetch('/api/engagement', fetchOpts),
          fetch('/api/streak', fetchOpts),
        ]);
        clearTimeout(hydrateTimeout);

        if (cancelled) return;

        if (progressRes.ok) {
          const data = await progressRes.json();
          if (data.progress) {
            hydrateProgressStore(data);
          }
        }

        if (courseRes.ok) {
          const data = await courseRes.json();
          if (data.progress) {
            hydrateCourseStore(data);
          }
        }

        if (feedbackRes.ok) {
          const data = await feedbackRes.json();
          if (data.flags) {
            useFeedbackStore.getState().hydrateFlags(data.flags);
          }
        }

        if (contentCourseRes.ok) {
          const data = await contentCourseRes.json();
          // Only apply DB course data if the user is still on the same profession
          if (data.course?.length && useCourseStore.getState().activeProfession === activeProfession) {
            useCourseStore.getState().setCourseData(data.course);
          }
        }

        if (engagementRes.ok) {
          const eng = await engagementRes.json();
          lastSyncedGemTxCountRef.current = hydrateEngagementStore(eng);
        }

        if (streakRes.ok) {
          const streakData = await streakRes.json();
          applyServerStreak(streakData);
        }

        // Merge guest trial XP earned before registration
        mergeGuestXp();
      } catch (error) {
        console.error('Failed to hydrate from DB:', error);
        // Notify user that sync failed so they know they're seeing cached data
        if (!cancelled) {
          const isTimeout = error instanceof DOMException && error.name === 'AbortError';
          useToastStore.getState().push({
            icon: '⚠️',
            title: isTimeout ? 'Sync timed out' : 'Could not sync progress',
            subtitle: 'Using cached data. Your progress will sync when connection improves.',
            duration: 5000,
          });
        }
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    hydrate();

    return () => {
      cancelled = true;
      clearTimeout(hydrateTimeout);
    };
  }, [isAuthenticated]);

  // Subscribe to store changes and sync to DB (debounced)
  useEffect(() => {
    if (!isAuthenticated) return;

    const progress = subscribeProgressSync();
    const course = subscribeCourseSync();
    const engagement = subscribeEngagementSync(
      () => lastSyncedGemTxCountRef.current,
      (n) => { lastSyncedGemTxCountRef.current = n; },
    );

    return () => {
      progress.cleanup();
      course.cleanup();
      engagement.cleanup();
      progress.unsubscribe();
      course.unsubscribe();
      engagement.unsubEngagement();
      engagement.unsubHearts();
    };
  }, [isAuthenticated]);

  // Flush pending engagement data when the user closes or navigates away before the
  // debounce fires.
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleBeforeUnload = makeBeforeUnloadHandler(() => lastSyncedGemTxCountRef.current);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAuthenticated]);

  return { isHydrated };
}
