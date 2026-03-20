'use client';

import { useState } from 'react';
import type { WhatFailsFirstQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check, X, ArrowDown } from 'lucide-react';

interface Props {
  question: WhatFailsFirstQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function WhatFailsFirstInput({ question, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    onSubmit(selected === question.correctAnswer);
  };

  return (
    <div>
      <p className="text-sm text-surface-500 mb-4 font-medium flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        Which component would fail first?
      </p>

      <div className="space-y-3">
        {question.components.map((component) => {
          const isSelected = selected === component.id;
          const isCorrect = component.id === question.correctAnswer;
          const showResult = submitted;

          return (
            <button
              key={component.id}
              onClick={() => !submitted && setSelected(component.id)}
              disabled={disabled || submitted}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                !showResult && !isSelected && 'border-surface-200 hover:border-surface-300 hover:bg-surface-50',
                !showResult && isSelected && 'border-red-400 bg-red-50',
                showResult && isCorrect && 'border-red-500 bg-red-50',
                showResult && isSelected && !isCorrect && 'border-surface-300 bg-surface-50',
                showResult && !isSelected && !isCorrect && 'border-surface-200 opacity-50',
              )}
            >
              <span className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold border-2 flex-shrink-0',
                !showResult && !isSelected && 'border-surface-300 text-surface-400',
                !showResult && isSelected && 'border-red-400 bg-red-400 text-white',
                showResult && isCorrect && 'border-red-500 bg-red-500 text-white',
                showResult && isSelected && !isCorrect && 'border-surface-300 bg-surface-300 text-white',
              )}>
                {showResult && isCorrect ? <AlertTriangle className="w-3.5 h-3.5" /> :
                 showResult && isSelected && !isCorrect ? <X className="w-3.5 h-3.5" /> :
                 component.id.toUpperCase()}
              </span>
              <span className={cn('text-sm', showResult && isCorrect ? 'text-red-800 font-medium' : 'text-surface-700')}>
                {component.text}
              </span>
              {showResult && isCorrect && (
                <span className="ml-auto badge bg-red-100 text-red-700 text-xs">Fails first</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Failure chain */}
      {submitted && (
        <div className="mt-5 space-y-4 animate-slide-up">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <span className="font-semibold text-red-800 text-sm">Failure Mode:</span>
            <p className="text-sm text-red-700 mt-1">{question.failureMode}</p>
          </div>

          {question.failureChain && question.failureChain.length > 0 && (
            <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
              <span className="font-semibold text-surface-700 text-sm">Failure Chain:</span>
              <div className="mt-3 space-y-2">
                {question.failureChain.map((event, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      {i < question.failureChain.length - 1 && (
                        <ArrowDown className="w-3 h-3 text-surface-300 my-1" />
                      )}
                    </div>
                    <span className="text-sm text-surface-600 pt-0.5">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={cn('mt-5 btn-primary w-full', !selected && 'opacity-50 cursor-not-allowed')}
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}
