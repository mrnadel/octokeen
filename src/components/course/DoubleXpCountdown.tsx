'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEngagementStore, useDoubleXpActive } from '@/store/useEngagementStore';

export function DoubleXpCountdown() {
  const doubleXpExpiry = useEngagementStore((s) => s.doubleXpExpiry);
  const isActive = useDoubleXpActive();
  const [remaining, setRemaining] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!isActive || !doubleXpExpiry) return;

    const tick = () => {
      const diff = new Date(doubleXpExpiry).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('');
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(`${mins}:${secs.toString().padStart(2, '0')}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isActive, doubleXpExpiry]);

  if (!isActive || !remaining) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      style={{ position: 'absolute', right: 12, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip((v) => !v)}
    >
      {/* Fire icon with x2 overlay */}
      <motion.div
        style={{
          position: 'relative',
          width: 36,
          height: 36,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span style={{ fontSize: 34, lineHeight: 1 }}>🔥</span>
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 11,
            fontWeight: 900,
            color: 'white',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          x2
        </span>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 6,
              background: 'white',
              color: '#92400E',
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            2× XP — {remaining} left
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
