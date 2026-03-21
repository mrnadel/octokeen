'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  useDailyQuests,
  useLeague,
  useEngagementActions,
} from '@/store/useEngagementStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { useCourseStore } from '@/store/useCourseStore';
import { generateNudgeCards } from '@/lib/nudge-engine';
import { getTodayDate } from '@/lib/quest-engine';
import { achievements as allAchievements } from '@/data/achievements';
import { course, getTotalLessons } from '@/data/course';
import { getUserRank } from '@/lib/league-simulator';
import type { NudgeCard, NudgeType } from '@/data/engagement-types';
import type { TopicProgress } from '@/data/types';

// --------------- Color scheme per nudge type ---------------

const nudgeBorderColor: Record<NudgeType, string> = {
  streak_warning: '#EF4444',
  quest_expiring: '#3B82F6',
  league_falling: '#F59E0B',
  chest_ready: '#10B981',
  comeback: '#8B5CF6',
  neglected_topic: '#6B7280',
};

// --------------- CTA routes per nudge type ---------------

const nudgeCta: Record<NudgeType, string> = {
  streak_warning: '/learn',
  quest_expiring: '/quests',
  league_falling: '/league',
  chest_ready: '/learn',
  comeback: '/practice',
  neglected_topic: '/practice',
};

// --------------- Derive achievement proximity ---------------

function deriveAchievementProximity(
  achievementsUnlocked: string[],
  totalCorrect: number,
  topicProgress: TopicProgress[],
): { name: string; remaining: number } | null {
  // Check "ten correct" if not yet unlocked
  if (!achievementsUnlocked.includes('ach-ten-correct') && totalCorrect > 0) {
    const remaining = 10 - totalCorrect;
    if (remaining <= 5) {
      return { name: 'Building Momentum', remaining };
    }
  }
  // Check "fifty correct"
  if (!achievementsUnlocked.includes('ach-fifty-correct') && totalCorrect >= 10) {
    const remaining = 50 - totalCorrect;
    if (remaining <= 15) {
      return { name: 'Solid Foundation', remaining };
    }
  }
  // Check "five topics"
  if (!achievementsUnlocked.includes('ach-five-topics')) {
    const topicsAttempted = topicProgress.filter((t) => t.questionsAttempted >= 1).length;
    const remaining = 5 - topicsAttempted;
    if (remaining > 0 && remaining <= 3) {
      return { name: 'Renaissance Engineer', remaining };
    }
  }
  return null;
}

// --------------- Derive neglected topic ---------------

function deriveNeglectedTopic(
  topicProgress: TopicProgress[],
  todayDate: string,
  staleThresholdDays = 7,
): { name: string; daysSince: number } | null {
  if (topicProgress.length === 0) return null;

  const today = new Date(todayDate + 'T00:00:00Z');

  let worstTopic: { name: string; daysSince: number } | null = null;

  for (const tp of topicProgress) {
    if (!tp.lastAttempted) continue;
    const last = new Date(tp.lastAttempted + 'T00:00:00Z');
    const daysDiff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= staleThresholdDays) {
      if (!worstTopic || daysDiff > worstTopic.daysSince) {
        // Convert topicId to a readable name
        const readable = tp.topicId
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        worstTopic = { name: readable, daysSince: daysDiff };
      }
    }
  }

  return worstTopic;
}

// --------------- Derive course progress ---------------

function deriveCourseProgress(completedLessons: Record<string, unknown>): {
  courseProgressPercent: number;
  currentUnitLessonsRemaining: number;
  currentUnitTitle: string;
} {
  const totalLessons = getTotalLessons();
  const completedCount = Object.keys(completedLessons).length;
  const courseProgressPercent = totalLessons > 0 ? completedCount / totalLessons : 0;

  for (const unit of course) {
    for (const lesson of unit.lessons) {
      if (!(lesson.id in completedLessons)) {
        const completedInUnit = unit.lessons.filter((l) => l.id in completedLessons).length;
        const remaining = unit.lessons.length - completedInUnit;
        return {
          courseProgressPercent,
          currentUnitLessonsRemaining: remaining,
          currentUnitTitle: unit.title,
        };
      }
    }
  }

  return { courseProgressPercent, currentUnitLessonsRemaining: 0, currentUnitTitle: '' };
}

// --------------- Main component ---------------

export function NudgeCards() {
  const router = useRouter();
  const progress = useStore((s) => s.progress);
  const dailyQuests = useDailyQuests();
  const league = useLeague();
  const dismissedNudgesArr = useEngagementStore((s) => s.dismissedNudges);
  const { dismissNudge } = useEngagementActions();
  const courseProgress = useCourseStore((s) => s.progress);

  const todayDate = getTodayDate();
  const currentHour = new Date().getHours();

  const leagueRank = getUserRank(league.weeklyXp, league.competitors);

  // Build dismissedNudges map (type -> timestamp placeholder)
  const dismissedNudgesMap: Record<string, string> = {};
  for (const type of dismissedNudgesArr) {
    dismissedNudgesMap[type] = new Date().toISOString();
  }

  const achievementProximity = deriveAchievementProximity(
    progress.achievementsUnlocked,
    progress.totalQuestionsCorrect,
    progress.topicProgress,
  );

  const neglectedTopic = deriveNeglectedTopic(progress.topicProgress, todayDate);

  const courseInfo = deriveCourseProgress(courseProgress.completedLessons);

  const cards = generateNudgeCards({
    currentStreak: progress.currentStreak,
    lastActiveDate: progress.lastActiveDate || null,
    todayDate,
    currentHour,
    dailyQuests,
    leagueRank,
    leagueTier: league.currentTier,
    courseProgressPercent: courseInfo.courseProgressPercent,
    currentUnitLessonsRemaining: courseInfo.currentUnitLessonsRemaining,
    currentUnitTitle: courseInfo.currentUnitTitle,
    achievementProximity,
    neglectedTopic,
    dismissedNudges: dismissedNudgesMap,
  });

  if (cards.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {cards.map((card, i) => (
          <motion.div
            key={card.type}
            layout
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25, ease: 'easeOut' }}
            className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3"
            style={{
              borderLeft: `4px solid ${nudgeBorderColor[card.type]}`,
              border: `1px solid #F3F4F6`,
              borderLeftWidth: '4px',
              borderLeftColor: nudgeBorderColor[card.type],
            }}
          >
            {/* Icon */}
            <span className="text-2xl flex-shrink-0 mt-0.5">{card.icon}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 mb-0.5">{card.title}</p>
              <p className="text-xs text-gray-500 leading-snug mb-2">{card.body}</p>
              <button
                onClick={() => router.push(nudgeCta[card.type])}
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity"
                style={{
                  background: nudgeBorderColor[card.type],
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {card.cta}
              </button>
            </div>

            {/* Dismiss button */}
            {card.dismissible && (
              <button
                onClick={() => dismissNudge(card.type)}
                className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-colors"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
