'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useIsDark } from '@/store/useThemeStore';
import { useGems, useEngagementStore } from '@/store/useEngagementStore';
import { useHeartsStore } from '@/store/useHeartsStore';
import { CURRENCY } from '@/data/currency';
import { CurrencyIcon } from '@/components/ui/CurrencyIcon';

const HEART_COST = 100; // gems per single heart — balanced: ~2 lessons worth of gem earnings

export function HeartsPopoverContent({ onClose }: { onClose: () => void }) {
  const isDark = useIsDark();
  const current = useHeartsStore((s) => s.current);
  const max = useHeartsStore((s) => s.max);
  const isUnlimited = useHeartsStore((s) => s.isUnlimited);
  const getTimeUntilNextHeart = useHeartsStore((s) => s.getTimeUntilNextHeart);
  const rechargeHearts = useHeartsStore((s) => s.rechargeHearts);
  const gems = useGems();
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const tick = () => {
      rechargeHearts();
      const ms = getTimeUntilNextHeart();
      if (ms <= 0) { setCountdown(''); return; }
      const totalSeconds = Math.ceil(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      if (hours > 0) setCountdown(`${hours}h ${minutes}m`);
      else setCountdown(`${minutes}m`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [getTimeUntilNextHeart, rechargeHearts]);

  const unlimited = isUnlimited();
  const missingHearts = max - current;
  const canBuyOne = !unlimited && current < max && gems.balance >= HEART_COST;
  const refillCost = missingHearts * HEART_COST;
  const canRefillAll = !unlimited && missingHearts > 1 && gems.balance >= refillCost;

  const buyOneHeart = () => {
    if (!canBuyOne) return;
    useHeartsStore.setState((s) => ({
      current: s.current + 1,
      lastRechargeAt: s.current + 1 >= s.max ? Date.now() : s.lastRechargeAt,
    }));
    useEngagementStore.getState().addGems(-HEART_COST, 'heart_purchase');
  };

  const refillAll = () => {
    if (!canRefillAll) return;
    useHeartsStore.setState({ current: max, lastRechargeAt: Date.now() });
    useEngagementStore.getState().addGems(-refillCost, 'heart_refill');
  };

  const heartPath = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Title */}
      <h3 style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#E2E8F0' : '#3C3C3C', marginBottom: 16 }}>
        Hearts
      </h3>

      {/* Heart icons row */}
      <div className="flex items-center justify-center" style={{ gap: 6, marginBottom: 16 }}>
        {unlimited ? (
          <>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#EF4444"><path d={heartPath}/></svg>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#EF4444', lineHeight: 1 }}>&infin;</span>
          </>
        ) : (
          Array.from({ length: max }, (_, i) => {
            const isFull = i < current;
            const isBreaking = i === current;
            return (
              <motion.svg
                key={i}
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill={isFull ? '#EF4444' : isBreaking ? (isDark ? '#7F1D1D' : '#FECDD3') : (isDark ? '#475569' : '#D4D4D8')}
                initial={false}
                animate={isBreaking ? { scale: [1, 1.12, 1] } : {}}
                transition={{ duration: 0.5 }}
                style={{ filter: isFull ? 'drop-shadow(0 1px 2px rgba(239,68,68,0.3))' : 'none' }}
              >
                <path d={heartPath}/>
              </motion.svg>
            );
          })
        )}
      </div>

      {/* Status text */}
      {unlimited ? (
        <p style={{ fontSize: 13, fontWeight: 700, color: '#16A34A', marginBottom: 4 }}>
          You have unlimited hearts!
        </p>
      ) : current < max && countdown ? (
        <p style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#E2E8F0' : '#3C3C3C', marginBottom: 4 }}>
          Next heart in <span style={{ color: '#E11D48' }}>{countdown}</span>
        </p>
      ) : null}

      <p style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#64748B' : '#AFAFAF', marginBottom: 18 }}>
        {unlimited
          ? 'Pro members never run out.'
          : current === max
            ? 'Full hearts! Keep on learning.'
            : current > 0
              ? 'You have hearts left! Keep on learning.'
              : `Wait for recharge, or spend ${CURRENCY.plural} below.`}
      </p>

      {/* Action cards */}
      {!unlimited && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Get Pro — unlimited hearts */}
          <Link
            href="/pricing"
            onClick={onClose}
            className="flex items-center transition-all hover:brightness-105 active:scale-[0.98]"
            style={{
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              background: isDark ? '#0F172A' : '#F9FAFB',
              border: isDark ? '1.5px solid #334155' : '1.5px solid #E5E7EB',
              textDecoration: 'none',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 16, color: 'white', fontWeight: 900, lineHeight: 1 }}>&infin;</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#E2E8F0' : '#3C3C3C', whiteSpace: 'nowrap' }}>
              UNLIMITED HEARTS
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#E11D48', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              GET PRO
            </span>
          </Link>

          {/* Buy one heart */}
          {current < max && (
            <button
              className="flex items-center transition-all hover:brightness-105 active:scale-[0.98]"
              style={{
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                background: isDark ? '#0F172A' : '#F9FAFB',
                border: isDark ? '1.5px solid #334155' : '1.5px solid #E5E7EB',
                cursor: canBuyOne ? 'pointer' : 'not-allowed',
                opacity: canBuyOne ? 1 : 0.45,
                width: '100%',
              }}
              disabled={!canBuyOne}
              onClick={buyOneHeart}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#EF4444"><path d={heartPath}/></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#E2E8F0' : '#3C3C3C', whiteSpace: 'nowrap' }}>
                BUY ONE HEART
              </span>
              <div className="flex items-center" style={{ gap: 3, marginLeft: 'auto' }}>
                <CurrencyIcon size={16} />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#7C3AED' }}>{HEART_COST}</span>
              </div>
            </button>
          )}

          {/* Refill all hearts */}
          {missingHearts > 1 && (
            <button
              className="flex items-center transition-all hover:brightness-105 active:scale-[0.98]"
              style={{
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                background: isDark ? '#0F172A' : '#F9FAFB',
                border: isDark ? '1.5px solid #334155' : '1.5px solid #E5E7EB',
                cursor: canRefillAll ? 'pointer' : 'not-allowed',
                opacity: canRefillAll ? 1 : 0.45,
                width: '100%',
              }}
              disabled={!canRefillAll}
              onClick={refillAll}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#E2E8F0' : '#3C3C3C', whiteSpace: 'nowrap' }}>
                REFILL ALL ({missingHearts})
              </span>
              <div className="flex items-center" style={{ gap: 3, marginLeft: 'auto' }}>
                <CurrencyIcon size={16} />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#7C3AED' }}>{refillCost}</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
