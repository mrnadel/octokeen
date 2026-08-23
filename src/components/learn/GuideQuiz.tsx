'use client';

import { useCallback, useRef, useState } from 'react';

import type { GuideQuizQuestion } from '@/data/learn/types';
import { analytics } from '@/lib/mixpanel';

import { GuideQuizItem } from './GuideQuizItem';

export interface GuideQuizProps {
  guideSlug: string;
  professionId: string;
  questions: readonly GuideQuizQuestion[];
}

function accuracyPercent(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

/**
 * Reinforcement check that follows the written answer.
 *
 * Deliberately not `LessonView`: that component locks scroll, owns the whole
 * viewport and reads the hearts and mastery stores, all of which are wrong
 * inside an article. This gates nothing, reveals the explanation whichever
 * option is picked, and never blocks the reader from finishing the page.
 */
export function GuideQuiz({ guideSlug, professionId, questions }: GuideQuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const completionReported = useRef(false);

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(
    question => answers[question.id] === question.correctIndex
  ).length;
  const isComplete = answeredCount === questions.length;

  const choose = useCallback(
    (question: GuideQuizQuestion, optionIndex: number) => {
      setAnswers(previous => {
        if (question.id in previous) return previous;
        const next = { ...previous, [question.id]: optionIndex };

        if (Object.keys(next).length === questions.length && !completionReported.current) {
          completionReported.current = true;
          const correct = questions.filter(q => next[q.id] === q.correctIndex).length;
          analytics.funnel({
            step: 'guide_quiz_completed',
            guideSlug,
            professionId,
            questionsAnswered: questions.length,
            accuracy: accuracyPercent(correct, questions.length),
          });
        }
        return next;
      });
    },
    [guideSlug, professionId, questions]
  );

  return (
    <section aria-labelledby="guide-quiz-heading" className="mt-10">
      <h2 id="guide-quiz-heading" className="text-xl font-extrabold text-surface-900 dark:text-surface-50 sm:text-2xl">
        Check yourself
      </h2>
      <p className="mt-2 text-[0.9375rem] leading-7 text-surface-600 dark:text-surface-300">
        {questions.length} questions, no score to beat and nothing to sign up for. Retrieval is
        what makes reading stick, so it is worth the ninety seconds.
      </p>

      <ol className="mt-5 space-y-4">
        {questions.map((question, index) => (
          <GuideQuizItem
            key={question.id}
            question={question}
            index={index}
            chosen={answers[question.id] ?? null}
            onChoose={optionIndex => choose(question, optionIndex)}
          />
        ))}
      </ol>

      {isComplete ? (
        <p
          aria-live="polite"
          className="mt-4 rounded-2xl bg-primary-50 px-4 py-3 text-center text-sm font-extrabold text-primary-800 dark:bg-primary-900/30 dark:text-primary-200"
        >
          {correctCount} out of {questions.length}. The full unit runs the same idea through
          scenarios until spotting it gets automatic.
        </p>
      ) : null}
    </section>
  );
}
