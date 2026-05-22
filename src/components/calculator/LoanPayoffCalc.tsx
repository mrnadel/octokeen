'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { fmt, fmtInt } from './calculatorHelpers';
import { CalcInput } from './CalcInput';
import { ResultRow } from './ResultRow';

export function LoanPayoffCalc() {
  const [balance, setBalance] = useState(25000);
  const [rate, setRate] = useState(6.5);
  const [payment, setPayment] = useState(500);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) {
      const months = balance > 0 && payment > 0 ? Math.ceil(balance / payment) : 0;
      return {
        months,
        totalInterest: 0,
        totalCost: balance,
        extra50: { months: payment + 50 > 0 ? Math.ceil(balance / (payment + 50)) : 0, savings: 0 },
        extra100: { months: payment + 100 > 0 ? Math.ceil(balance / (payment + 100)) : 0, savings: 0 },
      };
    }

    // Minimum payment to cover interest
    const minPayment = balance * monthlyRate;
    if (payment <= minPayment) {
      return { months: Infinity, totalInterest: Infinity, totalCost: Infinity, extra50: null, extra100: null };
    }

    const calcPayoff = (bal: number, pmt: number): { months: number; totalInterest: number; totalCost: number } => {
      if (pmt <= bal * monthlyRate) return { months: Infinity, totalInterest: Infinity, totalCost: Infinity };
      const months = Math.ceil(
        -Math.log(1 - (bal * monthlyRate) / pmt) / Math.log(1 + monthlyRate)
      );
      const totalCost = pmt * months;
      const totalInterest = totalCost - bal;
      return { months, totalInterest, totalCost };
    };

    const base = calcPayoff(balance, payment);
    const with50 = calcPayoff(balance, payment + 50);
    const with100 = calcPayoff(balance, payment + 100);

    return {
      ...base,
      extra50: {
        months: with50.months,
        savings: base.totalInterest - with50.totalInterest,
      },
      extra100: {
        months: with100.months,
        savings: base.totalInterest - with100.totalInterest,
      },
    };
  }, [balance, rate, payment]);

  const isInfinite = result.months === Infinity;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <CalcInput label="Loan Balance" value={balance} onChange={setBalance} prefix="$" />
        <CalcInput label="Interest Rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
      </div>
      <CalcInput label="Monthly Payment" value={payment} onChange={setPayment} prefix="$" />

      {isInfinite ? (
        <div style={{
          background: '#FEF2F2',
          borderRadius: 12,
          padding: 16,
          border: '1.5px solid #FECACA',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#DC2626' }}>
            Payment too low to cover interest. Increase your monthly payment above {fmt(balance * (rate / 100 / 12))}.
          </div>
        </div>
      ) : (
        <>
          <motion.div
            key={`${balance}-${rate}-${payment}`}
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
              Payoff Time
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#059669', lineHeight: 1.2 }}>
              {fmtInt(result.months)} months
              <span style={{ fontSize: 15, fontWeight: 600, color: '#64748B', marginLeft: 8 }}>
                ({(result.months / 12).toFixed(1)} years)
              </span>
            </div>
          </motion.div>

          <div>
            <ResultRow label="Total Interest Paid" value={fmt(result.totalInterest)} color="#EF4444" />
            <ResultRow label="Total Cost" value={fmt(result.totalCost)} />
          </div>

          {/* Extra payment comparison */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748B', marginBottom: 8 }}>
              What if you pay extra?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {result.extra50 && (
                <div style={{
                  background: '#EFF6FF',
                  borderRadius: 10,
                  padding: 12,
                  border: '1px solid #BFDBFE',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#3B82F6', marginBottom: 2 }}>
                    +$50/month
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
                    {fmtInt(result.extra50.months)} months
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#10B981', marginTop: 2 }}>
                    Save {fmt(result.extra50.savings)}
                  </div>
                </div>
              )}
              {result.extra100 && (
                <div style={{
                  background: '#ECFDF5',
                  borderRadius: 10,
                  padding: 12,
                  border: '1px solid #A7F3D0',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 2 }}>
                    +$100/month
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
                    {fmtInt(result.extra100.months)} months
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#10B981', marginTop: 2 }}>
                    Save {fmt(result.extra100.savings)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
