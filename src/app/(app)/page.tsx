'use client';

import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { CourseHeader } from '@/components/course/CourseHeader';
import { CourseMap } from '@/components/course/CourseMap';
import { useCourseStore } from '@/store/useCourseStore';
import { useStore } from '@/store/useStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { streakMilestones } from '@/data/streak-milestones';
import { PracticeCard } from '@/components/course/PracticeCard';

// Lazy-load heavy components that are conditionally rendered
const LandingPage = lazy(() => import('@/components/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LessonView = lazy(() => import('@/components/lesson/LessonView'));
const ResultScreen = lazy(() => import('@/components/lesson/ResultScreen'));
const WelcomeBack = lazy(() => import('@/components/engagement/WelcomeBack').then(m => ({ default: m.WelcomeBack })));
const LeaguePromotion = lazy(() => import('@/components/engagement/LeaguePromotion').then(m => ({ default: m.LeaguePromotion })));
const StreakFreeze = lazy(() => import('@/components/engagement/StreakFreeze').then(m => ({ default: m.StreakFreeze })));
const StreakMilestone = lazy(() => import('@/components/engagement/StreakMilestone').then(m => ({ default: m.StreakMilestone })));
const BlueprintCelebration = lazy(() => import('@/components/engagement/BlueprintCelebration').then(m => ({ default: m.BlueprintCelebration })));
const CourseCompleteCelebration = lazy(() => import('@/components/engagement/CourseCompleteCelebration').then(m => ({ default: m.CourseCompleteCelebration })));

export default function HomePage() {
  const { status } = useSession();
  const activeLesson = useCourseStore((s) => s.activeLesson);
  const lessonResult = useCourseStore((s) => s.lessonResult);
  const chapterJustCompleted = useCourseStore((s) => s.chapterJustCompleted);
  const dismissChapterCompletion = useCourseStore((s) => s.dismissChapterCompletion);
  const courseJustCompleted = useCourseStore((s) => s.courseJustCompleted);
  const dismissCourseCompletion = useCourseStore((s) => s.dismissCourseCompletion);
  const currentStreak = useStore((s) => s.progress.currentStreak);
  const milestonesReached = useEngagementStore((s) => s.streak.milestonesReached);
  const addGems = useEngagementStore((s) => s.addGems);

  // Detect streak milestone to show
  const [shownMilestone, setShownMilestone] = useState<number | null>(null);

  const unclaimedMilestone = useMemo(() => {
    for (let i = streakMilestones.length - 1; i >= 0; i--) {
      const m = streakMilestones[i];
      if (currentStreak >= m.days && !milestonesReached.includes(m.days)) {
        return m;
      }
    }
    return null;
  }, [currentStreak, milestonesReached]);

  useEffect(() => {
    if (unclaimedMilestone && shownMilestone !== unclaimedMilestone.days) {
      setShownMilestone(unclaimedMilestone.days);
    }
  }, [unclaimedMilestone, shownMilestone]);

  const handleMilestoneClose = () => {
    if (unclaimedMilestone) {
      addGems(unclaimedMilestone.gems, `streak_milestone_${unclaimedMilestone.days}`);

      // Grant milestone frame + title to inventory
      const streakFrameMap: Record<number, string> = {
        30: 'reward-frame-streak-iron',
        60: 'reward-frame-streak-diamond',
        100: 'reward-frame-streak-centurion',
      };
      const streakTitleMap: Record<number, string> = {
        14: 'reward-title-consistent',
        30: 'reward-title-iron-will',
        60: 'reward-title-diamond-mind',
        100: 'reward-title-centurion',
      };
      useEngagementStore.setState((s) => {
        const frames = [...s.gems.inventory.activeFrames];
        const titles = [...s.gems.inventory.activeTitles];
        const frameId = streakFrameMap[unclaimedMilestone.days];
        const titleId = streakTitleMap[unclaimedMilestone.days];
        if (frameId && !frames.includes(frameId)) frames.push(frameId);
        if (titleId && !titles.includes(titleId)) titles.push(titleId);
        return {
          streak: {
            ...s.streak,
            milestonesReached: [...s.streak.milestonesReached, unclaimedMilestone.days],
          },
          gems: {
            ...s.gems,
            inventory: { ...s.gems.inventory, activeFrames: frames, activeTitles: titles },
          },
        };
      });
    }
    setShownMilestone(null);
  };

  if (status === 'loading') return null;

  if (status === 'unauthenticated') {
    return (
      <Suspense fallback={null}>
        <LandingPage />
      </Suspense>
    );
  }

  return (
    <>
      {/* Overlays - lazy loaded since they're conditional modals */}
      <Suspense fallback={null}>
        <WelcomeBack />
        <LeaguePromotion />
        <StreakFreeze />
        {unclaimedMilestone && shownMilestone === unclaimedMilestone.days && (
          <StreakMilestone milestone={unclaimedMilestone} onClose={handleMilestoneClose} />
        )}
      </Suspense>

      {/* Header */}
      <CourseHeader />

      {/* Smart Practice card */}
      <PracticeCard />

      {/* Course map */}
      <CourseMap />

      <Suspense fallback={null}>
        {activeLesson && <LessonView />}
        {lessonResult && <ResultScreen />}
        {!lessonResult && chapterJustCompleted && (
          <BlueprintCelebration
            unitIndex={chapterJustCompleted.unitIndex}
            isGolden={chapterJustCompleted.isGolden}
            onDismiss={dismissChapterCompletion}
          />
        )}
        {!lessonResult && !chapterJustCompleted && courseJustCompleted && (
          <CourseCompleteCelebration onDismiss={dismissCourseCompletion} />
        )}
      </Suspense>
    </>
  );
}
