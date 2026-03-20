'use client';

import { useState } from 'react';
import type { FreeTextQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { Send, CheckCircle, BookOpen } from 'lucide-react';

interface Props {
  question: FreeTextQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function FreeTextInput({ question, disabled, onSubmit }: Props) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!text.trim() || submitted) return;
    setSubmitted(true);
  };

  const handleSelfAssess = (correct: boolean) => {
    setSelfAssessment(correct);
    onSubmit(correct);
  };

  return (
    <div>
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled || submitted}
          placeholder="Type your answer here... Think about what an interviewer would want to hear."
          className="input min-h-[120px] resize-y pr-4"
          rows={4}
        />
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className={cn('mt-4 btn-primary w-full', !text.trim() && 'opacity-50 cursor-not-allowed')}
        >
          <Send className="w-4 h-4" /> Submit Answer
        </button>
      )}

      {/* Model Answer Comparison */}
      {submitted && (
        <div className="mt-5 space-y-4 animate-slide-up">
          {/* Model Answer */}
          <div className="p-5 bg-primary-50 border border-primary-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary-600" />
              <span className="font-semibold text-primary-800 text-sm">Model Answer</span>
            </div>
            <p className="text-sm text-primary-900 leading-relaxed">{question.sampleAnswer}</p>
          </div>

          {/* Key Points */}
          <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
            <span className="font-semibold text-surface-700 text-sm">Key Points to Hit:</span>
            <ul className="mt-2 space-y-1.5">
              {question.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Self-Assessment */}
          {selfAssessment === null && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm font-medium text-amber-800 mb-3">
                How did your answer compare? Be honest — it helps your progress tracking.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSelfAssess(true)}
                  className="flex-1 py-2.5 px-4 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors text-sm"
                >
                  I covered the key points
                </button>
                <button
                  onClick={() => handleSelfAssess(false)}
                  className="flex-1 py-2.5 px-4 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  I missed important parts
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
