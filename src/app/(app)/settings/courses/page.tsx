'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { PROFESSIONS } from '@/data/professions';
import { getCourseMetaForProfession } from '@/data/course/course-meta';
import { useCourseStore } from '@/store/useCourseStore';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { CourseIcon } from '@/components/course/CourseIcon';
import { cn } from '@/lib/utils';

export default function CoursesSettingsPage() {
  const router = useRouter();
  const activeProfession = useCourseStore((s) => s.activeProfession);
  const setActiveProfession = useCourseStore((s) => s.setActiveProfession);
  const completedLessons = useCourseStore((s) => s.progress.completedLessons);
  const grantedCourses = useCourseAccess();

  const courseStats = useMemo(() => {
    return PROFESSIONS.map((p) => {
      const meta = getCourseMetaForProfession(p.id);
      const totalLessons = meta.reduce((sum, u) => sum + u.lessons.length, 0);
      const allLessonIds = meta.flatMap((u) => u.lessons.map((l) => l.id));
      const completed = allLessonIds.filter((id) => completedLessons[id]?.passed).length;
      const isGated = p.requiresAccess && grantedCourses && !grantedCourses.includes(p.id);
      const isLocked = p.isComingSoon || isGated;
      return {
        ...p,
        totalLessons,
        completed,
        percent: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
        unitCount: meta.length,
        isLocked,
      };
    });
  }, [completedLessons, grantedCourses]);

  const handleSwitch = (professionId: string) => {
    setActiveProfession(professionId);
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-surface-700">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.back()}
            className="p-3 -ml-3 rounded-full hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-surface-400" />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-surface-50 ml-2">Courses</h1>
        </div>
      </div>

      <div className="px-3 sm:px-4 mt-6 space-y-3 max-w-lg mx-auto">
        {courseStats.map((course) => {
          const isActive = activeProfession === course.id;

          return (
            <button
              key={course.id}
              onClick={() => !course.isLocked && handleSwitch(course.id)}
              disabled={course.isLocked}
              className={cn(
                'w-full text-left rounded-2xl border-2 p-4 transition-all',
                course.isLocked && 'opacity-40 cursor-not-allowed',
                isActive
                  ? 'bg-white dark:bg-surface-800 shadow-md'
                  : 'bg-white dark:bg-surface-800 border-gray-100 dark:border-surface-700 hover:border-gray-200 dark:hover:border-surface-600 hover:shadow-sm'
              )}
              style={isActive ? { borderColor: course.color } : undefined}
            >
              <div className="flex items-center gap-3">
                {/* Course icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${course.color}15` }}>
                  <CourseIcon professionId={course.id} color={course.color} size={32} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-gray-900 dark:text-surface-100 truncate">
                      {course.name}
                    </span>
                    {isActive && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md text-white shrink-0" style={{ backgroundColor: course.color }}>
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${course.percent}%`,
                          backgroundColor: course.color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 dark:text-surface-500 tabular-nums shrink-0">
                      {course.percent}%
                    </span>
                  </div>

                  {/* Stats */}
                  <p className="text-[11px] text-gray-400 dark:text-surface-500 mt-1">
                    {course.completed}/{course.totalLessons} lessons
                    {' \u00B7 '}
                    {course.unitCount} units
                  </p>
                </div>

                {/* Active checkmark or chevron */}
                {isActive ? (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: course.color }}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : !course.isLocked ? (
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-surface-600 shrink-0" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
