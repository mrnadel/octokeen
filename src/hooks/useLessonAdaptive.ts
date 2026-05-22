import { useState, useMemo, useRef, useEffect } from 'react';
import { playSound } from '@/lib/sounds';
import {
  ADAPTIVE_ROLLING_WINDOW as ROLLING_WINDOW,
  ADAPTIVE_STRUGGLING_THRESHOLD as STRUGGLING_THRESHOLD,
  ADAPTIVE_CRUISING_THRESHOLD as CRUISING_THRESHOLD,
  ADAPTIVE_MIN_ANSWERS,
} from '@/lib/game-config';
import type { AdaptiveMode } from '@/components/lesson/AdaptiveToast';

export function getAdaptiveMode(recentAnswers: boolean[]): AdaptiveMode {
  if (recentAnswers.length < ADAPTIVE_MIN_ANSWERS) return 'normal';
  const window = recentAnswers.slice(-ROLLING_WINDOW);
  const accuracy = window.filter(Boolean).length / window.length;
  if (accuracy <= STRUGGLING_THRESHOLD) return 'struggling';
  if (accuracy >= CRUISING_THRESHOLD && window.length >= ROLLING_WINDOW) return 'cruising';
  return 'normal';
}

export interface UseLessonAdaptiveReturn {
  recentAnswers: boolean[];
  adaptiveMode: AdaptiveMode;
  adaptiveSeed: React.MutableRefObject<number>;
  pushAnswer: (correct: boolean) => void;
}

/**
 * Tracks the rolling window of recent answers and derives the current
 * adaptive difficulty mode (normal / struggling / cruising).
 * Plays a streak milestone sound when entering cruising mode.
 */
export function useLessonAdaptive(): UseLessonAdaptiveReturn {
  const [recentAnswers, setRecentAnswers] = useState<boolean[]>([]);
  const adaptiveMode = useMemo(() => getAdaptiveMode(recentAnswers), [recentAnswers]);
  const adaptiveSeed = useRef(0);
  const prevAdaptiveMode = useRef<AdaptiveMode>('normal');

  // Play a celebratory sound when entering cruising mode
  useEffect(() => {
    if (adaptiveMode === prevAdaptiveMode.current) return;
    prevAdaptiveMode.current = adaptiveMode;
    if (adaptiveMode === 'cruising') {
      playSound('streakMilestone');
    }
  }, [adaptiveMode]);

  const pushAnswer = (correct: boolean) => {
    setRecentAnswers((prev) => {
      const next = [...prev, correct];
      const mode = getAdaptiveMode(next);
      if (mode !== adaptiveMode) adaptiveSeed.current++;
      return next;
    });
  };

  return { recentAnswers, adaptiveMode, adaptiveSeed, pushAnswer };
}
