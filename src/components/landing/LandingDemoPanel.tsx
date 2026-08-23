'use client';

import type { CSSProperties } from 'react';

import type { DemoQuestion } from './demo-questions';

export interface LandingDemoPanelProps {
  question: DemoQuestion;
  index: number;
  activeIndex: number;
  totalQuestions: number;
  /** Option the visitor picked on this question, or null while unanswered. */
  selected: number | null;
  showFeedback: boolean;
  onPick: (questionIndex: number, optionIndex: number) => void;
  onNext: () => void;
}

const NEUTRAL: CSSProperties = { background: '#fff', border: '2px solid #E2E8F0', color: '#0F172A', boxShadow: '0 2px 0 #E2E8F0' };
const RIGHT: CSSProperties = { background: '#DCFCE7', border: '2px solid #22C55E', color: '#166534', boxShadow: '0 2px 0 #86EFAC' };
const WRONG: CSSProperties = { background: '#FEE2E2', border: '2px solid #EF4444', color: '#991B1B', boxShadow: '0 2px 0 #FECACA' };
const MUTED: CSSProperties = { background: '#FAFAFA', border: '2px solid #F1F5F9', color: '#94A3B8', boxShadow: 'none' };

function optionColors(isSelected: boolean, isCorrect: boolean, answered: boolean, revealed: boolean): CSSProperties {
  if (!answered) return NEUTRAL;
  if (isSelected) return isCorrect ? RIGHT : WRONG;
  if (isCorrect && revealed) return RIGHT;
  return MUTED;
}

export function LandingDemoPanel({
  question, index, activeIndex, totalQuestions, selected, showFeedback, onPick, onNext,
}: LandingDemoPanelProps) {
  const answered = selected !== null;
  const isRight = answered && selected === question.correctIndex;

  return (
    <div className="demo-panel" hidden={index !== activeIndex}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {Array.from({ length: totalQuestions }, (_, dot) => (
            <div key={dot} style={{ width: 10, height: 10, borderRadius: '50%', background: dot < activeIndex ? '#14B8A6' : dot === activeIndex ? '#0D9488' : '#E2E8F0', transition: 'background 0.3s' }} />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: question.topicColor, background: `${question.topicColor}12`, padding: '4px 12px', borderRadius: 100 }}>{question.topic}</span>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', lineHeight: 1.5, marginBottom: 24 }}>{question.question}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctIndex;
          const isSelected = selected === optionIndex;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onPick(index, optionIndex)}
              disabled={answered}
              className="demo-option"
              style={{
                ...optionColors(isSelected, isCorrect, answered, showFeedback),
                width: '100%', textAlign: 'left', padding: '14px 18px', borderRadius: 14,
                fontSize: 15, fontWeight: 600, cursor: answered ? 'default' : 'pointer',
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 12,
                opacity: answered && !isSelected && !(isCorrect && showFeedback) ? 0.4 : 1,
              }}
            >
              <span style={{ flex: 1 }}>{option}</span>
              {answered && isSelected && (
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20" style={{ flexShrink: 0 }} aria-hidden="true">
                  {isCorrect
                    ? <path d="M20 6L9 17l-5-5" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M18 6L6 18M6 6l12 12" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />}
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div
        className="demo-feedback"
        hidden={!showFeedback}
        style={{
          marginTop: 16, padding: '18px 20px', borderRadius: 14,
          background: isRight ? '#F0FDF4' : '#FFF7ED',
          border: `1px solid ${isRight ? '#BBF7D0' : '#FED7AA'}`,
          animation: 'demoFadeIn 0.3s ease',
        }}
      >
        {showFeedback && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{isRight ? '\u2705' : '\uD83D\uDCA1'}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: isRight ? '#166534' : '#9A3412' }}>
              {isRight ? 'Correct!' : 'Good guess!'}
            </span>
          </div>
        )}
        <div style={{ fontSize: 14, fontWeight: 600, color: '#64748B', lineHeight: 1.6, marginBottom: 16 }}>{question.explanation}</div>
        {showFeedback && (
          <button
            type="button"
            onClick={onNext}
            className="demo-next-btn"
            style={{
              width: '100%', padding: '12px', borderRadius: 14, background: '#0D9488', color: '#fff',
              border: 'none', fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 0 #0F766E', letterSpacing: 0.3,
            }}
          >
            {index < totalQuestions - 1 ? 'Next' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
