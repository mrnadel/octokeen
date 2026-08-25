import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { reconcileStreakOnLoad } from '@/lib/engagement-init';
import { applyServerStreak } from '@/lib/db-sync/course-sync';
import { computeStreakFromDates } from '@/lib/streak-utils';
import { useStore } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { toLocalDateString } from '@/lib/utils';

// ── Clock control ───────────────────────────────────────────────────────────

/**
 * An instant whose UTC calendar date differs from its local one, so any
 * UTC-vs-local mixup shows up as an off-by-one day.
 *
 * Which wall-clock hour produces the skew depends on the sign of the offset:
 * late evening for a negative UTC offset (UTC is already tomorrow), just after
 * midnight for a positive one (UTC is still yesterday). Returns null when the
 * runner is on UTC itself, where no such instant exists.
 */
function skewedInstant(): Date | null {
  for (const [hour, minute] of [[22, 0], [23, 30], [0, 30], [1, 0]] as const) {
    const d = new Date(2026, 7, 24, hour, minute, 0, 0);
    if (d.toISOString().split('T')[0] !== toLocalDateString(d)) return d;
  }
  return null;
}

const SKEW = skewedInstant();

/** Local day key `n` days before the frozen "now". */
function localDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toLocalDateString(d);
}

function seedStreak(lastActiveDate: string, currentStreak: number, freezesOwned = 0) {
  useStore.setState((s) => ({
    progress: { ...s.progress, lastActiveDate, currentStreak, longestStreak: Math.max(currentStreak, 30) },
  }));
  useCourseStore.setState((s) => ({
    progress: { ...s.progress, lastActiveDate, currentStreak, longestStreak: Math.max(currentStreak, 30) },
  }));
  useEngagementStore.setState((s) => ({
    streak: {
      ...s.streak,
      freezesOwned,
      repairAvailable: false,
      lastStreakBreakDate: null,
      lastStreakValueBeforeBreak: 0,
    },
  }));
}

// ── Defect A: on-load reconciliation must use local days, not UTC ───────────

describe.skipIf(SKEW === null)('reconcileStreakOnLoad across a UTC/local date boundary', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(SKEW!);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('leaves the streak intact when the user was active local-yesterday', () => {
    // A user who played yesterday has not missed a day. Computing "today" in UTC
    // makes this look like a two-day gap for any negative UTC offset, which
    // zeroed the streak and opened the paid repair window before the user acted.
    seedStreak(localDaysAgo(1), 12);

    reconcileStreakOnLoad(true);

    expect(useStore.getState().progress.currentStreak).toBe(12);
    expect(useCourseStore.getState().progress.currentStreak).toBe(12);
    expect(useEngagementStore.getState().streak.repairAvailable).toBe(false);
  });

  it('still records a break when the user genuinely missed a day', () => {
    // The mirror case: for a positive UTC offset the UTC "today" lagged the
    // local one, so a real two-day gap read as one and no break was recorded.
    seedStreak(localDaysAgo(2), 12);

    reconcileStreakOnLoad(true);

    expect(useStore.getState().progress.currentStreak).toBe(0);
    expect(useCourseStore.getState().progress.currentStreak).toBe(0);
    expect(useEngagementStore.getState().streak.repairAvailable).toBe(true);
    expect(useEngagementStore.getState().streak.lastStreakValueBeforeBreak).toBe(12);
  });

  it('consumes a freeze and rolls lastActiveDate to local-yesterday', () => {
    seedStreak(localDaysAgo(2), 12, 1);

    reconcileStreakOnLoad(true);

    expect(useStore.getState().progress.currentStreak).toBe(12);
    expect(useStore.getState().progress.lastActiveDate).toBe(localDaysAgo(1));
    expect(useEngagementStore.getState().streak.freezesOwned).toBe(0);
  });

  it('does nothing when the user was already active local-today', () => {
    seedStreak(localDaysAgo(0), 12);

    reconcileStreakOnLoad(true);

    expect(useStore.getState().progress.currentStreak).toBe(12);
    expect(useEngagementStore.getState().streak.repairAvailable).toBe(false);
  });
});

// ── Defect B: a sparse server view must not erase a local streak ────────────

describe('applyServerStreak', () => {
  beforeEach(() => {
    useStore.setState((s) => ({ progress: { ...s.progress, currentStreak: 30, longestStreak: 30 } }));
    useCourseStore.setState((s) => ({ progress: { ...s.progress, currentStreak: 30, longestStreak: 30 } }));
  });

  it('never lowers a streak the client legitimately holds', () => {
    // What /api/streak returned for a course-only user before it read
    // active_days: one date in, so one day of streak out.
    applyServerStreak({ currentStreak: 1, longestStreak: 30, activeDays: [], lastActiveDate: '2026-08-25' });

    expect(useStore.getState().progress.currentStreak).toBe(30);
    expect(useCourseStore.getState().progress.currentStreak).toBe(30);
  });

  it('still raises the streak when the server is ahead', () => {
    applyServerStreak({ currentStreak: 44, longestStreak: 44, activeDays: [], lastActiveDate: '2026-08-25' });

    expect(useStore.getState().progress.currentStreak).toBe(44);
    expect(useCourseStore.getState().progress.currentStreak).toBe(44);
  });
});

describe('computeStreakFromDates over the active-days window', () => {
  it('collapses to 1 when only lastActiveDate is available', () => {
    // The input /api/streak used to build for a course-only user.
    expect(computeStreakFromDates(['2026-08-25'], '2026-08-25', 0).currentStreak).toBe(1);
  });

  it('recovers the full streak once active_days is included', () => {
    const window = Array.from({ length: 14 }, (_, i) =>
      new Date(Date.UTC(2026, 7, 12 + i)).toISOString().split('T')[0],
    );
    expect(computeStreakFromDates(window, '2026-08-25', 0).currentStreak).toBe(14);
  });
});
