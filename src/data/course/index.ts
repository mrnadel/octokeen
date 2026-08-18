import { unit1 } from './units/unit-1-statics';
import { unit2 } from './units/unit-2-dynamics';
import { unit3 } from './units/unit-3-strength';
import { unit4 } from './units/unit-4-thermo';
import { unit5 } from './units/unit-5-heat';
import { unit6 } from './units/unit-6-fluids';
import { unitHowThingsWork } from './units/unit-7-how-things-work';
import { unit7 } from './units/unit-7-materials';
import { unit8 } from './units/unit-8-machine';
import { unit9 } from './units/unit-9-gdt';
import { unit10 } from './units/unit-10-interview';
import type { Unit } from './types';

/**
 * Full mechanical-engineering course data (with question content).
 *
 * Lookup helpers live in `course-meta.ts` (getTotalLessonsMeta, getLessonByIdMeta)
 * and operate on the lightweight metadata — do not reimplement them here.
 */
export const course: Unit[] = [unit1, unit2, unit3, unit4, unit5, unit6, unitHowThingsWork, unit7, unit8, unit9, unit10];
