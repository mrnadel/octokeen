'use client';

import { useState } from 'react';
import type { ScenarioQuestion } from '@/data/types';
import { cn } from '@/lib/utils';
import { MessageSquare, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';

interface Props {
  question: ScenarioQuestion;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}

export default function ScenarioInput({ question, disabled, onSubmit }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showStepAnswer, setShowStepAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<boolean | null>(null);

  const step = question.steps[currentStep];
  const isLastStep = currentStep === question.steps.length - 1;

  const handleSubmitStep = () => {
    if (!currentAnswer.trim()) return;
    setShowStepAnswer(true);
  };

  const handleNextStep = () => {
    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer('');
    setShowStepAnswer(false);

    if (isLastStep) {
      setCompleted(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSelfAssess = (correct: boolean) => {
    setSelfAssessment(correct);
    onSubmit(correct);
  };

  return (
    <div>
      {/* Context */}
      <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl mb-5">
        <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Scenario Context</span>
        <p className="text-sm text-surface-700 mt-2 leading-relaxed">{question.context}</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2 mb-4">
        {question.steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i < currentStep ? 'bg-emerald-400' :
              i === currentStep ? 'bg-primary-500' :
              'bg-surface-200'
            )}
          />
        ))}
      </div>

      {!completed ? (
        <>
          {/* Current Step */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-semibold text-primary-700">
                Step {currentStep + 1} of {question.steps.length}
              </span>
            </div>
            <p className="text-sm text-surface-800 font-medium leading-relaxed">{step.prompt}</p>
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            disabled={showStepAnswer}
            placeholder="Your response..."
            className="input min-h-[80px] resize-y"
            rows={3}
          />

          {!showStepAnswer ? (
            <button
              onClick={handleSubmitStep}
              disabled={!currentAnswer.trim()}
              className={cn('mt-3 btn-primary w-full', !currentAnswer.trim() && 'opacity-50 cursor-not-allowed')}
            >
              Submit Step Response
            </button>
          ) : (
            <div className="mt-4 animate-slide-up">
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-semibold text-primary-800">Ideal Response:</span>
                </div>
                <p className="text-sm text-primary-800 leading-relaxed">{step.idealResponse}</p>
              </div>
              <button onClick={handleNextStep} className="btn-primary w-full">
                {isLastStep ? 'Complete Scenario' : 'Next Step'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4 animate-slide-up">
          {/* Key Takeaway */}
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-800 text-sm">Key Takeaway:</span>
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed">{question.keyTakeaway}</p>
          </div>

          {selfAssessment === null && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm font-medium text-amber-800 mb-3">
                How well did you handle this scenario?
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleSelfAssess(true)} className="flex-1 py-2.5 px-4 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors text-sm">
                  Handled it well
                </button>
                <button onClick={() => handleSelfAssess(false)} className="flex-1 py-2.5 px-4 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors text-sm">
                  Need more practice
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
