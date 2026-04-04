import type { QuestDefinition } from './engagement-types';

// --------------- Chest Rewards ---------------

export const dailyChestReward = { xp: 50, gems: 10 };
export const weeklyChestReward = { xp: 150, gems: 40 };

// --------------- Daily Quest Pool (10 quests) ---------------
//
// Rarity distribution: 4 Common, 3 Rare, 2 Epic, 1 Legendary
// Rewards per rarity — Common: 20 XP / 3 gems, Rare: 30 / 5,
//                       Epic: 45 / 8, Legendary: 70 / 12

export const dailyQuestPool: QuestDefinition[] = [
  // ---- Common (4) ----
  {
    id: 'dq-stale-topic',
    title: 'Dust Off',
    description: 'Practice a topic you haven\'t touched in 7+ days.',
    icon: '🧹',
    trackingKey: 'stale_topic_practiced',
    target: 1,
    rarity: 'common',
    reward: { xp: 20, gems: 3 },
  },
  {
    id: 'dq-earn-xp-100',
    title: 'XP Grind',
    description: 'Earn 100 XP in a single day.',
    icon: '⚡',
    trackingKey: 'xp_earned',
    target: 100,
    rarity: 'common',
    reward: { xp: 20, gems: 3 },
  },
  {
    id: 'dq-stars-3',
    title: 'Star Collector',
    description: 'Earn 3 stars across your sessions today.',
    icon: '⭐',
    trackingKey: 'stars_earned',
    target: 3,
    rarity: 'common',
    reward: { xp: 20, gems: 3 },
  },
  {
    id: 'dq-unit-lesson',
    title: 'On Track',
    description: 'Complete a lesson in your current unit.',
    icon: '🏗️',
    trackingKey: 'lessons_completed',
    target: 1,
    rarity: 'common',
    reward: { xp: 20, gems: 3 },
    filter: { currentUnit: true },
  },

  // ---- Rare (3) ----
  {
    id: 'dq-complete-lessons',
    title: 'Double Up',
    description: 'Complete 2 lessons today.',
    icon: '📚',
    trackingKey: 'lessons_completed',
    target: 2,
    rarity: 'rare',
    reward: { xp: 30, gems: 5 },
  },
  {
    id: 'dq-accuracy-80',
    title: 'Sharp Shooter',
    description: 'Finish a session with 80% or higher accuracy.',
    icon: '🎯',
    trackingKey: 'accuracy_above_threshold',
    target: 1,
    rarity: 'rare',
    reward: { xp: 30, gems: 5 },
    filter: { threshold: 0.8 },
  },
  {
    id: 'dq-daily-challenge',
    title: 'Daily Challenger',
    description: 'Complete today\'s daily challenge.',
    icon: '🗓️',
    trackingKey: 'daily_challenges_completed',
    target: 1,
    rarity: 'rare',
    reward: { xp: 30, gems: 5 },
  },

  // ---- Epic (2) ----
  {
    id: 'dq-correct-answers-15',
    title: 'Answer Machine',
    description: 'Get 15 questions correct today.',
    icon: '✅',
    trackingKey: 'questions_correct',
    target: 15,
    rarity: 'epic',
    reward: { xp: 45, gems: 8 },
  },
  {
    id: 'dq-fast-answers-5',
    title: 'Speed Round',
    description: 'Answer 5 questions correctly in under 30 seconds each.',
    icon: '⏱️',
    trackingKey: 'fast_answers',
    target: 5,
    rarity: 'epic',
    reward: { xp: 45, gems: 8 },
  },

  // ---- Legendary (1) ----
  {
    id: 'dq-perfect-session',
    title: 'Flawless',
    description: 'Complete a session with 100% accuracy (min 5 questions).',
    icon: '✨',
    trackingKey: 'perfect_sessions',
    target: 1,
    rarity: 'legendary',
    reward: { xp: 70, gems: 12 },
  },
];

// --------------- Weekly Quest Pool (10 quests) ---------------
//
// Rarity distribution: 4 Common, 3 Rare, 2 Epic, 1 Legendary
// Rewards per rarity — Common: 60 XP / 12 gems, Rare: 90 / 18,
//                       Epic: 130 / 25, Legendary: 200 / 40

export const weeklyQuestPool: QuestDefinition[] = [
  // ---- Common (4) ----
  {
    id: 'wq-lessons-5',
    title: 'Committed Learner',
    description: 'Complete 5 lessons this week.',
    icon: '📖',
    trackingKey: 'lessons_completed',
    target: 5,
    rarity: 'common',
    reward: { xp: 60, gems: 12 },
  },
  {
    id: 'wq-topics-4',
    title: 'Broad Mind',
    description: 'Practice 4 different topics this week.',
    icon: '🌍',
    trackingKey: 'topics_practiced',
    target: 4,
    rarity: 'common',
    reward: { xp: 60, gems: 12 },
  },
  {
    id: 'wq-unit-lessons-3',
    title: 'Unit Progress',
    description: 'Complete 3 lessons in your current unit.',
    icon: '🏗️',
    trackingKey: 'lessons_completed',
    target: 3,
    rarity: 'common',
    reward: { xp: 60, gems: 12 },
    filter: { currentUnit: true },
  },
  {
    id: 'wq-correct-50',
    title: 'The Fifty',
    description: 'Answer 50 questions correctly this week.',
    icon: '✅',
    trackingKey: 'questions_correct',
    target: 50,
    rarity: 'common',
    reward: { xp: 60, gems: 12 },
  },

  // ---- Rare (3) ----
  {
    id: 'wq-xp-500',
    title: 'XP Hunter',
    description: 'Earn 500 XP this week.',
    icon: '💥',
    trackingKey: 'xp_earned',
    target: 500,
    rarity: 'rare',
    reward: { xp: 90, gems: 18 },
  },
  {
    id: 'wq-stars-3x3',
    title: 'Triple Star',
    description: 'Get 3 stars in 3 different sessions this week.',
    icon: '🌟',
    trackingKey: 'stars_earned',
    target: 9,
    rarity: 'rare',
    reward: { xp: 90, gems: 18 },
  },
  {
    id: 'wq-accuracy-90-x3',
    title: 'Precision Expert',
    description: 'Achieve 90%+ accuracy in 3 different sessions this week.',
    icon: '🎯',
    trackingKey: 'accuracy_above_threshold',
    target: 3,
    rarity: 'rare',
    reward: { xp: 90, gems: 18 },
    filter: { threshold: 0.9 },
  },

  // ---- Epic (2) ----
  {
    id: 'wq-all-daily-challenges',
    title: 'Challenge Champion',
    description: 'Complete all 7 daily challenges this week.',
    icon: '🏆',
    trackingKey: 'daily_challenges_completed',
    target: 7,
    rarity: 'epic',
    reward: { xp: 130, gems: 25 },
  },
  {
    id: 'wq-streak-7',
    title: 'Streak Week',
    description: 'Maintain a 7-day practice streak.',
    icon: '🔥',
    trackingKey: 'streak_days',
    target: 7,
    rarity: 'epic',
    reward: { xp: 130, gems: 25 },
  },

  // ---- Legendary (1) ----
  {
    id: 'wq-finish-unit',
    title: 'Unit Complete',
    description: 'Finish all lessons in a unit this week.',
    icon: '🎓',
    trackingKey: 'lessons_completed',
    target: 1,
    rarity: 'legendary',
    reward: { xp: 200, gems: 40 },
    filter: { unitComplete: true },
  },
];

// --------------- Comeback Quests (3 common quests) ---------------

export const comebackQuests: QuestDefinition[] = [
  {
    id: 'cq-answer-questions',
    title: 'Back in the Game',
    description: 'Answer 5 questions to get warmed up.',
    icon: '👋',
    trackingKey: 'questions_correct',
    target: 5,
    rarity: 'common',
    reward: { xp: 30, gems: 10 },
  },
  {
    id: 'cq-complete-lesson',
    title: 'One Step at a Time',
    description: 'Complete 1 lesson to rebuild your momentum.',
    icon: '🚶',
    trackingKey: 'lessons_completed',
    target: 1,
    rarity: 'common',
    reward: { xp: 30, gems: 10 },
  },
  {
    id: 'cq-accuracy-70',
    title: 'Getting Back to It',
    description: 'Finish a session with 70%+ accuracy.',
    icon: '📈',
    trackingKey: 'accuracy_above_threshold',
    target: 1,
    rarity: 'common',
    reward: { xp: 30, gems: 10 },
    filter: { threshold: 0.7 },
  },
];
