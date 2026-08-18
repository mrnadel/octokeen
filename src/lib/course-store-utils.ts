import { FLAWLESS_MIN_QUESTIONS } from '@/lib/game-config';
import type { CourseProgress, Lesson, Unit } from '@/data/course/types';

/** Check if a lesson's content is loaded (not just lightweight metadata). */
export function isLessonContentLoaded(lesson: Lesson): boolean {
  const type = lesson.type ?? 'standard';
  switch (type) {
    case 'conversation':
      return (lesson.conversationNodes?.length ?? 0) > 0;
    case 'speed-round':
      return (lesson.speedQuestions?.length ?? 0) > 0;
    case 'timeline':
      return (lesson.timelineStages?.length ?? 0) > 0;
    case 'case-study':
      return (lesson.caseStudySections?.length ?? 0) > 0;
    default:
      return lesson.questions.length > 0;
  }
}

/** Get gradable item IDs for the session based on lesson type. */
export function getSessionIds(lesson: Lesson): string[] {
  const type = lesson.type ?? 'standard';
  switch (type) {
    case 'conversation':
      return (lesson.conversationNodes ?? [])
        .filter((n) => n.options && n.options.length > 0)
        .map((n) => n.id);
    case 'speed-round':
      return (lesson.speedQuestions ?? []).map((q) => q.id);
    case 'timeline':
      return (lesson.timelineStages ?? [])
        .filter((s) => s.choices && s.choices.length > 0)
        .map((s) => s.id);
    case 'case-study':
      return (lesson.caseStudySections ?? [])
        .filter((s) => s.checkpoint)
        .map((s) => s.checkpoint!.id);
    default:
      return lesson.questions.map((q) => q.id);
  }
}

/**
 * Whether a run counts as flawless: perfect accuracy over a meaningful number
 * of questions. Shared by lesson completion and the placement test, which
 * apply different multipliers to the same condition.
 */
export function isFlawlessRun(accuracy: number, totalQuestions: number): boolean {
  return accuracy === 100 && totalQuestions >= FLAWLESS_MIN_QUESTIONS;
}

/** A lesson credited as passed without being played (placement test / debug skip). */
export function createSkippedLessonProgress(today: string): CourseProgress['completedLessons'][string] {
  return {
    stars: 0,
    bestAccuracy: 0,
    attempts: 0,
    lastAttempted: today,
    passed: true,
    golden: false,
    answeredQuestionIds: [],
    correctQuestionIds: [],
  };
}

/**
 * Mark every not-yet-passed lesson in units `[fromUnitIndex, toUnitIndex)` as passed.
 * Returns a new completedLessons map; the input is not mutated.
 */
export function markUnitsPassed(
  completedLessons: CourseProgress['completedLessons'],
  courseData: Unit[],
  fromUnitIndex: number,
  toUnitIndex: number,
  today: string,
): CourseProgress['completedLessons'] {
  const updated = { ...completedLessons };
  for (let ui = fromUnitIndex; ui < toUnitIndex; ui++) {
    for (const lesson of courseData[ui]?.lessons ?? []) {
      if (!updated[lesson.id]?.passed) {
        updated[lesson.id] = createSkippedLessonProgress(today);
      }
    }
  }
  return updated;
}

/**
 * Given a flat linear index, return the previous lesson's ID.
 * Unit 0, Lesson 0 has no predecessor.
 */
export function getPreviousLessonId(courseData: Unit[], unitIndex: number, lessonIndex: number): string | null {
  if (unitIndex === 0 && lessonIndex === 0) return null;

  if (lessonIndex > 0) {
    const unit = courseData[unitIndex];
    if (!unit?.lessons) return null;
    return unit.lessons[lessonIndex - 1]?.id ?? null;
  }

  // First lesson of a unit -> last lesson of previous unit
  const prevUnit = courseData[unitIndex - 1];
  if (!prevUnit?.lessons?.length) return null;
  return prevUnit.lessons[prevUnit.lessons.length - 1].id;
}

/** Get default course progress object. */
export function getDefaultProgress(): CourseProgress {
  return {
    displayName: 'Engineer',
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activeDays: [],
    completedLessons: {},
  };
}
