import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCourseMetaForProfession, loadUnitData } from '@/data/course/course-meta';
import { PROFESSION_ID } from '@/data/professions';
import type { Question } from '@/data/types';

// Course content is static TypeScript files baked into the deployment.
// No DB round-trip needed. Serve privately so answer keys never reach CDN caches.
const CACHE_HEADERS = {
  'Cache-Control': 'private, max-age=300',
};

/**
 * Remove all answer-revealing fields from a question before sending it to the
 * client.  The client only needs the question stem, options/items, and metadata
 * required to render the UI — correct answers, explanations, and scoring hints
 * must never be included in the initial payload.
 */
function stripAnswerKeys(question: Question): Partial<Question> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const q = { ...question } as any;

  // BaseQuestion fields present on every question type
  delete q.explanation;
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

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const profession = searchParams.get('profession') || PROFESSION_ID.MECHANICAL_ENGINEERING;

  const meta = getCourseMetaForProfession(profession);
  const rawCourse = await Promise.all(
    meta.map((_, i) => loadUnitData(i, profession))
  );

  const course = rawCourse.map((unit) => ({
    ...unit,
    lessons: unit.lessons.map((lesson) => ({
      ...lesson,
      questions: lesson.questions.map(stripAnswerKeys),
    })),
  }));

  return NextResponse.json({ course }, { headers: CACHE_HEADERS });
}
