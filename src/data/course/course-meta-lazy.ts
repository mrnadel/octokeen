/**
 * Lazy gateway to `course-meta.ts`.
 *
 * `course-meta.ts` is 638 KB raw / 139 KB gzipped -- every unit and lesson title
 * for all four courses. Anything the root layout can reach statically therefore
 * puts 39 % of the shared client bundle on every page, including `/privacy` and
 * the `/learn` guides that never touch course data (docs/seo/performance.md §1).
 *
 * Modules that ship in the shared bundle -- `useCourseStore` above all -- must
 * import from here instead. The `import()` is a bundler split point, so the
 * course metadata lands in its own chunk and is fetched only once something
 * actually asks for course data.
 *
 * Route chunks that already render course content may keep importing
 * `course-meta.ts` directly; they are not on the shared path. See
 * `src/hooks/useCourseData.ts` for the bridge back into the store.
 */

import type { Unit } from './types';

type CourseMetaModule = typeof import('./course-meta');

let modulePromise: Promise<CourseMetaModule> | null = null;

function importCourseMeta(): Promise<CourseMetaModule> {
  modulePromise ??= import('./course-meta');
  return modulePromise;
}

/** Lightweight unit metadata (no question content) for a profession. */
export async function getCourseMetaForProfessionLazy(professionId: string): Promise<Unit[]> {
  const { getCourseMetaForProfession } = await importCourseMeta();
  return getCourseMetaForProfession(professionId);
}

/** Full unit data, questions included, for one unit of a profession's course. */
export async function loadUnitDataLazy(unitIndex: number, professionId?: string): Promise<Unit> {
  const { loadUnitData } = await importCourseMeta();
  return loadUnitData(unitIndex, professionId);
}
