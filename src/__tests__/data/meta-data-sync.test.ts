import { describe, it, expect } from 'vitest';
import { getCourseMetaForProfession, loadUnitData } from '@/data/course/course-meta';
import { PROFESSIONS } from '@/data/professions';

/**
 * META ↔ DATA POSITIONAL SYNC — RATCHET
 *
 * `useCourseStore.startLesson` resolves a lesson by INDEX
 * (`unit.lessons[lessonIndex]`), then replaces courseData[unitIndex] with the
 * loaded unit. So the contract is not "every meta lesson exists somewhere in
 * the data" — it is "meta and data list the same lesson ids in the same
 * order". Three ways that breaks, in ascending nastiness:
 *
 *   MISSING     meta has an id the data lacks at that index -> load-error toast
 *   UNREACHABLE data has a lesson meta never lists          -> content never renders
 *   MISALIGNED  both defined but different at the same index -> THE WRONG LESSON OPENS
 *
 * Only MISSING currently fails a build (via content-safety.test.ts). This test
 * exists so the other two cannot silently grow. It is a ratchet, not a target:
 * the counts below are the known-bad baseline measured on this branch, and the
 * assertion only fires when a change makes things WORSE. Every run prints the
 * full itemised list so the debt stays visible rather than buried in a number.
 *
 * When these are fixed, lower the baselines. Do not raise them.
 */

const BASELINE_MISSING = 5;
const BASELINE_UNREACHABLE = 88;
const BASELINE_MISALIGNED = 32;

/** Loading every unit of every course far exceeds vitest's 5s default. */
const LOAD_ALL_COURSES_TIMEOUT_MS = 300_000;

interface Divergence {
  missing: string[];
  unreachable: string[];
  misaligned: string[];
}

async function collectDivergences(): Promise<Divergence> {
  const result: Divergence = { missing: [], unreachable: [], misaligned: [] };

  for (const profession of PROFESSIONS) {
    const meta = getCourseMetaForProfession(profession.id);

    for (let unitIndex = 0; unitIndex < meta.length; unitIndex++) {
      const unit = await loadUnitData(unitIndex, profession.id);

      // A unit with no loader falls back to returning the meta object itself
      // (course-meta.ts), which would make every check below vacuously pass.
      if (unit === meta[unitIndex]) continue;

      const metaIds = meta[unitIndex].lessons.map((lesson) => lesson.id);
      const dataIds = unit.lessons.map((lesson) => lesson.id);
      const where = `${profession.id} unit ${unitIndex} (${meta[unitIndex].id})`;

      for (let i = 0; i < Math.max(metaIds.length, dataIds.length); i++) {
        const inMeta = metaIds[i];
        const inData = dataIds[i];
        if (inMeta === inData) continue;

        if (inMeta === undefined) {
          result.unreachable.push(`${where} idx ${i}: "${inData}" in data, absent from meta`);
        } else if (inData === undefined) {
          result.missing.push(`${where} idx ${i}: "${inMeta}" in meta, absent from data`);
        } else {
          result.misaligned.push(`${where} idx ${i}: meta="${inMeta}" data="${inData}"`);
        }
      }
    }
  }

  return result;
}

function report(title: string, entries: string[], baseline: number): void {
  if (entries.length === 0) return;
  console.warn(`\n[meta-data-sync] ${title}: ${entries.length} (baseline ${baseline})`);
  entries.forEach((entry) => console.warn(`  - ${entry}`));
}

describe('meta ↔ data positional sync', () => {
  it(
    'does not regress beyond the known-bad baseline',
    async () => {
      const { missing, unreachable, misaligned } = await collectDivergences();

      report('MISSING from data (load-error toast)', missing, BASELINE_MISSING);
      report('UNREACHABLE content (never renders)', unreachable, BASELINE_UNREACHABLE);
      report('MISALIGNED (wrong lesson opens)', misaligned, BASELINE_MISALIGNED);

      expect(missing.length, missing.join('\n')).toBeLessThanOrEqual(BASELINE_MISSING);
      expect(unreachable.length, unreachable.join('\n')).toBeLessThanOrEqual(BASELINE_UNREACHABLE);
      expect(misaligned.length, misaligned.join('\n')).toBeLessThanOrEqual(BASELINE_MISALIGNED);
    },
    LOAD_ALL_COURSES_TIMEOUT_MS,
  );
});
