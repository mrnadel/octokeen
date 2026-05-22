/**
 * Practice-progress sync helpers.
 *
 * Handles hydration of `useStore` from the DB and debounced write-back.
 */

import { useStore } from '@/store/useStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { useToastStore } from '@/components/ui/ToastNotification';
import { streakMilestones } from '@/data/streak-milestones';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { makePostOpts, PROGRESS_DEBOUNCE_MS } from './utils';

/**
 * Hydrate `useStore` progress from the DB response.
 * Also backfills streak milestones so popups don't replay after a cache clear.
 */
export function hydrateProgressStore(data: {
  progress: Record<string, unknown> & {
    totalXp?: number;
    currentStreak?: number;
    longestStreak?: number;
    lastActiveDate?: string;
    activeDays?: string[];
  };
}): void {
  const local = useStore.getState().progress;
  const db = data.progress;
  const restoredStreak = db.currentStreak ?? local.currentStreak ?? 0;

  useStore.setState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progress: {
      ...db,
      totalXp: Math.max(db.totalXp ?? 0, local.totalXp ?? 0),
      currentStreak: restoredStreak,
      longestStreak: Math.max(db.longestStreak ?? 0, local.longestStreak ?? 0),
      lastActiveDate: (db.lastActiveDate ?? '') > (local.lastActiveDate ?? '')
        ? db.lastActiveDate ?? '' : local.lastActiveDate ?? '',
      activeDays: [...new Set([...(db.activeDays ?? []), ...(local.activeDays ?? [])])].sort().slice(-14),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });

  // Backfill streak milestones so popups don't replay after cache clear.
  // If the engagement store has fewer milestones than the restored streak
  // warrants, mark all lower milestones as already reached.
  const engStreak = useEngagementStore.getState().streak;
  const reached = new Set(engStreak.milestonesReached);
  const milestoneDays = streakMilestones.map((m) => m.days);
  let changed = false;
  for (const days of milestoneDays) {
    if (days <= restoredStreak && !reached.has(days)) {
      reached.add(days);
      changed = true;
    }
  }
  if (changed) {
    useEngagementStore.setState((s) => ({
      streak: { ...s.streak, milestonesReached: [...reached] },
    }));
  }
}

/**
 * Merge guest-trial XP (earned before registration) into the progress store.
 * Reads from sessionStorage and clears the key when done.
 */
export function mergeGuestXp(): void {
  try {
    const guestData = sessionStorage.getItem(STORAGE_KEYS.GUEST_XP);
    if (guestData) {
      const { xp } = JSON.parse(guestData);
      if (xp > 0) {
        const current = useStore.getState().progress;
        useStore.setState({
          progress: {
            ...current,
            totalXp: current.totalXp + xp,
          },
        });
        useToastStore.getState().push({
          icon: '✨',
          title: `+${xp} XP added`,
          subtitle: 'Your guest progress was saved to your account!',
        });
      }
      sessionStorage.removeItem(STORAGE_KEYS.GUEST_XP);
    }
  } catch {}
}

/**
 * Subscribe to `useStore.progress` changes and debounce-sync to `/api/progress`.
 * Returns an unsubscribe function and a cleanup function for the timer.
 */
export function subscribeProgressSync(): { unsubscribe: () => void; cleanup: () => void } {
  let timer: ReturnType<typeof setTimeout>;

  const unsubscribe = useStore.subscribe(
    (state) => state.progress,
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const progress = useStore.getState().progress;
        fetch('/api/progress', makePostOpts({ progress })).catch(console.error);
      }, PROGRESS_DEBOUNCE_MS);
    },
  );

  return {
    unsubscribe,
    cleanup: () => clearTimeout(timer),
  };
}
