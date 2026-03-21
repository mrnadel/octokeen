'use client';

import { motion } from 'framer-motion';
import { useGems } from '@/store/useEngagementStore';

export function GemCounter() {
  const gems = useGems();

  return (
    <div
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
      style={{ background: '#F3E8FF' }}
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
    </div>
  );
}
