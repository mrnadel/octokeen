'use client';

import { useState } from 'react';
import type { TwoChoiceTradeoffQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { Check, ArrowRight } from 'lucide-react';

interface Props {
  question: TwoChoiceTradeoffQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function TwoChoiceInput({ question, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    const correct = selected === question.preferredAnswer || question.acceptableAnswer === 'either';
    onSubmit(correct);
  };

  return (
    <div>
      <p className="text-sm text-surface-500 mb-4 font-medium">Choose the better approach and consider the tradeoffs:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isPreferred = choice.id === question.preferredAnswer;
          const showResult = submitted;

          return (
            <button
              key={choice.id}
              onClick={() => !submitted && setSelected(choice.id)}
              disabled={disabled || submitted}
              className={cn(
                'relative flex flex-col p-5 rounded-xl border-2 text-left transition-all duration-200',
                !showResult && !isSelected && 'border-surface-200 hover:border-surface-300 hover:bg-surface-50',
                !showResult && isSelected && 'border-primary-500 bg-primary-50 shadow-sm',
                showResult && isPreferred && 'border-emerald-500 bg-emerald-50',
                showResult && isSelected && !isPreferred && question.acceptableAnswer !== 'either' && 'border-amber-400 bg-amber-50',
                showResult && isSelected && question.acceptableAnswer === 'either' && 'border-emerald-500 bg-emerald-50',
              )}
            >
              {showResult && isPreferred && (
                <span className="absolute top-3 right-3 badge-success">
                  <Check className="w-3 h-3" /> Preferred
                </span>
              )}

              <span className="font-semibold text-surface-900 mb-3">{choice.text}</span>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-emerald-600 font-medium">Pros:</span>
                  <ul className="mt-1 space-y-1">
                    {choice.pros.map((p, i) => (
                      <li key={i} className="text-surface-600 flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-red-500 font-medium">Cons:</span>
                  <ul className="mt-1 space-y-1">
                    {choice.cons.map((c, i) => (
                      <li key={i} className="text-surface-600 flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">-</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {submitted && question.justification && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Tradeoff analysis:</span> {question.justification}
          </p>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={cn('mt-5 btn-primary w-full', !selected && 'opacity-50 cursor-not-allowed')}
        >
          Submit Choice <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
