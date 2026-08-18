// The CourseEditor reads `/api/content/course`, which serves the static course
// data verbatim — so it works with the canonical course types, not a local copy.
export type { CourseQuestion, Lesson, Unit } from '@/data/course/types';

export type View = 'units' | 'lessons' | 'questions';
