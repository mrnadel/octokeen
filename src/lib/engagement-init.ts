'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { initFakeUserPool, progressFakeUsers } from '@/lib/fake-user-generator';

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function useEngagementInit() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const progress = useStore.getState().progress;
    const engagement = useEngagementStore.getState();
    const today = new Date().toISOString().split('T')[0];

    // Streak freeze / break detection
    if (progress.lastActiveDate && progress.lastActiveDate !== today) {
      const lastActive = new Date(progress.lastActiveDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor(
        (todayDate.getTime() - lastActive.getTime()) / (24 * 60 * 60 * 1000),
      );

      if (daysDiff === 1 && engagement.streak.freezesOwned > 0) {
        // Missed exactly 1 day — consume freeze, preserve streak
        useEngagementStore.getState().useStreakFreeze();
        useStore.setState((state) => ({
          progress: { ...state.progress, lastActiveDate: getYesterday() },
        }));
      } else if (daysDiff >= 2 && engagement.streak.freezesOwned > 0) {
        // Multi-day gap — freeze can't bridge it, record break
        useEngagementStore.getState().recordStreakBreak(progress.currentStreak);
      } else if (
        daysDiff >= 1 &&
        engagement.streak.freezesOwned === 0 &&
        progress.currentStreak > 0
      ) {
        // No freeze — record break for repair offer
        useEngagementStore.getState().recordStreakBreak(progress.currentStreak);
      }
    }

    // Initialize all engagement systems
    // Initialize fake user pool (must happen before league simulation)
    initFakeUserPool();
    progressFakeUsers();
    useEngagementStore.getState().initDailyQuests();
    useEngagementStore.getState().initWeeklyQuests();
    useEngagementStore.getState().simulateLeagueWeek();
    useEngagementStore.getState().checkComebackFlow();
  }, []);
}
