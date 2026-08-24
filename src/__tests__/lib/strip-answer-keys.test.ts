import { describe, it, expect } from 'vitest';
import { stripAnswerKeys } from '@/lib/strip-answer-keys';
import type { Question } from '@/data/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asQuestion = (q: Record<string, unknown>) => q as any as Question;

describe('stripAnswerKeys', () => {
  it('keeps the explanation on a teaching card', () => {
    // A teaching card's explanation IS the lesson content — the card has no
    // answer to protect. Stripping it left the speech bubble empty.
    const stripped = stripAnswerKeys(
      asQuestion({
        id: 'psy-sec10-u1-L3-T1',
        type: 'teaching',
        question: 'Newborns are not blank slates',
        explanation: 'Newborns arrive with a set of innate reflexes.',
        hint: 'Stroke a cheek and watch them turn.',
      }),
    ) as Record<string, unknown>;

    expect(stripped.explanation).toBe('Newborns arrive with a set of innate reflexes.');
    expect(stripped.hint).toBe('Stroke a cheek and watch them turn.');
  });

  it('keeps the explanation on a graded question for answer feedback', () => {
    const stripped = stripAnswerKeys(
      asQuestion({
        id: 'q1',
        type: 'true-false',
        question: 'Anything you want badly enough counts as a need.',
        correctAnswer: false,
        explanation: 'A need is something you must have to survive.',
      }),
    ) as Record<string, unknown>;

    expect(stripped.explanation).toBe('A need is something you must have to survive.');
  });

  it('still strips answer keys', () => {
    const stripped = stripAnswerKeys(
      asQuestion({
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which of these is a need?',
        correctAnswer: 0,
        correctAnswers: [0],
        correctOrder: [0, 1],
        keyPoints: ['survival'],
        explanation: 'A coat in freezing weather protects your health.',
      }),
    ) as Record<string, unknown>;

    expect('correctAnswer' in stripped).toBe(false);
    expect('correctAnswers' in stripped).toBe(false);
    expect('correctOrder' in stripped).toBe(false);
    expect('keyPoints' in stripped).toBe(false);
  });

  it('strips idealResponse from scenario steps', () => {
    const stripped = stripAnswerKeys(
      asQuestion({
        id: 'q3',
        type: 'scenario',
        question: 'Walk through it',
        steps: [{ prompt: 'First step?', idealResponse: 'the answer' }],
      }),
    ) as Record<string, unknown>;

    expect(stripped.steps).toEqual([{ prompt: 'First step?' }]);
  });
});
