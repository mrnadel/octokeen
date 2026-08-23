'use client';

import { useCallback, useState } from 'react';

import { DEMO_QUESTIONS } from './demo-questions';
import { LandingDemoPanel } from './LandingDemoPanel';
import { LandingDemoResult } from './LandingDemoResult';

/** Pause between the tap and the explanation, so the pick registers visually. */
const FEEDBACK_DELAY_MS = 400;

/**
 * Three-question taster. Every question, option and explanation is in the
 * server-rendered markup; state only decides which one is on screen.
 */
export function LandingDemo() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const pick = useCallback((askedIndex: number, optionIndex: number) => {
    if (askedIndex !== questionIndex || selected !== null) return;
    setSelected(optionIndex);
    setTimeout(() => {
      if (optionIndex === DEMO_QUESTIONS[askedIndex].correctIndex) setCorrect(count => count + 1);
      setShowFeedback(true);
    }, FEEDBACK_DELAY_MS);
  }, [questionIndex, selected]);

  const next = useCallback(() => {
    setQuestionIndex(index => index + 1);
    setSelected(null);
    setShowFeedback(false);
  }, []);

  const restart = useCallback(() => {
    setQuestionIndex(0);
    setSelected(null);
    setShowFeedback(false);
    setCorrect(0);
  }, []);

  if (questionIndex >= DEMO_QUESTIONS.length) {
    return <LandingDemoResult correct={correct} total={DEMO_QUESTIONS.length} onRestart={restart} />;
  }

  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ height: 4, background: '#F1F5F9' }}>
        <div style={{ height: '100%', background: '#14B8A6', width: `${(questionIndex / DEMO_QUESTIONS.length) * 100}%`, transition: 'width 0.5s ease', borderRadius: '0 4px 4px 0' }} />
      </div>

      <div style={{ padding: '28px 28px 32px' }}>
        {DEMO_QUESTIONS.map((question, index) => (
          <LandingDemoPanel
            key={question.question}
            question={question}
            index={index}
            activeIndex={questionIndex}
            totalQuestions={DEMO_QUESTIONS.length}
            selected={index === questionIndex ? selected : null}
            showFeedback={index === questionIndex && showFeedback}
            onPick={pick}
            onNext={next}
          />
        ))}
      </div>
    </div>
  );
}
