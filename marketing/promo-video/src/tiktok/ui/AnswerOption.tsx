import React from 'react';
import { C } from '../theme';

export type OptionState = 'idle' | 'pressed' | 'correct' | 'dimmed';

const SURFACE: Record<OptionState, { bg: string; border: string; text: string }> = {
  idle: { bg: C.white, border: C.surface200, text: C.surface800 },
  pressed: { bg: '#EFF6FF', border: C.macaw, text: C.surface800 },
  correct: { bg: C.seaSponge, border: C.featherGreen, text: C.treeFrog },
  dimmed: { bg: C.white, border: C.surface200, text: C.surface800 },
};

export const AnswerOption: React.FC<{
  letter: string;
  label: string;
  state: OptionState;
  style?: React.CSSProperties;
}> = ({ letter, label, state, style }) => {
  const s = SURFACE[state];
  const correct = state === 'correct';
  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          padding: '30px 34px',
          borderRadius: 26,
          background: s.bg,
          border: `4px solid ${s.border}`,
          boxShadow: `0 6px 0 ${state === 'correct' ? C.featherGreen : C.surface200}`,
          opacity: state === 'dimmed' ? 0.32 : 1,
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 18,
            flexShrink: 0,
            background: correct ? C.featherGreen : C.surface100,
            color: correct ? C.white : C.surface500,
            fontSize: 30,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {correct ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5 9.5 18 20 6.5"
                stroke={C.white}
                strokeWidth={3.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            letter
          )}
        </div>
        <span style={{ fontSize: 40, fontWeight: 700, color: s.text }}>{label}</span>
      </div>
    </div>
  );
};
