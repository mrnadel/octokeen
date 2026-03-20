'use client';

import { motion } from 'framer-motion';

interface LessonProgressBarProps {
  current: number;
  total: number;
  color: string;
}

export default function LessonProgressBar({ current, total, color }: LessonProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
