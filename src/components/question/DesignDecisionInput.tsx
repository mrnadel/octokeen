'use client';

import { useState } from 'react';
import type { DesignDecisionQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { Wrench, Check, X } from 'lucide-react';

interface Props {
  question: DesignDecisionQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function DesignDecisionInput({ question, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    onSubmit(selected === question.bestOption);
  };

  return (
    <div>
      {/* Context */}
      <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl mb-5">
        <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Design Context</span>
        <p className="text-sm text-surface-700 mt-2 leading-relaxed">{question.context}</p>
      </div>

      <p className="text-sm text-surface-500 mb-4 font-medium flex items-center gap-2">
        <Wrench className="w-4 h-4 text-primary-500" />
        Choose the best design approach:
      </p>

      <div className="space-y-3">
        {question.designOptions.map((option) => {
          const isSelected = selected === option.id;
          const isBest = option.id === question.bestOption;
          const showResult = submitted;

          return (
            <button
              key={option.id}
              onClick={() => !submitted && setSelected(option.id)}
              disabled={disabled || submitted}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                !showResult && !isSelected && 'border-surface-200 hover:border-surface-300 hover:bg-surface-50',
                !showResult && isSelected && 'border-primary-500 bg-primary-50',
                showResult && isBest && 'border-emerald-500 bg-emerald-50',
                showResult && isSelected && !isBest && 'border-red-400 bg-red-50',
                showResult && !isSelected && !isBest && 'border-surface-200 opacity-50',
              )}
            >
              <div className="flex items-start gap-3">
                <span className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold border-2 flex-shrink-0 mt-0.5',
                  !showResult && !isSelected && 'border-surface-300 text-surface-400',
                  !showResult && isSelected && 'border-primary-500 bg-primary-500 text-white',
                  showResult && isBest && 'border-emerald-500 bg-emerald-500 text-white',
                  showResult && isSelected && !isBest && 'border-red-400 bg-red-400 text-white',
                )}>
                  {showResult && isBest ? <Check className="w-4 h-4" /> :
                   showResult && isSelected && !isBest ? <X className="w-4 h-4" /> :
                   option.id.toUpperCase()}
                </span>
                <div>
                  <span className="font-medium text-sm text-surface-900">{option.text}</span>
                  <p className="text-xs text-surface-500 mt-1">{option.tradeoffs}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Evaluation criteria */}
      {submitted && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-slide-up">
          <span className="font-semibold text-blue-800 text-sm">Evaluation Criteria:</span>
          <ul className="mt-2 space-y-1">
            {question.evaluationCriteria.map((c, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={cn('mt-5 btn-primary w-full', !selected && 'opacity-50 cursor-not-allowed')}
        >
          Submit Decision
        </button>
      )}
    </div>
  );
}
