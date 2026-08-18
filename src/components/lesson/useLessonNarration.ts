'use client';

import { useEffect } from 'react';
import type { CourseQuestion } from '@/data/course/types';
import { useNarration } from '@/hooks/useNarration';

/**
 * Narrates the current card and, once answered, its explanation.
 * Lessons play pre-generated Kokoro audio from Blob storage; practice mode
 * (no lesson id) falls back to browser TTS.
 */
export function useLessonNarration(
  question: CourseQuestion | null,
  lessonId: string | null,
  lastAnswerCorrect: boolean | null,
): void {
  const { speakFromFile, speak: narrateText, stop: stopNarration } = useNarration();

  useEffect(() => {
    if (!question) return;

    if (lessonId) {
      if (question.type === 'teaching') {
        speakFromFile(lessonId, question.id, undefined, question.explanation);
      } else {
        speakFromFile(lessonId, question.id, 'q', question.question);
      }
    } else {
      const parts: string[] = [];
      if (question.question) parts.push(question.question);
      if (question.type === 'teaching' && question.explanation) parts.push(question.explanation);
      narrateText(parts.join('. '));
    }

    return () => stopNarration();
  }, [question?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (lastAnswerCorrect === null || !question || question.type === 'teaching') return;
    if (!question.explanation) return;

    if (lessonId) {
      speakFromFile(lessonId, question.id, 'exp', question.explanation);
    } else {
      narrateText(question.explanation);
    }
  }, [lastAnswerCorrect, question?.id]); // eslint-disable-line react-hooks/exhaustive-deps
}
