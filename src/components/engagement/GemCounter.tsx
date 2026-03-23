'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGems } from '@/store/useEngagementStore';
import { shopItems } from '@/data/gem-shop';

const RECENT_TX_COUNT = 5;

export function GemCounter() {
  const gems = useGems();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const recentTx = gems.transactions.slice(-RECENT_TX_COUNT).reverse();

  // Cheapest item the user can afford
  const affordable = shopItems
    .filter((i) => i.cost <= gems.balance)
    .sort((a, b) => a.cost - b.cost);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-all active:scale-95"
        style={{
          background: open ? '#EDE9FE' : '#F3E8FF',
          border: `1.5px solid ${open ? '#8B5CF6' : 'transparent'}`,
          cursor: 'pointer',
          boxShadow: open ? '0 2px 8px rgba(139,92,246,0.15)' : 'none',
        }}
        aria-label={`${gems.balance} gems`}
        aria-expanded={open}
      >
        <span className="text-sm">💎</span>
        <motion.span
          key={gems.balance}
          className="text-sm font-extrabold"
          style={{ color: '#7C3AED' }}
          initial={{ scale: 1.3, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {gems.balance}
        </motion.span>
      </button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl border border-gray-200 overflow-hidden"
            style={{
              width: 'calc(100vw - 40px)',
              maxWidth: 320,
              boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header with balance */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Your Gems</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl">💎</span>
                    <motion.span
                      key={gems.balance}
                      className="text-2xl font-extrabold"
                      style={{ color: '#7C3AED' }}
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {gems.balance.toLocaleString()}
                    </motion.span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {gems.totalEarned.toLocaleString()} total earned
                  </p>
                </div>

                {/* Shop CTA */}
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
                    textDecoration: 'none',
                  }}
                >
                  🛍️ Gem Shop
                </Link>
              </div>
            </div>

            {/* Quick shop preview — show affordable items hint */}
            {affordable.length > 0 && (
              <div className="mx-4 mb-3 px-3 py-2 rounded-xl" style={{ background: '#F5F3FF' }}>
                <p className="text-[11px] font-semibold" style={{ color: '#7C3AED' }}>
                  You can afford {affordable.length} item{affordable.length !== 1 ? 's' : ''} in the shop!
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {affordable.slice(0, 5).map((item) => (
                    <span
                      key={item.id}
                      className="text-base"
                      title={`${item.name} — ${item.cost} 💎`}
                    >
                      {item.icon}
                    </span>
                  ))}
                  {affordable.length > 5 && (
                    <span className="text-[10px] font-bold text-violet-400 ml-0.5">
                      +{affordable.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Recent transactions */}
            {recentTx.length > 0 && (
              <div className="border-t border-gray-100">
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Recent</p>
                </div>
                <div className="px-3 pb-3 space-y-0.5">
                  {recentTx.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg"
                        style={{ background: isPositive ? '#FAFFF5' : '#FFF5F5' }}
                      >
                        <span className="text-[12px] text-gray-600 font-medium capitalize truncate" style={{ maxWidth: 180 }}>
                          {formatSource(tx.source)}
                        </span>
                        <span
                          className="text-[12px] font-bold shrink-0 ml-2"
                          style={{ color: isPositive ? '#16A34A' : '#DC2626' }}
                        >
                          {isPositive ? '+' : ''}{tx.amount} 💎
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {recentTx.length === 0 && (
              <div className="border-t border-gray-100 px-4 py-5 text-center">
                <p className="text-sm text-gray-400">
                  Complete quests and lessons to earn gems!
                </p>
              </div>
            )}

            {/* Footer link */}
            <div className="border-t border-gray-100 px-4 py-2.5">
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="block text-center text-[12px] font-bold transition-colors hover:underline"
                style={{ color: '#7C3AED', textDecoration: 'none' }}
              >
                Browse all items →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatSource(source: string): string {
  return source
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\bxp\b/gi, 'XP')
    .replace(/\bdaily\b/gi, 'Daily')
    .replace(/\bweekly\b/gi, 'Weekly')
    .replace(/\bquest\b/gi, 'Quest')
    .replace(/\blesson\b/gi, 'Lesson')
    .replace(/\bchest\b/gi, 'Chest')
    .replace(/\bpurchase\b/gi, 'Purchase');
}
