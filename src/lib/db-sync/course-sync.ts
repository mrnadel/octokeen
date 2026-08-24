/**
 * Course-progress sync helpers.
 *
 * Handles hydration of `useCourseStore` from the DB and debounced write-back.
 */

import { useCourseStore } from '@/store/useCourseStore';
import { useStore } from '@/store/useStore';
import { PROFESSION_ID } from '@/data/professions';
import { mergeActiveDays, type StreakProgress } from '@/lib/streak-utils';
import { makePostOpts, COURSE_DEBOUNCE_MS } from './utils';
import { shallow } from 'zustand/shallow';

/**
 * Hydrate `useCourseStore` and `useStore` streak fields from the DB response.
 */
export function hydrateCourseStore(
  data: {
    progress: Record<string, unknown> & {
      totalXp: number;
      currentStreak?: number;
      longestStreak: number;
      lastActiveDate: string;
      activeDays?: string[];
      placementUnitIndex?: number;
      placementByCourse?: Record<string, number>;
      completedLessons: Record<string, {
        lastAttempted?: string;
        bestAccuracy?: number;
        attempts?: number;
        stars?: number;
      }>;
      courseIntros?: Record<string, unknown>;
      viewedStoryUnlocks?: string[];
    };
    activeProfession?: string;
  },
): void {
  const local = useCourseStore.getState().progress;
  const localProfession = useCourseStore.getState().activeProfession;
  const db = data.progress;

  const mergedLessons = { ...db.completedLessons };
  for (const [id, localLesson] of Object.entries(local.completedLessons)) {
    const dbLesson = mergedLessons[id];
    if (!dbLesson) {
      // Local has a lesson DB doesn't — keep it
      mergedLessons[id] = localLesson;
    } else {
      // Both have this lesson — use timestamp to pick the freshest,
      // then take the best accuracy/attempts from either side
      const localTime = localLesson.lastAttempted ?? '';
      const dbTime = dbLesson.lastAttempted ?? '';
      const base = localTime >= dbTime ? localLesson : dbLesson;
      mergedLessons[id] = {
        ...base,
        bestAccuracy: Math.max(localLesson.bestAccuracy ?? 0, dbLesson.bestAccuracy ?? 0),
        attempts: Math.max(localLesson.attempts ?? 0, dbLesson.attempts ?? 0),
        stars: Math.max(localLesson.stars ?? 0, dbLesson.stars ?? 0),
      };
    }
  }

  // Merge courseIntros: DB wins for keys not in local
  const mergedIntros = { ...(db.courseIntros ?? {}), ...(local.courseIntros ?? {}) };

  // Merge viewedStoryUnlocks: union of DB + local (de-duped)
  const mergedStoryUnlocks = [...new Set([
    ...(db.viewedStoryUnlocks ?? []),
    ...(local.viewedStoryUnlocks ?? []),
  ])];

  // Restore activeProfession from DB if local is still the default
  // (indicates localStorage was cleared)
  const dbProfession = data.activeProfession;
  const restoredProfession =
    localProfession === PROFESSION_ID.MECHANICAL_ENGINEERING && dbProfession && dbProfession !== PROFESSION_ID.MECHANICAL_ENGINEERING
      ? dbProfession
      : localProfession;

  // Placement is per-course. Merge the maps key-by-key; never fall back to a
  // course-agnostic value, which is what leaked one course's placement into
  // every other course on hydrate.
  const mergedPlacement: Record<string, number> = { ...(local.placementByCourse ?? {}) };
  for (const [profId, unitIndex] of Object.entries(db.placementByCourse ?? {})) {
    mergedPlacement[profId] = Math.max(mergedPlacement[profId] ?? 0, unitIndex ?? 0);
  }
  const activePlacement = mergedPlacement[restoredProfession] || undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useCourseStore.setState({
    activeProfession: restoredProfession,
    progress: {
      ...db,
      totalXp: Math.round(Math.max(db.totalXp, local.totalXp)),
      currentStreak: db.currentStreak ?? local.currentStreak ?? 0,
      longestStreak: Math.max(db.longestStreak, local.longestStreak),
      lastActiveDate: db.lastActiveDate > local.lastActiveDate
        ? db.lastActiveDate : local.lastActiveDate,
      activeDays: mergeActiveDays(db.activeDays, local.activeDays),
      placementUnitIndex: activePlacement,
      placementByCourse: Object.keys(mergedPlacement).length > 0 ? mergedPlacement : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      completedLessons: mergedLessons as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      courseIntros: Object.keys(mergedIntros).length > 0 ? mergedIntros as any : undefined,
      viewedStoryUnlocks: mergedStoryUnlocks.length > 0 ? mergedStoryUnlocks : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });
}

/**
 * Apply server-authoritative streak data to both `useStore` and `useCourseStore`.
 */
export function applyServerStreak(streakData: {
  currentStreak?: number;
  longestStreak?: number;
  activeDays?: string[];
  lastActiveDate?: string;
}): void {
  const serverStreak = streakData.currentStreak ?? 0;
  const serverLongestStreak = streakData.longestStreak ?? 0;
  const serverActiveDays: string[] = streakData.activeDays ?? [];
  const serverLastActive: string = streakData.lastActiveDate ?? '';

  /** Server wins for the streak count; local wins where it is further ahead. */
  function patch<T extends StreakProgress>(progress: T): T {
    return {
      ...progress,
      currentStreak: serverStreak,
      longestStreak: Math.max(serverLongestStreak, progress.longestStreak),
      activeDays: serverActiveDays.length > 0 ? serverActiveDays : progress.activeDays,
      lastActiveDate: serverLastActive > (progress.lastActiveDate ?? '')
        ? serverLastActive : progress.lastActiveDate,
    };
  }

  useStore.setState((s) => ({ progress: patch(s.progress) }));
  useCourseStore.setState((s) => ({ progress: patch(s.progress) }));
}

/**
 * Subscribe to `useCourseStore` progress/profession changes and debounce-sync
 * to `/api/course-progress`.
 * Returns an unsubscribe function and a cleanup function for the timer.
 */
export function subscribeCourseSync(): { unsubscribe: () => void; cleanup: () => void } {
  let timer: ReturnType<typeof setTimeout>;

  const unsubscribe = useCourseStore.subscribe(
    (state) => ({ progress: state.progress, activeProfession: state.activeProfession }),
    () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const { progress, activeProfession } = useCourseStore.getState();
        try {
          const res = await fetch('/api/course-progress', makePostOpts({ progress, activeProfession }));
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.error('course-progress sync failed:', res.status, data);
          }
        } catch (err) {
          console.error('course-progress sync error:', err);
        }
      }, COURSE_DEBOUNCE_MS);
    },
    { equalityFn: shallow },
  );

  return {
    unsubscribe,
    cleanup: () => clearTimeout(timer),
  };
}
