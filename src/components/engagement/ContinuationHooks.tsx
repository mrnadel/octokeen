'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  useDailyQuests,
  useLeague,
  useDoubleXpExpiry,
  useEngagementActions,
} from '@/store/useEngagementStore';
import { useCourseStore } from '@/store/useCourseStore';
import { generateContinuationHooks } from '@/lib/nudge-engine';
import { getXpToNextLevel } from '@/data/levels';
import { getTodayDate } from '@/lib/quest-engine';
import { DOUBLE_XP_FREE_DURATION_MS } from '@/data/engagement-types';
import { course } from '@/data/course';
import type { ContinuationHook } from '@/data/engagement-types';

interface Props {
  nextLessonId?: string | null;
}

function getHookIcon(hook: ContinuationHook): string {
  switch (hook.type) {
    case 'streak_freeze_low':
      return '🔥';
    case 'quest_near_complete':
      return '🎯';
    case 'league_rank_close':
      return '⚔️';
    case 'double_xp_active':
      return '⚡';
    default:
      return '✨';
  }
}

function getHookCta(hook: ContinuationHook, nextLessonId?: string | null): string {
  switch (hook.type) {
    case 'streak_freeze_low':
      return 'Keep Streak Alive';
    case 'quest_near_complete':
      return 'Complete Quest';
    case 'league_rank_close':
      return 'Climb the Ranks';
    case 'double_xp_active':
      return 'Activate 2× XP';
    default:
      return 'Continue';
  }
}

function deriveCurrentUnitInfo(completedLessons: Record<string, unknown>): {
  lessonsRemainingInUnit: number;
  nextLessonId: string;
  unitTitle: string;
} {
  // Find the first incomplete lesson across all units
  for (const unit of course) {
    for (let i = 0; i < unit.lessons.length; i++) {
      const lesson = unit.lessons[i];
      if (!(lesson.id in completedLessons)) {
        // Count remaining in this unit from this lesson onward
        const remaining = unit.lessons.length - i;
        return {
          lessonsRemainingInUnit: remaining,
          nextLessonId: lesson.id,
          unitTitle: unit.title,
        };
      }
    }
  }
  return { lessonsRemainingInUnit: 0, nextLessonId: '', unitTitle: '' };
}

export function ContinuationHooks({ nextLessonId }: Props) {
  const router = useRouter();
  const progress = useStore((s) => s.progress);
  const dailyQuests = useDailyQuests();
  const league = useLeague();
  const doubleXpExpiry = useDoubleXpExpiry();
  const { activateDoubleXp } = useEngagementActions();
  const courseProgress = useCourseStore((s) => s.progress);

  const todayDate = getTodayDate();
  const xpInfo = getXpToNextLevel(progress.totalXp);
  const doubleXpActive = doubleXpExpiry !== null && new Date(doubleXpExpiry) > new Date();

  const unitInfo = deriveCurrentUnitInfo(courseProgress.completedLessons);

  const hooks = generateContinuationHooks({
    currentStreak: progress.currentStreak,
    lastActiveDate: progress.lastActiveDate || null,
    todayDate,
    dailyQuests,
    lessonsRemainingInUnit: unitInfo.lessonsRemainingInUnit,
    nextLessonId: nextLessonId ?? unitInfo.nextLessonId,
    unitTitle: unitInfo.unitTitle,
    xpToNextLevel: xpInfo.xpNeeded,
    nextLevelNumber: xpInfo.next?.level ?? progress.currentLevel + 1,
    leagueRank: league.competitors.length + 1, // default rank if not computed
    doubleXpActive,
  });

  if (hooks.length === 0) return null;

  return (
    <div className="space-y-3">
      {hooks.map((hook, i) => {
        const isDoubleXp = hook.type === 'double_xp_active';
        return (
          <motion.div
            key={`${hook.type}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' }}
            className="rounded-xl p-4 shadow-sm flex items-start gap-3"
            style={{
              background: isDoubleXp ? '#FEF3C7' : '#FFFFFF',
              border: isDoubleXp ? '1.5px solid #F59E0B' : '1px solid #F3F4F6',
            }}
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-xl"
              style={{ background: isDoubleXp ? '#FDE68A' : '#F0F7FF' }}
            >
              {isDoubleXp ? (
                <Zap className="w-5 h-5" style={{ color: '#D97706' }} />
              ) : (
                <span>{getHookIcon(hook)}</span>
              )}
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold leading-snug"
                style={{ color: isDoubleXp ? '#92400E' : '#1F2937' }}
              >
                {hook.message}
              </p>
            </div>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isDoubleXp) {
                  activateDoubleXp(DOUBLE_XP_FREE_DURATION_MS);
                } else if (nextLessonId) {
                  router.push(`/learn/${nextLessonId}`);
                } else if (unitInfo.nextLessonId) {
                  router.push(`/learn/${unitInfo.nextLessonId}`);
                } else {
                  router.push('/learn');
                }
              }}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              style={{
                background: isDoubleXp ? '#F59E0B' : '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {getHookCta(hook, nextLessonId)}
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}
