'use client';

import { useState } from 'react';
import type { SpotTheFlawQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  question: SpotTheFlawQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function SpotTheFlawInput({ question, disabled, onSubmit }: Props) {
  const [userExplanation, setUserExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
  };

  const handleSelfAssess = (correct: boolean) => {
    setSelfAssessment(correct);
    onSubmit(correct);
  };

  return (
    <div>
      {/* Statement to analyze */}
      <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-xl mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">Read this claim carefully:</span>
        </div>
        <p className={cn(
          'text-surface-800 leading-relaxed italic',
          submitted && 'relative'
        )}>
          &ldquo;{question.statement}&rdquo;
        </p>
      </div>

      {/* User input */}
      {!submitted && (
        <>
          <textarea
            value={userExplanation}
            onChange={(e) => setUserExplanation(e.target.value)}
            disabled={disabled}
            placeholder="What's wrong with this claim? Explain the flaw..."
            className="input min-h-[80px] resize-y"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            className="mt-4 btn-primary w-full"
          >
            <AlertTriangle className="w-4 h-4" /> Reveal the Flaw
          </button>
        </>
      )}

      {/* Flaw explanation */}
      {submitted && (
        <div className="space-y-4 animate-slide-up">
          <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-red-800 text-sm">The Flaw:</span>
            </div>
            <p className="text-sm text-red-800 leading-relaxed">{question.flaw.flawExplanation}</p>
          </div>

          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-emerald-800 text-sm">Corrected Statement:</span>
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed italic">
              &ldquo;{question.correctedStatement}&rdquo;
            </p>
          </div>

          {selfAssessment === null && (
            <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
              <p className="text-sm font-medium text-surface-700 mb-3">Did you identify the flaw correctly?</p>
              <div className="flex gap-3">
                <button onClick={() => handleSelfAssess(true)} className="flex-1 py-2.5 px-4 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors text-sm">
                  Yes, I found it
                </button>
                <button onClick={() => handleSelfAssess(false)} className="flex-1 py-2.5 px-4 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors text-sm">
                  No, I missed it
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
