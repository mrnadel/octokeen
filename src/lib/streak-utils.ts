import { getTodayString, getYesterdayString } from '@/lib/utils';

/** Number of recent active days retained for the week tracker. */
const ACTIVE_DAYS_WINDOW = 14;

/** Streak-affecting engagement actions, injected so this module stays store-free. */
export interface StreakFreezeContext {
  freezesOwned: number;
  useStreakFreeze: () => void;
  recordStreakBreak: (previousStreakValue: number) => void;
}

/** Progress-like shape shared by the practice and course stores. */
export interface StreakProgress {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activeDays?: string[];
}

/**
 * Advance the daily streak for an activity completed today.
 *
 * Consumes a streak freeze when one is owned and a day was missed, otherwise
 * records the break (opening the repair window) and restarts at 1.
 * Returns the streak value unchanged when the user was already active today.
 *
 * Shared by `useStore.completeSession` and `useCourseStore.completeLesson`.
 */
export function advanceStreak(
  currentStreak: number,
  lastActiveDate: string,
  engagement: StreakFreezeContext,
): number {
  if (lastActiveDate === getTodayString()) return currentStreak;

  if (lastActiveDate === getYesterdayString()) return currentStreak + 1;
  if (!lastActiveDate) return 1;

  // Missed day(s) — a freeze preserves the streak, otherwise it breaks
  if (engagement.freezesOwned > 0 && currentStreak > 0) {
    engagement.useStreakFreeze();
    return currentStreak + 1;
  }
  if (currentStreak > 0) engagement.recordStreakBreak(currentStreak);
  return 1;
}

/** Append today to the active-days window, keeping only the most recent days. */
export function appendActiveDay(activeDays: string[] | undefined, today: string): string[] {
  const existing = activeDays ?? [];
  return existing.includes(today) ? existing : [...existing, today].slice(-ACTIVE_DAYS_WINDOW);
}

/** Merge two active-day lists into a sorted, de-duped window. */
export function mergeActiveDays(a: string[] | undefined, b: string[] | undefined): string[] {
  return [...new Set([...(a ?? []), ...(b ?? [])])].sort().slice(-ACTIVE_DAYS_WINDOW);
}

/**
 * Build the streak fields to write into the *other* progress store so the
 * practice and course streaks stay in lockstep regardless of which mode was used.
 */
export function buildStreakSyncPatch<T extends StreakProgress>(
  progress: T,
  newStreak: number,
  today: string,
): T {
  return {
    ...progress,
    currentStreak: newStreak,
    longestStreak: Math.max(progress.longestStreak, newStreak),
    lastActiveDate: today,
    activeDays: appendActiveDay(progress.activeDays, today),
  };
}

/**
 * Compute current streak by walking backwards from today.
 * If today isn't active, checks yesterday (streak is at-risk but not broken).
 * A streak freeze bridges a single-day gap (up to `freezesAvailable` gaps).
 */
export function computeStreakFromDates(
  dates: string[],
  today: string,
  freezesAvailable = 0,
): { currentStreak: number; longestStreak: number } {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const dateSet = new Set(dates);

  const d = new Date(today + 'T12:00:00Z');

  if (!dateSet.has(today)) {
    d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().split('T')[0];
    if (!dateSet.has(yesterday)) {
      return { currentStreak: 0, longestStreak: computeLongestStreak(dates) };
    }
  }

  let currentStreak = 0;
  let freezesUsed = 0;
  while (true) {
    const dateStr = d.toISOString().split('T')[0];
    if (dateSet.has(dateStr)) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    } else if (freezesUsed < freezesAvailable) {
      // Bridge a 1-day gap with a streak freeze — check if the day before this gap has activity
      const peekDate = new Date(d);
      peekDate.setDate(peekDate.getDate() - 1);
      const peekStr = peekDate.toISOString().split('T')[0];
      if (dateSet.has(peekStr)) {
        freezesUsed++;
        currentStreak++; // count the frozen day
        d.setDate(d.getDate() - 1);
      } else {
        break; // gap is 2+ days, freeze can't bridge it
      }
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak: Math.max(currentStreak, computeLongestStreak(dates)) };
}

export function computeLongestStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1] + 'T12:00:00Z');
    const curr = new Date(sortedDates[i] + 'T12:00:00Z');
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }
  return longest;
}
