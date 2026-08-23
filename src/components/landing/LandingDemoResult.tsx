'use client';

import { FREE_COURSE_COUNT, FREE_QUESTION_COUNT } from './free-catalog';
import { LandingCtaButton } from './LandingCtaButton';

export interface LandingDemoResultProps {
  correct: number;
  total: number;
  onRestart: () => void;
}

export function LandingDemoResult({ correct, total, onRestart }: LandingDemoResultProps) {
  const perfect = correct === total;

  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '2px solid #0D9488', padding: '40px 32px', textAlign: 'center', boxShadow: '0 4px 24px rgba(13, 148, 136, 0.10)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{perfect ? '\uD83C\uDF89' : '\uD83D\uDCAA'}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>
        {perfect ? 'Perfect!' : 'Nice try!'}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#64748B', marginBottom: 32 }}>
        You got {correct} of {total} right
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#94A3B8', marginBottom: 28 }}>
        Imagine this with {FREE_QUESTION_COUNT}+ questions across {FREE_COURSE_COUNT} subjects
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <LandingCtaButton padding="14px 32px" />
        <button type="button" onClick={onRestart} className="demo-restart-btn" style={{ background: 'none', border: '2px solid #E2E8F0', borderRadius: 16, padding: '12px 24px', fontSize: 14, fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>Play again</button>
      </div>
    </div>
  );
}
