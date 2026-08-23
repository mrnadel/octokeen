import { PROFESSIONS } from '@/data/professions';

const FREE_PROFESSIONS = PROFESSIONS.filter((profession) => !profession.requiresAccess);

/**
 * Formatted with an explicit locale: these strings are rendered on the server
 * and hydrated in the browser, so the grouping separator has to match.
 */
export const FREE_QUESTION_COUNT: string = FREE_PROFESSIONS
  .reduce((sum, profession) => sum + profession.questionCount, 0)
  .toLocaleString('en-US');

export const FREE_COURSE_COUNT: number = FREE_PROFESSIONS.length;
