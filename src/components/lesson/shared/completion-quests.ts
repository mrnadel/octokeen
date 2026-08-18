import type { QuestTrackingKey } from '@/data/engagement-types';
import { reportFriendQuestProgress } from '@/hooks/useFriendQuestSync';

type QuestUpdater = (key: QuestTrackingKey, value?: number, filter?: Record<string, unknown>) => void;

const HIGH_ACCURACY = 90;
const GOOD_ACCURACY = 80;
const PERFECT_ACCURACY = 100;
/** A run this short can't count as a "perfect session". */
const MIN_QUESTIONS_FOR_PERFECT = 3;

export interface CompletionStats {
  accuracy: number;
  questionCount: number;
}

/**
 * Quest credit shared by the lesson-result and practice-summary screens:
 * accuracy thresholds, perfect sessions and topics practised.
 * Callers add their own mode-specific credit (stars, daily challenges, etc).
 */
export function creditAccuracyQuests(update: QuestUpdater, { accuracy, questionCount }: CompletionStats): void {
  if (accuracy >= HIGH_ACCURACY) update('accuracy_above_threshold', 1, { threshold: 0.9 });
  if (accuracy >= GOOD_ACCURACY) update('accuracy_above_threshold', 1, { threshold: 0.8 });
  if (accuracy === PERFECT_ACCURACY && questionCount >= MIN_QUESTIONS_FOR_PERFECT) {
    update('perfect_sessions', 1);
  }
  update('topics_practiced', 1);
}

export interface FriendQuestReport {
  xpEarned: number;
  accuracy: number;
  /** False when the learner failed the lesson — only XP is reported then. */
  completed: boolean;
}

/** Fire-and-forget friend-quest reporting for a finished lesson or practice session. */
export function reportCompletionToFriendQuests({ xpEarned, accuracy, completed }: FriendQuestReport): void {
  const events: Array<{ event: 'xp_earned' | 'lesson_completed' | 'accuracy_report'; value: number }> = [
    { event: 'xp_earned', value: xpEarned },
  ];
  if (completed) {
    events.push({ event: 'lesson_completed', value: 1 });
    events.push({ event: 'accuracy_report', value: accuracy });
  }
  reportFriendQuestProgress(events);
}
