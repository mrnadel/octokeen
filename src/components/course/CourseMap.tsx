'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { course } from '@/data/course';
import { useCourseStore } from '@/store/useCourseStore';
import { UnitHeader } from './UnitHeader';
import { LessonNode } from './LessonNode';
import { UnitIllustration } from './UnitIllustrations';

/**
 * Connector dots between lesson nodes on the winding path.
 */
function PathConnector({ color, locked }: { color: string; locked: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 4,
            height: 4,
            backgroundColor: locked ? '#CBD5E1' : color,
            opacity: locked ? 0.3 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

export function CourseMap() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentLessonRef = useRef<HTMLDivElement>(null);
  const { progress, startLesson, isLessonUnlocked } = useCourseStore();
  const [jumpConfirm, setJumpConfirm] = useState<{ unitIndex: number; lessonIndex: number } | null>(null);

  // Determine lesson state helper
  const getLessonState = useCallback(
    (unitIndex: number, lessonIndex: number): 'completed' | 'current' | 'locked' => {
      const lessonId = course[unitIndex]?.lessons[lessonIndex]?.id;
      if (!lessonId) return 'locked';

      if (progress.completedLessons[lessonId]) {
        return 'completed';
      }
      if (isLessonUnlocked(unitIndex, lessonIndex)) {
        return 'current';
      }
      return 'locked';
    },
    [progress.completedLessons, isLessonUnlocked]
  );

  // Find the first "current" (incomplete but unlocked) lesson for auto-scroll
  const findFirstCurrentLesson = useCallback((): { unitIndex: number; lessonIndex: number } | null => {
    for (let ui = 0; ui < course.length; ui++) {
      for (let li = 0; li < course[ui].lessons.length; li++) {
        if (getLessonState(ui, li) === 'current') {
          return { unitIndex: ui, lessonIndex: li };
        }
      }
    }
    return null;
  }, [getLessonState]);

  // Auto-scroll to the current lesson on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLessonRef.current && scrollRef.current) {
        const container = scrollRef.current;
        const element = currentLessonRef.current;
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        const scrollTarget =
          container.scrollTop +
          (elementRect.top - containerRect.top) -
          containerRect.height / 2 +
          elementRect.height / 2;

        container.scrollTo({
          top: Math.max(0, scrollTarget),
          behavior: 'smooth',
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const firstCurrent = findFirstCurrentLesson();

  // Calculate the sinusoidal x-offset for a lesson in the winding path
  const getXOffset = (lessonIndex: number): number => {
    return Math.sin(lessonIndex * 1.2) * 50;
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
      style={{
        paddingTop: 8,
        paddingBottom: 120,
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="max-w-lg mx-auto">
        {course.map((unit, unitIndex) => {
          // Count completed lessons in this unit
          const completedInUnit = unit.lessons.filter(
            (lesson) => progress.completedLessons[lesson.id]
          ).length;

          return (
            <div key={unit.id}>
              {/* Unit header banner */}
              <UnitHeader
                unit={unit}
                unitIndex={unitIndex}
                completedInUnit={completedInUnit}
                totalInUnit={unit.lessons.length}
              />

              {/* Unit illustration at the top */}
              <div className="flex justify-center py-2" aria-hidden="true">
                <UnitIllustration
                  unitIndex={unitIndex}
                  color={unit.color}
                  className="w-48 h-auto opacity-80"
                />
              </div>

              {/* Lesson nodes in winding path */}
              <div className="flex flex-col items-center px-4">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const state = getLessonState(unitIndex, lessonIndex);
                  const isCurrent =
                    firstCurrent?.unitIndex === unitIndex &&
                    firstCurrent?.lessonIndex === lessonIndex;
                  const xOffset = getXOffset(lessonIndex);
                  const lessonProgress = progress.completedLessons[lesson.id];

                  // Determine connector state: locked if the NEXT lesson is locked
                  const isLastInUnit = lessonIndex === unit.lessons.length - 1;
                  const nextLessonLocked = !isLastInUnit
                    ? getLessonState(unitIndex, lessonIndex + 1) === 'locked'
                    : false;

                  // Show a smaller illustration every 3 lessons as a visual break
                  const showMidIllustration = lessonIndex > 0 && lessonIndex % 3 === 0;

                  return (
                    <div key={lesson.id}>
                      {/* Mid-lesson illustration break */}
                      {showMidIllustration && (
                        <div className="flex justify-center py-3" aria-hidden="true">
                          <UnitIllustration
                            unitIndex={unitIndex}
                            color={unit.color}
                            className="w-32 h-auto opacity-50"
                          />
                        </div>
                      )}

                      {/* Lesson node with sinusoidal offset */}
                      <div
                        ref={isCurrent ? currentLessonRef : undefined}
                        style={{
                          transform: `translateX(${xOffset}px)`,
                          transition: 'transform 0.3s ease-out',
                        }}
                      >
                        <LessonNode
                          lesson={lesson}
                          unitColor={unit.color}
                          state={state}
                          stars={lessonProgress?.stars}
                          onClick={() => {
                            if (state === 'locked') {
                              setJumpConfirm({ unitIndex, lessonIndex });
                            } else {
                              startLesson(unitIndex, lessonIndex);
                            }
                          }}
                        />
                      </div>

                      {/* Connector between lessons (not after the last lesson in unit) */}
                      {!isLastInUnit && (
                        <PathConnector
                          color={unit.color}
                          locked={nextLessonLocked}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* End-of-course marker */}
        <div className="flex flex-col items-center py-10">
          <div
            className="flex items-center justify-center rounded-full bg-accent-500 text-white text-2xl"
            style={{ width: 56, height: 56 }}
          >
            &#x1F3C6;
          </div>
          <p className="mt-3 text-sm font-semibold text-surface-700">
            Course Complete!
          </p>
          <p className="text-xs text-surface-400 mt-0.5">
            You&apos;re ready for your interview
          </p>
        </div>
      </div>

      {/* Jump-to-lesson confirmation popup */}
      <AnimatePresence>
        {jumpConfirm && (() => {
          const unit = course[jumpConfirm.unitIndex];
          const lesson = unit.lessons[jumpConfirm.lessonIndex];
          return (
            <motion.div
              key="jump-overlay"
              className="fixed inset-0 z-50 flex items-end justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setJumpConfirm(null)}
            >
              <div className="absolute inset-0 bg-black/40" />
              <motion.div
                className="relative w-full max-w-lg bg-white rounded-t-2xl p-5 pb-8"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring' as const, damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex items-center justify-center rounded-full text-white text-xl"
                    style={{ width: 48, height: 48, backgroundColor: unit.color }}
                  >
                    {lesson.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-400">
                      {unit.title}
                    </p>
                    <p className="text-base font-bold text-surface-900">
                      {lesson.title}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-surface-500 mb-5">
                  Jump ahead to this lesson? You can always go back and complete earlier lessons later.
                </p>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-surface-600 bg-surface-100 active:bg-surface-200 transition-colors"
                    onClick={() => setJumpConfirm(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white active:opacity-90 transition-opacity"
                    style={{ backgroundColor: unit.color }}
                    onClick={() => {
                      startLesson(jumpConfirm.unitIndex, jumpConfirm.lessonIndex);
                      setJumpConfirm(null);
                    }}
                  >
                    Jump to Lesson
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
