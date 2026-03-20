'use client';

import { useState } from 'react';
import type { MultipleChoiceQuestion, ConfidenceRatedQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface Props {
  question: MultipleChoiceQuestion | ConfidenceRatedQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function MultipleChoiceInput({ question, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id: string) => {
    if (disabled || submitted) return;
    setSelected(id);
  };

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    onSubmit(selected === question.correctAnswer);
  };

  return (
    <div>
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          const isCorrectOption = option.id === question.correctAnswer;
          const showResult = submitted;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={disabled || submitted}
              className={cn(
                'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                !showResult && !isSelected && 'border-surface-200 hover:border-surface-300 hover:bg-surface-50',
                !showResult && isSelected && 'border-primary-500 bg-primary-50',
                showResult && isCorrectOption && 'border-emerald-500 bg-emerald-50',
                showResult && isSelected && !isCorrectOption && 'border-red-400 bg-red-50',
                showResult && !isSelected && !isCorrectOption && 'border-surface-200 opacity-50',
              )}
            >
              <span className={cn(
                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors mt-0.5',
                !showResult && !isSelected && 'border-surface-300 text-surface-400',
                !showResult && isSelected && 'border-primary-500 bg-primary-500 text-white',
                showResult && isCorrectOption && 'border-emerald-500 bg-emerald-500 text-white',
                showResult && isSelected && !isCorrectOption && 'border-red-400 bg-red-400 text-white',
                showResult && !isSelected && !isCorrectOption && 'border-surface-300 text-surface-300',
              )}>
                {showResult && isCorrectOption ? (
                  <Check className="w-4 h-4" />
                ) : showResult && isSelected && !isCorrectOption ? (
                  <X className="w-4 h-4" />
                ) : (
                  option.id.toUpperCase()
                )}
              </span>
              <span className={cn(
                'text-sm leading-relaxed pt-0.5',
                showResult && isCorrectOption ? 'text-emerald-800 font-medium' : 'text-surface-700',
                showResult && isSelected && !isCorrectOption && 'text-red-700',
              )}>
                {option.text}
              </span>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={cn(
            'mt-5 btn-primary w-full',
            !selected && 'opacity-50 cursor-not-allowed'
          )}
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}
