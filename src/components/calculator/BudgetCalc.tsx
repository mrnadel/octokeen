'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fmt } from './calculatorHelpers';
import { CalcInput } from './CalcInput';

const BUDGET_SEGMENTS = [
  { label: 'Needs', pct: 50, color: '#3B82F6', bgColor: '#EFF6FF', examples: 'Rent, food, utilities, insurance' },
  { label: 'Wants', pct: 30, color: '#F59E0B', bgColor: '#FFFBEB', examples: 'Dining out, hobbies, streaming' },
  { label: 'Savings', pct: 20, color: '#10B981', bgColor: '#F0FDF4', examples: 'Emergency fund, investments, debt payoff' },
] as const;

export function BudgetCalc() {
  const [income, setIncome] = useState(5000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CalcInput label="Monthly Net Income" value={income} onChange={setIncome} prefix="$" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {BUDGET_SEGMENTS.map((seg) => {
          const amount = income * (seg.pct / 100);
          return (
            <motion.div
              key={seg.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: seg.bgColor,
                borderRadius: 12,
                padding: 14,
                borderLeft: `4px solid ${seg.color}`,
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>
                    {seg.label}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: seg.color,
                    marginLeft: 6,
                    background: 'white',
                    padding: '1px 6px',
                    borderRadius: 6,
                  }}>
                    {seg.pct}%
                  </span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: seg.color }}>
                  {fmt(amount)}
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>
                {seg.examples}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stacked bar */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>
          Breakdown
        </div>
        <div style={{
          display: 'flex',
          borderRadius: 8,
          overflow: 'hidden',
          height: 28,
        }}>
          {BUDGET_SEGMENTS.map((seg) => (
            <motion.div
              key={seg.label}
              initial={{ width: 0 }}
              animate={{ width: `${seg.pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                background: seg.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>
                {seg.pct}%
              </span>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
          {BUDGET_SEGMENTS.map((seg) => (
            <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{seg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly breakdown */}
      <div style={{
        background: 'white',
        borderRadius: 10,
        padding: 12,
        border: '1px solid #E2E8F0',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>
          Weekly Breakdown
        </div>
        {BUDGET_SEGMENTS.map((seg) => {
          const weekly = (income * (seg.pct / 100)) / 4.33;
          return (
            <div key={seg.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>{seg.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: seg.color }}>
                {fmt(weekly)}/week
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
