'use client';

import { useState } from 'react';
import type { MultiSelectQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { Check, Square, CheckSquare } from 'lucide-react';

interface Props {
  question: MultiSelectQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function MultiSelectInput({ question, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggleOption = (id: string) => {
    if (disabled || submitted) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleSubmit = () => {
    if (selected.size === 0 || submitted) return;
    setSubmitted(true);
    const correctSet = new Set(question.correctAnswers);
    const isCorrect = selected.size === correctSet.size && [...selected].every(s => correctSet.has(s));
    onSubmit(isCorrect);
  };

  return (
    <div>
      <p className="text-sm text-surface-500 mb-4 font-medium">Select all that apply:</p>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selected.has(option.id);
          const isCorrectOption = question.correctAnswers.includes(option.id);
          const showResult = submitted;

          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              disabled={disabled || submitted}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                !showResult && !isSelected && 'border-surface-200 hover:border-surface-300 hover:bg-surface-50',
                !showResult && isSelected && 'border-primary-500 bg-primary-50',
                showResult && isCorrectOption && 'border-emerald-500 bg-emerald-50',
                showResult && isSelected && !isCorrectOption && 'border-red-400 bg-red-50',
                showResult && !isSelected && !isCorrectOption && 'border-surface-200 opacity-50',
              )}
            >
              <span className="flex-shrink-0">
                {showResult ? (
                  isCorrectOption ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                  ) : isSelected ? (
                    <CheckSquare className="w-5 h-5 text-red-400" />
                  ) : (
                    <Square className="w-5 h-5 text-surface-300" />
                  )
                ) : isSelected ? (
                  <CheckSquare className="w-5 h-5 text-primary-500" />
                ) : (
                  <Square className="w-5 h-5 text-surface-300" />
                )}
              </span>
              <span className={cn(
                'text-sm leading-relaxed',
                showResult && isCorrectOption ? 'text-emerald-800 font-medium' : 'text-surface-700',
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
          disabled={selected.size === 0}
          className={cn('mt-5 btn-primary w-full', selected.size === 0 && 'opacity-50 cursor-not-allowed')}
        >
          Submit Selection
        </button>
      )}
    </div>
  );
}
