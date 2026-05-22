/**
 * Unified entry point for all course content access.
 *
 * Use this module (not course-meta.ts or index.ts directly) from API routes
 * and server-side code that needs course data.
 *
 * - Metadata helpers (lightweight, no question content): getCourseMetaForProfession,
 *   getLessonByIdMeta, getTotalLessonsMeta
 * - Full content loaders (async, loads question data on demand): getCourseData,
 *   getUnitData
 */

import {
  getCourseMetaForProfession,
  getLessonByIdMeta,
  getTotalLessonsMeta,
  loadUnitData,
} from './course-meta';
import type { Unit, Lesson } from './types';

// ─── Re-exports (metadata, no question content) ─────────────────────────────

export { getCourseMetaForProfession, getLessonByIdMeta, getTotalLessonsMeta };

// ─── Full content loaders ────────────────────────────────────────────────────

/**
 * Load all units with full question content for a profession.
 *
 * @param professionId  The profession slug (e.g. "mechanical-engineering")
 * @param options.unitIndices  Optional subset of unit indices to load.
 *                             Defaults to all units in the profession.
 */
export async function getCourseData(
  professionId: string,
  options?: { unitIndices?: number[] },
): Promise<Unit[]> {
  const meta = getCourseMetaForProfession(professionId);
  const indices = options?.unitIndices ?? meta.map((_, i) => i);
  return Promise.all(indices.map((i) => loadUnitData(i, professionId)));
}

/**
 * Load a single unit with full question content.
 *
 * @param unitIndex    Zero-based index into the profession's unit list.
 * @param professionId The profession slug.
 */
export async function getUnitData(
  unitIndex: number,
  professionId: string,
): Promise<Unit> {
  return loadUnitData(unitIndex, professionId);
}

/**
 * Find a lesson by ID within a profession and return the full lesson object
 * (metadata only — questions array will be empty as this resolves from meta).
 *
 * For full question content, load the parent unit via getUnitData().
 */
export function getLessonData(
  lessonId: string,
  professionId: string,
): { unit: Unit; lesson: Lesson; unitIndex: number; lessonIndex: number } | null {
  return getLessonByIdMeta(lessonId, professionId);
}
