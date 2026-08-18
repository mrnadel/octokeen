'use client';

import { forwardRef } from 'react';
import type { CourseQuestion } from '@/data/course/types';
import QuestionCard, { type QuestionCardHandle } from '@/components/lesson/QuestionCard';
import SortBucketsCard from '@/components/lesson/SortBucketsCard';
import MatchPairsCard from '@/components/lesson/MatchPairsCard';
import OrderStepsCard from '@/components/lesson/OrderStepsCard';
import MultiSelectCard from '@/components/lesson/MultiSelectCard';
import SliderEstimateCard from '@/components/lesson/SliderEstimateCard';
import ScenarioCard from '@/components/lesson/ScenarioCard';
import CategorySwipeCard from '@/components/lesson/CategorySwipeCard';
import RankOrderCard from '@/components/lesson/RankOrderCard';
import PickTheBestCard from '@/components/lesson/PickTheBestCard';
import ImageTapCard from '@/components/lesson/ImageTapCard';

export interface QuestionRendererProps {
  question: CourseQuestion;
  unitColor: string;
  answered: boolean;
  onAnswer: (correct: boolean, selectedOriginalIndex?: number) => void;
  onSelectionChange: (value: boolean) => void;
}

/**
 * Maps a question type to its card component. Single source of truth for the
 * question-type → card mapping used by both the standard lesson flow and the
 * case-study checkpoint flow. Teaching cards are handled by the caller.
 */
export const QuestionRenderer = forwardRef<QuestionCardHandle, QuestionRendererProps>(
  function QuestionRenderer({ question, unitColor, answered, onAnswer, onSelectionChange }, ref) {
    const props = { ref, question, onAnswer, onSelectionChange, answered, unitColor };

    switch (question.type) {
      case 'sort-buckets':
        return <SortBucketsCard {...props} />;
      case 'match-pairs':
        return <MatchPairsCard {...props} />;
      case 'order-steps':
        return <OrderStepsCard {...props} />;
      case 'multi-select':
        return <MultiSelectCard {...props} />;
      case 'slider-estimate':
        return <SliderEstimateCard {...props} />;
      case 'scenario':
        return <ScenarioCard {...props} />;
      case 'category-swipe':
        return <CategorySwipeCard {...props} />;
      case 'rank-order':
        return <RankOrderCard {...props} />;
      case 'pick-the-best':
        return <PickTheBestCard {...props} />;
      case 'image-tap':
        return <ImageTapCard {...props} />;
      default:
        return <QuestionCard {...props} />;
    }
  },
);
