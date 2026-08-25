'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useEngagementStore, grantFrame } from '@/store/useEngagementStore';
import { initFakeUserPool, progressFakeUsers } from '@/lib/fake-user-generator';
import { useSubscriptionStore } from '@/hooks/useSubscription';
import { scheduleEventNotifications } from '@/lib/xp-events';
import { getTodayString, getYesterdayString } from '@/lib/utils';
import { daysBetweenDateKeys } from '@/lib/engagement-store-utils';

/** Everyone starts in the Bronze league and owns its avatar frame. */
const BRONZE_LEAGUE_FRAME_ID = 'reward-frame-league-bronze';

/**
 * On-load streak reconciliation: consume a freeze or record a break when the
 * user has been away long enough to lose their streak.
 *
 * Exported so the behaviour can be tested directly — it reads and writes the
 * same stores the hook does, and the hook is its only production caller.
 *
 * Every date here is a *local* day key (`getTodayString`/`getYesterdayString`),
 * matching what `advanceStreak` writes into `lastActiveDate`. Computing "today"
 * in UTC instead breaks the streak of any user whose local date differs from
 * the UTC date — for a negative UTC offset that is every evening.
 */
export function reconcileStreakOnLoad(hasEngagementHistory: boolean): void {
  const progress = useStore.getState().progress;
  const engagement = useEngagementStore.getState();
  const today = getTodayString();

  // Streak freeze / break detection — only if user actually has a streak to lose.
  // Skip if a break was already recorded (repairAvailable is persisted) to avoid
  // re-triggering on every refresh before the user completes a new session.
  const alreadyBroken = engagement.streak.repairAvailable || engagement.streak.lastStreakBreakDate === today;
  if (
    !hasEngagementHistory ||
    alreadyBroken ||
    !progress.lastActiveDate ||
    progress.lastActiveDate === today ||
    progress.currentStreak <= 0
  ) {
    return;
  }

  const daysDiff = daysBetweenDateKeys(progress.lastActiveDate, today);

  if (daysDiff === 2 && engagement.streak.freezesOwned > 0) {
    // Missed exactly 1 day (daysDiff=2 means last active 2 days ago) — consume freeze, preserve streak
    useEngagementStore.getState().useStreakFreeze();
    useStore.setState((state) => ({
      progress: { ...state.progress, lastActiveDate: getYesterdayString() },
    }));
  } else if (daysDiff >= 2) {
    // Missed 1+ days with no usable freeze — record break and reset streak
    useEngagementStore.getState().recordStreakBreak(progress.currentStreak);
    useStore.setState((state) => ({
      progress: { ...state.progress, currentStreak: 0 },
    }));
    useCourseStore.setState((state) => ({
      progress: { ...state.progress, currentStreak: 0 },
    }));
  }
}

export function useEngagementInit(isHydrated = true) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !isHydrated) return;
    initialized.current = true;

    const progress = useStore.getState().progress;
    const engagement = useEngagementStore.getState();

    // Skip streak/comeback detection on fresh installs — dailyQuestDate is null
    // when the engagement system has never been initialized (e.g. after clearing storage).
    // Without this guard, seed progress dates trigger false streak-break/comeback popups.
    const hasEngagementHistory = engagement.dailyQuestDate !== null;

    // Clear stale repair state: if repairAvailable is true but the user has no streak
    // (e.g. never completed a session, or streak was already reset), dismiss it automatically.
    if (engagement.streak.repairAvailable && progress.currentStreak === 0 && engagement.streak.lastStreakValueBeforeBreak === 0) {
      useEngagementStore.setState((s) => ({ streak: { ...s.streak, repairAvailable: false } }));
    }

    reconcileStreakOnLoad(hasEngagementHistory);

    // Grant Bronze league frame if not already owned (everyone starts in Bronze)
    grantFrame(BRONZE_LEAGUE_FRAME_ID);

    // === Engagement init sequence (ORDER MATTERS) ===
    // Initialize fake user pool (must happen before league simulation)
    initFakeUserPool();
    progressFakeUsers();
    useEngagementStore.getState().initDailyQuests();
    useEngagementStore.getState().initWeeklyQuests();
    useEngagementStore.getState().simulateLeagueWeek();
    if (hasEngagementHistory) {
      useEngagementStore.getState().checkComebackFlow();    // Gap 9
    }
    useEngagementStore.getState().checkDailyRewardCalendar();  // Gap 10
    // Gap 9: Graduated nudge banners (Day-1 / Day-2 returning users)
    useEngagementStore.getState().checkNudges();
    // Gap 6: Schedule browser notifications for upcoming XP events
    const isPro = useSubscriptionStore.getState().tier === 'pro';
    scheduleEventNotifications(isPro);
  }, [isHydrated]);
}
