import { toLocalDateString } from '@/lib/utils';
import { STAR_THRESHOLDS } from '@/lib/game-config';
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

/** Calculate star rating from accuracy percentage. */
export function calculateStars(accuracy: number): number {
  if (accuracy >= STAR_THRESHOLDS.THREE_STARS) return 3;
  if (accuracy >= STAR_THRESHOLDS.TWO_STARS) return 2;
  return 1;
}

/** Get today's date as a local date string. */
export function getTodayString(): string {
  return toLocalDateString(new Date());
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
