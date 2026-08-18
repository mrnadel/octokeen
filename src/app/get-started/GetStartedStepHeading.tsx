'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Mascot } from '@/components/ui/Mascot';
import type { MascotPose } from '@/components/ui/Mascot';

const BLOCK_ENTER = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } } as const;
const MASCOT_ENTER = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 260, damping: 18, delay: 0.05 },
} as const;
const BLOCK_DELAY = { delay: 0.1 } as const;

export interface GetStartedStepHeadingProps {
  pose: MascotPose;
  mascotSize: number;
  title: ReactNode;
  subtitle: string;
  /** Tighter type scale used by the signup step. */
  compact?: boolean;
}

/** Glowing mascot plus title and subtitle at the top of a get-started step. */
export function GetStartedStepHeading({ pose, mascotSize, title, subtitle, compact }: GetStartedStepHeadingProps) {
  const titleClass = compact
    ? 'text-2xl font-black text-surface-900 dark:text-white mb-1'
    : 'text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-1.5';
  const subtitleClass = compact
    ? 'text-surface-500 dark:text-surface-400 text-sm font-semibold'
    : 'text-surface-500 dark:text-surface-400 text-sm sm:text-base font-semibold';

  return (
    <motion.div className="text-center mb-6" {...BLOCK_ENTER} transition={BLOCK_DELAY}>
      <motion.div className="flex justify-center mb-3" {...MASCOT_ENTER}>
        <div className="relative">
          <div className="absolute inset-0 scale-150 rounded-full bg-primary-400/10 dark:bg-primary-500/10 blur-2xl" />
          <Mascot pose={pose} size={mascotSize} />
        </div>
      </motion.div>
      <h2 className={titleClass}>{title}</h2>
      <p className={subtitleClass}>{subtitle}</p>
    </motion.div>
  );
}
