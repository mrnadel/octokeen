'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { fmt } from './calculatorHelpers';
import { CalcInput } from './CalcInput';
import { ResultRow } from './ResultRow';

export function CompoundInterestCalc() {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    // Future value of lump sum + future value of annuity
    const fvLump = initial * Math.pow(1 + r, n);
    const fvAnnuity = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) : monthly * n;
    const finalBalance = fvLump + fvAnnuity;
    const totalContributions = initial + monthly * n;
    const totalInterest = finalBalance - totalContributions;
    return { finalBalance, totalContributions, totalInterest };
  }, [initial, monthly, rate, years]);

  const contribPct = result.finalBalance > 0
    ? (result.totalContributions / result.finalBalance) * 100
    : 0;
  const interestPct = result.finalBalance > 0
    ? (result.totalInterest / result.finalBalance) * 100
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <CalcInput label="Initial Amount" value={initial} onChange={setInitial} prefix="$" />
        <CalcInput label="Monthly Contribution" value={monthly} onChange={setMonthly} prefix="$" />
        <CalcInput label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
        <CalcInput label="Time Period" value={years} onChange={setYears} suffix="years" min={1} max={50} />
      </div>

      <motion.div
        key={`${initial}-${monthly}-${rate}-${years}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: '#F0FDF4',
          borderRadius: 12,
          padding: 16,
          border: '1.5px solid #A7F3D0',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: '#047857', marginBottom: 4 }}>
          Final Balance
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#059669', lineHeight: 1.2 }}>
          {fmt(result.finalBalance)}
        </div>
      </motion.div>

      <div>
        <ResultRow label="Total Contributions" value={fmt(result.totalContributions)} color="#3B82F6" />
        <ResultRow label="Total Interest Earned" value={fmt(result.totalInterest)} color="#10B981" />
      </div>

      {/* Visual bar */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>
          Contributions vs Interest
        </div>
        <div style={{
          display: 'flex',
          borderRadius: 8,
          overflow: 'hidden',
          height: 28,
          background: '#F1F5F9',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(contribPct, 0)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              background: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: contribPct > 10 ? undefined : 0,
            }}
          >
            {contribPct > 15 && (
              <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>
                {contribPct.toFixed(0)}%
              </span>
            )}
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(interestPct, 0)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            style={{
              background: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: interestPct > 10 ? undefined : 0,
            }}
          >
            {interestPct > 15 && (
              <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>
                {interestPct.toFixed(0)}%
              </span>
            )}
          </motion.div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: '#3B82F6' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Contributions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: '#10B981' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Interest</span>
          </div>
        </div>
      </div>
    </div>
  );
}
