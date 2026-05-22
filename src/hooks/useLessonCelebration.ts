import { useState, useRef } from 'react';
import type { CelebrationType } from '@/components/lesson/MicroCelebration';

export interface CelebrationState {
  type: CelebrationType;
  streakCount?: number;
  key: number;
}

export interface UseLessonCelebrationReturn {
  celebration: CelebrationState | null;
  correctStreak: number;
  milestoneGlow: boolean;
  setCelebration: React.Dispatch<React.SetStateAction<CelebrationState | null>>;
  setCorrectStreak: React.Dispatch<React.SetStateAction<number>>;
  setMilestoneGlow: React.Dispatch<React.SetStateAction<boolean>>;
  triggerStreakCelebration: (streak: number) => void;
  triggerHalfwayCelebration: () => void;
  triggerLastQuestionCelebration: () => void;
  dismissCelebration: () => void;
}

/**
 * Manages micro-celebration state: correct streak tracking, milestone glow,
 * and celebration animation triggers (streak, halfway, last-question).
 */
export function useLessonCelebration(): UseLessonCelebrationReturn {
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  const celebrationKeyRef = useRef(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [milestoneGlow, setMilestoneGlow] = useState(false);

  const triggerStreakCelebration = (streak: number) => {
    celebrationKeyRef.current++;
    setCelebration({
      type: 'streak',
      streakCount: streak,
      key: celebrationKeyRef.current,
    });
  };

  const triggerHalfwayCelebration = () => {
    celebrationKeyRef.current++;
    setCelebration({ type: 'halfway', key: celebrationKeyRef.current });
    setMilestoneGlow(true);
    setTimeout(() => setMilestoneGlow(false), 1200);
  };

  const triggerLastQuestionCelebration = () => {
    celebrationKeyRef.current++;
    setCelebration({ type: 'last-question', key: celebrationKeyRef.current });
  };

  const dismissCelebration = () => setCelebration(null);

  return {
    celebration,
    correctStreak,
    milestoneGlow,
    setCelebration,
    setCorrectStreak,
    setMilestoneGlow,
    triggerStreakCelebration,
    triggerHalfwayCelebration,
    triggerLastQuestionCelebration,
    dismissCelebration,
  };
}
