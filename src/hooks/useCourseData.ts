'use client';

import { useEffect } from 'react';

import { getCourseMetaForProfession } from '@/data/course/course-meta';
import type { Unit } from '@/data/course/types';
import { useCourseStore } from '@/store/useCourseStore';

/**
 * The active profession's course structure, and the bridge that puts it in the
 * store.
 *
 * `useCourseStore` reaches `course-meta.ts` only through `import()` now, because
 * a static edge from the store put 139 KB gzipped of unit titles on every page
 * of the site -- `/privacy` and the `/learn` guides included
 * (docs/seo/performance.md §1.2). The store therefore starts with an empty
 * `courseData`.
 *
 * This module is the counterweight. It imports the metadata statically, so the
 * module lands in the route chunks that genuinely render course content, and
 * seeds the store the moment it is evaluated -- before React renders anything.
 * Store actions that read `courseData` mid-render, `isLessonUnlocked` above
 * all, therefore see the same data they always did, on the server and on the
 * first client frame alike.
 *
 * Use this instead of `useCourseStore((s) => s.courseData)` in any component
 * that can be the first thing a user lands on. Components rendered underneath
 * one of those can keep reading the store directly.
 */

function seedFromModule(): void {
  const { activeProfession, hydrateCourseData } = useCourseStore.getState();
  hydrateCourseData(getCourseMetaForProfession(activeProfession));
}

// Runs at import time, which is what makes the seed synchronous. `persist` has
// already rehydrated `activeProfession` by now: this module imports the store,
// so the store's module body finished first.
seedFromModule();

export function useCourseData(): Unit[] {
  const courseData = useCourseStore((s) => s.courseData);
  const activeProfession = useCourseStore((s) => s.activeProfession);

  // Switching course clears `courseData`; re-seed it for the new profession.
  // Reading the id back off the store rather than closing over it means a
  // switch that lands between render and effect cannot seed the wrong course.
  useEffect(seedFromModule, [activeProfession]);

  return courseData.length > 0 ? courseData : getCourseMetaForProfession(activeProfession);
}
