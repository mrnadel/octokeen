'use client';

import { motion } from 'framer-motion';

interface LessonProgressBarProps {
  current: number;
  total: number;
  color: string;
}

export default function LessonProgressBar({ current, total, color }: LessonProgressBarProps) {
  return (
    <div className="flex items-center gap-1.5 flex-1">
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < current;
        const isCurrent = i === current;

        return (
          <div
            key={i}
            className="flex-1 h-3 rounded-full overflow-hidden"
            style={{ backgroundColor: '#E2E8F0' }}
          >
            {isCompleted && (
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
              />
            )}
            {isCurrent && (
              <motion.div
                className="h-full rounded-full opacity-30"
                style={{ backgroundColor: color }}
                animate={{ width: ['30%', '60%', '30%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
