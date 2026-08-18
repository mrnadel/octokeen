'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const CARD_BORDER = { border: '3px solid rgba(255,255,255,0.3)' } as const;
const HEADER_BG = { background: 'rgba(255,255,255,0.25)' } as const;
const SLIDE_SPRING = { type: 'spring', stiffness: 300, damping: 20 } as const;
const SLIDE_DISTANCE = 20;

export interface ResultStatCardProps {
  /** Uppercase strip across the top of the card. */
  header: string;
  children: ReactNode;
  /** Side the card slides in from. */
  from: 'left' | 'right';
  /** Entrance delay in seconds, staggered against the sibling card. */
  delay: number;
  ariaLabel?: string;
}

/** Bordered stat tile used on the lesson-result and placement-test result screens. */
export function ResultStatCard({ header, children, from, delay, ariaLabel }: ResultStatCardProps) {
  const offset = from === 'left' ? -SLIDE_DISTANCE : SLIDE_DISTANCE;

  return (
    <motion.div
      className="flex-1 rounded-2xl overflow-hidden"
      style={CARD_BORDER}
      aria-label={ariaLabel}
      initial={{ x: offset, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, ...SLIDE_SPRING }}
    >
      <div className="py-1.5 text-center" style={HEADER_BG}>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white">{header}</span>
      </div>
      {children}
    </motion.div>
  );
}
