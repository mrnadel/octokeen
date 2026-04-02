import { TOTAL_TOPICS, type Difficulty, type QuestionType } from '@/data/types';
import { getTodayDate } from '@/lib/quest-engine';
import {
  BASE_XP, INCORRECT_ANSWER_XP_RATE, SPEED_BONUS, CONFIDENCE_BONUS,
  MASTERY_VOLUME_CAP, INTERVIEW_READINESS,
} from '@/lib/game-config';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  // Use calendar-day comparison so 11:59pm vs 12:01am counts as different days
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((today.getTime() - dateDay.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateStr);
}

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'beginner': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'intermediate': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
  }
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'beginner': return 'Beginner';
    case 'intermediate': return 'Intermediate';
    case 'advanced': return 'Advanced';
  }
}

export function getQuestionTypeLabel(type: QuestionType): string {
  const labels: Record<QuestionType, string> = {
    'multiple-choice': 'Multiple Choice',
    'two-choice-tradeoff': 'Tradeoff',
    'multi-select': 'Multi-Select',
    'ranking': 'Ranking',
    'scenario': 'Scenario',
    'spot-the-flaw': 'Spot the Flaw',
    'estimation': 'Estimation',
    'confidence-rated': 'Confidence Check',
    'what-fails-first': 'What Fails First?',
    'design-decision': 'Design Decision',
    'material-selection': 'Material Selection',
  };
  return labels[type] || type;
}

export function getQuestionTypeIcon(type: QuestionType): string {
  const icons: Record<QuestionType, string> = {
    'multiple-choice': '○',
    'two-choice-tradeoff': '⇄',
    'multi-select': '☑',
    'ranking': '≡',
    'scenario': '📋',
    'spot-the-flaw': '🔍',
    'estimation': '📏',
    'confidence-rated': '🎯',
    'what-fails-first': '⚠️',
    'design-decision': '🔧',
    'material-selection': '🧱',
  };
  return icons[type] || '?';
}

export function calculateXP(question: { difficulty: Difficulty }, correct: boolean, timeSpent: number, confidence?: number): number {
  if (!correct) return Math.round(baseXPForDifficulty(question.difficulty) * INCORRECT_ANSWER_XP_RATE);

  let xp = baseXPForDifficulty(question.difficulty);

  // Speed bonus: up to 30% extra for quick answers
  if (timeSpent < SPEED_BONUS.FAST_THRESHOLD_S) xp *= SPEED_BONUS.FAST_MULTIPLIER;
  else if (timeSpent < SPEED_BONUS.MEDIUM_THRESHOLD_S) xp *= SPEED_BONUS.MEDIUM_MULTIPLIER;

  // Confidence calibration bonus
  if (confidence !== undefined) {
    if (confidence >= 4 && correct) xp *= CONFIDENCE_BONUS.CORRECT_CONFIDENT;
    if (confidence <= 2 && correct) xp *= CONFIDENCE_BONUS.CORRECT_SURPRISED;
  }

  return Math.round(xp);
}

function baseXPForDifficulty(difficulty: Difficulty): number {
  return BASE_XP[difficulty];
}

export function calculateMastery(attempted: number, correct: number, recency: number = 1): number {
  if (attempted === 0) return 0;
  const accuracy = correct / attempted;
  const volume = Math.min(attempted / MASTERY_VOLUME_CAP, 1);
  return Math.round(accuracy * volume * recency * 100);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export { getTodayDate as getTodayString } from '@/lib/quest-engine';

export function toLocalDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toLocalDateString(d);
}

export function getStreakStatus(lastActiveDate: string): 'active' | 'at-risk' | 'broken' {
  if (!lastActiveDate) return 'broken';
  const today = getTodayDate();
  if (lastActiveDate === today) return 'active';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalDateString(yesterday);
  if (lastActiveDate === yesterdayStr) return 'at-risk';
  return 'broken';
}

export function getInterviewReadiness(topicProgress: Record<string, { accuracy: number; attempted: number }>): number {
  const topics = Object.values(topicProgress);
  if (topics.length === 0) return 0;

  const { WEIGHTS, MIN_COVERAGE_ATTEMPTS, MIN_DEPTH_ATTEMPTS } = INTERVIEW_READINESS;
  const totalTopics = TOTAL_TOPICS;

  const coverage = topics.filter(t => t.attempted >= MIN_COVERAGE_ATTEMPTS).length / totalTopics;
  const avgAccuracy = topics.reduce((sum, t) => sum + (t.attempted > 0 ? t.accuracy : 0), 0) / Math.max(topics.length, 1);
  const depth = topics.filter(t => t.attempted >= MIN_DEPTH_ATTEMPTS).length / totalTopics;

  return Math.round((coverage * WEIGHTS.coverage + avgAccuracy * WEIGHTS.accuracy + depth * WEIGHTS.depth) * 100);
}
