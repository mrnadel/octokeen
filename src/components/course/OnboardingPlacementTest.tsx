'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Mascot } from '@/components/ui/Mascot';
import { getCourseMetaForProfession, loadUnitData } from '@/data/course/course-meta';
import LessonView from '@/components/lesson/LessonView';
import type { SessionAdapter } from '@/components/lesson/LessonView';
import type { Unit, CourseQuestion } from '@/data/course/types';

/* ─── Constants ─── */

const PLACEMENT_QUESTION_COUNT = 5;

/* ─── Types ─── */

interface PlacementQuestion {
  question: CourseQuestion;
  unitIndex: number;
  unitTitle: string;
  unitIcon: string;
}

/* ─── Helpers ─── */

function pickQuestionsFromUnit(unit: Unit, unitIndex: number, count: number): PlacementQuestion[] {
  const mcQuestions: CourseQuestion[] = [];
  const tfQuestions: CourseQuestion[] = [];
  for (const lesson of unit.lessons) {
    for (const q of lesson.questions) {
      if (q.type === 'multiple-choice' || q.type === 'multi-select') {
        mcQuestions.push(q);
      } else if (q.type === 'true-false') {
        tfQuestions.push(q);
      }
    }
  }

  const eligible = mcQuestions.length > 0 ? mcQuestions : tfQuestions;
  if (eligible.length === 0) return [];

  const picked: PlacementQuestion[] = [];
  const step = Math.max(1, Math.floor(eligible.length / count));
  for (let i = 0; i < count && i * step < eligible.length; i++) {
    picked.push({
      question: eligible[i * step],
      unitIndex,
      unitTitle: unit.title,
      unitIcon: unit.icon,
    });
  }

  return picked;
}

/* ─── Component ─── */

interface OnboardingPlacementTestProps {
  /** Which profession to draw questions from */
  professionId: string;
  /** Fraction of the course where questions start (0 = basics, 0.3 = intermediate, 0.6 = advanced) */
  startFraction: number;
  /** Called with the placed unit index when the test finishes (including early exit) */
  onComplete: (placedUnitIndex: number) => void;
  /** Called when user quits the test without finishing */
  onExit: () => void;
}

export function OnboardingPlacementTest({
  professionId,
  startFraction,
  onComplete,
  onExit,
}: OnboardingPlacementTestProps) {
  const [placementQuestions, setPlacementQuestions] = useState<PlacementQuestion[]>([]);
  const [placementIndex, setPlacementIndex] = useState(0);
  const [highestPassedUnit, setHighestPassedUnit] = useState(-1);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const submittedRef = useRef<Set<string>>(new Set());
  const loadingRef = useRef(false);

  // Compute testStartUnit from fraction
  const meta = useMemo(() => getCourseMetaForProfession(professionId), [professionId]);
  const testStartUnit = Math.floor(startFraction * meta.length);

  // Load placement test questions
  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    // Reset state
    setPlacementIndex(0);
    setAnsweredIds(new Set());
    submittedRef.current = new Set();
    setHighestPassedUnit(-1);
    setPlacementQuestions([]);

    async function loadPlacementQuestions() {
      setLoadingUnits(true);
      const totalUnits = meta.length;
      const allQuestions: PlacementQuestion[] = [];

      // Sample from testStartUnit through the first ~60% of the remaining range
      const rangeStart = testStartUnit;
      const rangeEnd = Math.min(
        totalUnits - 1,
        testStartUnit + Math.max(2, Math.ceil((totalUnits - testStartUnit) * 0.6)) - 1,
      );
      const rangeSize = rangeEnd - rangeStart + 1;
      const count = Math.min(PLACEMENT_QUESTION_COUNT, rangeSize);

      const unitIndices: number[] = [];
      if (rangeSize <= count) {
        for (let i = rangeStart; i <= rangeEnd; i++) unitIndices.push(i);
      } else {
        for (let i = 0; i < count; i++) {
          unitIndices.push(rangeStart + Math.round(i * (rangeSize - 1) / (count - 1)));
        }
      }

      for (const idx of unitIndices) {
        try {
          const fullUnit = await loadUnitData(idx, professionId);
          const picked = pickQuestionsFromUnit(fullUnit, idx, 1);
          allQuestions.push(...picked);
        } catch {
          // Skip units that fail to load
        }
      }

      setPlacementQuestions(allQuestions);
      setLoadingUnits(false);
      loadingRef.current = false;
    }

    loadPlacementQuestions();
  }, [professionId, testStartUnit, meta]);

  // Compute placement and call onComplete
  const finishPlacement = useCallback(() => {
    // Cap onboarding placement at ~50% of the course
    const maxPlacement = Math.max(1, Math.floor(meta.length * 0.5));
    const raw = highestPassedUnit >= 0
      ? highestPassedUnit + 1
      : testStartUnit;
    const placed = Math.min(raw, maxPlacement);
    onComplete(placed);
  }, [highestPassedUnit, testStartUnit, meta, onComplete]);

  // Track answer correctness (no hearts — placement test is penalty-free)
  const handleAdapterSubmit = useCallback((questionId: string, correct: boolean) => {
    if (submittedRef.current.has(questionId)) return;
    submittedRef.current.add(questionId);

    setAnsweredIds(prev => {
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
    const pq = placementQuestions.find(p => p.question.id === questionId);
    if (correct && pq) {
      setHighestPassedUnit((prev) => Math.max(prev, pq.unitIndex));
    }
  }, [placementQuestions]);

  const handleAdapterNext = useCallback(() => {
    setPlacementIndex(prev => prev + 1);
  }, []);

  const handleAdapterComplete = useCallback(() => {
    finishPlacement();
  }, [finishPlacement]);

  const handleAdapterExit = useCallback(() => {
    onExit();
  }, [onExit]);

  // Build SessionAdapter for LessonView
  const TEST_THEME = { color: 'var(--color-primary-500)', dark: 'var(--color-primary-700)', bg: 'var(--color-primary-50)' };
  const placementAdapter: SessionAdapter | null = useMemo(() => {
    if (placementQuestions.length === 0 || placementIndex >= placementQuestions.length) return null;
    const pq = placementQuestions[placementIndex];
    if (!pq) return null;
    return {
      currentQuestion: pq.question,
      answeredCount: placementIndex,
      totalQuestions: placementQuestions.length,
      isCurrentAnswered: answeredIds.has(pq.question.id),
      isLastQuestion: placementIndex >= placementQuestions.length - 1,
      unitColor: TEST_THEME.color,
      theme: TEST_THEME,
      isGolden: false,
      submitAnswer: handleAdapterSubmit,
      nextQuestion: handleAdapterNext,
      complete: handleAdapterComplete,
      exit: handleAdapterExit,
      hasAnswers: placementIndex > 0,
      flagContentType: 'lesson-question' as const,
      exitLabel: 'Quit test',
      exitConfirmTitle: 'Quit placement test?',
      exitConfirmMessage: 'You\'ll be placed based on your answers so far.',
      noHearts: true,
    };
  }, [placementQuestions, placementIndex, answeredIds, handleAdapterSubmit, handleAdapterNext, handleAdapterComplete, handleAdapterExit]);

  // Loading state — full-screen with mascot
  if (loadingUnits) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 min-h-[60vh]">
        <Mascot pose="loading" size={120} />
        <div className="text-center">
          <p className="text-lg font-black text-surface-900 dark:text-white">Preparing your placement test</p>
          <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-1">Loading questions from your course...</p>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  // No questions available
  if (placementQuestions.length === 0 && !loadingUnits) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 min-h-[60vh]">
        <Mascot pose="worried" size={110} />
        <div className="text-center">
          <p className="text-lg font-black text-surface-900 dark:text-white">No questions available</p>
          <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-1">We couldn&apos;t load placement questions for this course</p>
        </div>
        <button
          onClick={() => onComplete(0)}
          className="py-3.5 px-10 rounded-2xl bg-primary-500 text-white font-extrabold text-base transition-all active:translate-y-[2px]"
          style={{ boxShadow: '0 5px 0 #0F766E' }}
        >
          START FROM BASICS
        </button>
      </div>
    );
  }

  if (!placementAdapter) return null;
  return <LessonView adapter={placementAdapter} />;
}
