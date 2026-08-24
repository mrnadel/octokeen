import type { Question } from '@/data/types';

/**
 * Remove all answer-revealing fields from a question before sending it to the
 * client.  The client only needs the question stem, options/items, and metadata
 * required to render the UI — correct answers and scoring hints must not be in
 * the initial payload.
 *
 * `explanation` is NOT stripped. On a teaching card the explanation is the
 * lesson itself (the card has no answer to protect), and on a graded question
 * the client renders it in the answer feedback. Removing it left teaching cards
 * with an empty speech bubble and answer feedback with no explanation, because
 * `useDbSync` overwrites the store's fully-loaded course data with this
 * payload and `isLessonContentLoaded` still reports the stripped lesson as
 * loaded, so nothing ever reloads the real content.
 */
export function stripAnswerKeys(question: Question): Partial<Question> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const q = { ...question } as any;

  // BaseQuestion fields present on every question type
  delete q.keyPoints;

  // MultipleChoiceQuestion / ConfidenceRatedQuestion / WhatFailsFirstQuestion
  delete q.correctAnswer;

  // MultiSelectQuestion
  delete q.correctAnswers;

  // RankingQuestion
  delete q.correctOrder;

  // TwoChoiceTradeoffQuestion
  delete q.preferredAnswer;
  delete q.acceptableAnswer;
  delete q.justification;

  // SpotTheFlawQuestion — remove the whole flaw object and the corrected version
  delete q.flaw;
  delete q.correctedStatement;

  // EstimationQuestion
  delete q.acceptableRange;

  // WhatFailsFirstQuestion
  delete q.failureMode;
  delete q.failureChain;

  // DesignDecisionQuestion
  delete q.bestOption;
  delete q.evaluationCriteria;

  // MaterialSelectionQuestion
  delete q.bestChoice;
  delete q.selectionReasoning;

  // ScenarioQuestion — strip idealResponse from each step
  if (Array.isArray(q.steps)) {
    q.steps = q.steps.map((step: { prompt: string; idealResponse: string }) => ({
      prompt: step.prompt,
    }));
  }

  return q;
}

