'use client';

import { useState } from 'react';
import type { MaterialSelectionQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface Props {
  question: MaterialSelectionQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function MaterialSelectionInput({ question, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    onSubmit(selected === question.bestChoice);
  };

  return (
    <div>
      {/* Requirements */}
      <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl mb-5">
        <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Requirements</span>
        <ul className="mt-2 space-y-1">
          {question.requirements.map((req, i) => (
            <li key={i} className="text-sm text-surface-700 flex items-start gap-2">
              <span className="text-primary-500">•</span> {req}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-surface-500 mb-4 font-medium">Select the best material for this application:</p>

      <div className="space-y-3">
        {question.candidates.map((mat) => {
          const isSelected = selected === mat.id;
          const isBest = mat.id === question.bestChoice;
          const showResult = submitted;

          return (
            <button
              key={mat.id}
              onClick={() => !submitted && setSelected(mat.id)}
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
                   mat.id.toUpperCase()}
                </span>
                <div>
                  <span className="font-semibold text-sm text-surface-900">{mat.name}</span>
                  <p className="text-xs text-surface-500 mt-1">{mat.properties}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-slide-up">
          <span className="font-semibold text-blue-800 text-sm">Selection Reasoning:</span>
          <p className="text-sm text-blue-700 mt-2 leading-relaxed">{question.selectionReasoning}</p>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={cn('mt-5 btn-primary w-full', !selected && 'opacity-50 cursor-not-allowed')}
        >
          Select Material
        </button>
      )}
    </div>
  );
}
