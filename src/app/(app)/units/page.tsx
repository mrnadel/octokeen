'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useCourseStore } from '@/store/useCourseStore';
import { useSubscription } from '@/hooks/useSubscription';
import { LIMITS, isUnitUnlocked } from '@/lib/pricing';
import { getUnitTheme } from '@/lib/unitThemes';
import { PageHeader } from '@/components/ui/PageHeader';
import { UnitHeader } from '@/components/course/UnitHeader';

export default function UnitsPage() {
  const { status } = useSession();
  const progress = useCourseStore((s) => s.progress);
  const courseData = useCourseStore((s) => s.courseData);
  const activeProfession = useCourseStore((s) => s.activeProfession);
  const isGuest = status !== 'authenticated';
  const { isProUser } = useSubscription();

  const unitStats = useMemo(() => {
    return courseData.map((unit, unitIndex) => {
      const completedInUnit = unit.lessons.filter(
        (l) => progress.completedLessons[l.id]?.passed
      ).length;
      const isGuestLocked = isGuest && !isUnitUnlocked(LIMITS.free.unlockedUnits, unitIndex);
      const isProLocked = !isGuest && !isProUser && !isUnitUnlocked(LIMITS.free.unlockedUnits, unitIndex);
      const isAllGolden = completedInUnit === unit.lessons.length &&
        unit.lessons.every((l) => progress.completedLessons[l.id]?.golden);

      return {
        unit,
        unitIndex,
        completedInUnit,
        totalInUnit: unit.lessons.length,
        isLocked: isGuestLocked || isProLocked,
        lockMessage: isGuestLocked
          ? 'Sign up to unlock'
          : isProLocked
            ? 'Upgrade to Pro to unlock'
            : undefined,
        isAllGolden,
        theme: getUnitTheme(unitIndex),
      };
    });
  }, [courseData, progress.completedLessons, isGuest, isProUser]);

  const totalLessons = unitStats.reduce((sum, u) => sum + u.totalInUnit, 0);
  const totalCompleted = unitStats.reduce((sum, u) => sum + u.completedInUnit, 0);

  return (
    <>
      <PageHeader
        title="Browse Units"
        subtitle={`${totalCompleted} of ${totalLessons} lessons completed`}
        icon={<span style={{ fontSize: 18 }}>📚</span>}
      />

      <div
        className="flex flex-col px-3 sm:px-4 mx-auto"
        style={{ paddingTop: 16, paddingBottom: 40, gap: 12, maxWidth: 520 }}
      >
        {unitStats.map(({ unit, unitIndex, completedInUnit, totalInUnit, isLocked, lockMessage, isAllGolden, theme }) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(unitIndex * 0.06, 0.4), duration: 0.3 }}
          >
            <UnitHeader
              unit={unit}
              unitIndex={unitIndex}
              completedInUnit={completedInUnit}
              totalInUnit={totalInUnit}
              isLocked={isLocked}
              isAllGolden={isAllGolden}
              lockMessage={lockMessage}
              theme={theme}
              professionId={activeProfession}
              showProgress
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
