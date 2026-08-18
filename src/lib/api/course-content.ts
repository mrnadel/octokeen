// ============================================================
// Full course content loading for admin endpoints
// ============================================================

import { getCourseData } from '@/data/course/api';
import { PROFESSIONS } from '@/data/professions';
import type { Unit } from '@/data/course/types';

export interface LoadedCourse {
  id: string;
  name: string;
  units: Unit[];
}

/**
 * Load every unit (with full question content) for each active profession.
 *
 * Loaded in parallel, matching the behaviour both callers had before this
 * helper existed. The full dataset is several MB per course, so peak memory
 * here is worth profiling — but that is a change to make with a measurement
 * attached, not an inferred one.
 */
export async function loadActiveCourses(): Promise<LoadedCourse[]> {
  const active = PROFESSIONS.filter((p) => !p.isComingSoon);

  return Promise.all(
    active.map(async (profession) => ({
      id: profession.id,
      name: profession.name,
      units: await getCourseData(profession.id),
    })),
  );
}

/** Flattened list of every unit across all active professions. */
export async function loadActiveCourseUnits(): Promise<Unit[]> {
  const courses = await loadActiveCourses();
  return courses.flatMap((course) => course.units);
}
