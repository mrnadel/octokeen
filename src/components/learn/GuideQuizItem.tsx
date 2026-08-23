'use client';

import { Check, X } from 'lucide-react';

import type { GuideQuizQuestion } from '@/data/learn/types';

export interface GuideQuizItemProps {
  question: GuideQuizQuestion;
  index: number;
  /** Index the reader picked, or null while unanswered. */
  chosen: number | null;
  onChoose: (optionIndex: number) => void;
}

function optionClasses(isChosen: boolean, isCorrect: boolean, answered: boolean): string {
  const base =
    'flex w-full items-start gap-2.5 rounded-xl border-2 px-3.5 py-3 text-left text-[0.9375rem] leading-6 transition-colors';
  if (!answered) {
    return `${base} border-surface-200 bg-white text-surface-700 hover:border-primary-400 hover:bg-primary-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-600 dark:hover:bg-surface-800`;
  }
  if (isCorrect) {
    return `${base} border-accent-500 bg-accent-50 text-accent-900 dark:border-accent-600 dark:bg-accent-900/30 dark:text-accent-100`;
  }
  if (isChosen) {
    return `${base} border-danger-400 bg-danger-50 text-danger-900 dark:border-danger-600 dark:bg-danger-900/30 dark:text-danger-100`;
  }
  return `${base} border-surface-200 bg-white text-surface-400 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-500`;
}

export function GuideQuizItem({ question, index, chosen, onChoose }: GuideQuizItemProps) {
  const answered = chosen !== null;

  return (
    <li className="rounded-2xl border-2 border-surface-200 bg-surface-50 p-4 dark:border-surface-800 dark:bg-surface-900/60">
      {question.scenario ? (
        <p className="mb-2 rounded-xl bg-white px-3 py-2 text-sm italic leading-6 text-surface-500 dark:bg-surface-900 dark:text-surface-400">
          {question.scenario}
        </p>
      ) : null}

      <p className="text-[0.9375rem] font-extrabold leading-6 text-surface-900 dark:text-surface-100">
        {index + 1}. {question.prompt}
      </p>

      <div className="mt-3 space-y-2">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctIndex;
          const isChosen = optionIndex === chosen;
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              aria-pressed={isChosen}
              onClick={() => onChoose(optionIndex)}
              className={optionClasses(isChosen, isCorrect, answered)}
            >
              {answered && isCorrect ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : null}
              {answered && isChosen && !isCorrect ? (
                <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : null}
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {answered ? (
        <p className="mt-3 text-sm leading-6 text-surface-600 dark:text-surface-300">
          {question.explanation}
        </p>
      ) : null}
    </li>
  );
}
