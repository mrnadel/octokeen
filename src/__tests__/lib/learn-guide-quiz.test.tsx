import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GuideQuiz } from '@/components/learn/GuideQuiz';
import type { GuideQuizQuestion } from '@/data/learn/types';

const QUESTIONS: GuideQuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Which cost is sunk?',
    options: ['A refundable deposit', 'A non-refundable ticket'],
    correctIndex: 1,
    explanation: 'A refund makes the cost recoverable, so it is not sunk.',
  },
  {
    id: 'q2',
    scenario: 'You are forty minutes into a film you dislike.',
    prompt: 'What counts in the decision?',
    options: ['The ticket price', 'The next eighty minutes'],
    correctIndex: 1,
    explanation: 'Only the time still ahead of you is affected by the choice.',
  },
];

function renderQuiz() {
  return render(<GuideQuiz guideSlug="test-guide" professionId="psychology" questions={QUESTIONS} />);
}

describe('GuideQuiz', () => {
  it('renders every prompt and option before any interaction', () => {
    renderQuiz();
    for (const question of QUESTIONS) {
      expect(screen.getByText(new RegExp(question.prompt))).toBeTruthy();
      for (const option of question.options) expect(screen.getByText(option)).toBeTruthy();
    }
  });

  it('reveals the explanation once an option is chosen', () => {
    renderQuiz();
    expect(screen.queryByText(QUESTIONS[0].explanation)).toBeNull();

    fireEvent.click(screen.getByText('A refundable deposit'));
    expect(screen.getByText(QUESTIONS[0].explanation)).toBeTruthy();
  });

  it('keeps the first answer rather than letting a second click overwrite it', () => {
    renderQuiz();
    fireEvent.click(screen.getByText('A refundable deposit'));
    fireEvent.click(screen.getByText('A non-refundable ticket'));

    expect(screen.getByText('A refundable deposit').closest('button')?.disabled).toBe(true);
    expect(screen.queryByText(/out of 2/)).toBeNull();
  });

  it('shows the score only when every question has been answered', () => {
    renderQuiz();
    fireEvent.click(screen.getByText('A non-refundable ticket'));
    expect(screen.queryByText(/out of 2/)).toBeNull();

    fireEvent.click(screen.getByText('The next eighty minutes'));
    expect(screen.getByText(/2 out of 2/)).toBeTruthy();
  });
});
