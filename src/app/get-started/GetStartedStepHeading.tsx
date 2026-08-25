'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Mascot } from '@/components/ui/Mascot';
import type { MascotPose } from '@/components/ui/Mascot';

/*
 * The mascot in this heading is the LCP element of /get-started, so neither it
 * nor its wrapper may enter from `opacity: 0` or a sub-1 `scale`: framer-motion
 * serialises `initial` into the SSR HTML, so the image either stayed invisible
 * or painted quarter-size until hydration, which pinned LCP to hydration of the
 * whole bundle (6.2 s -> 3.1 s once it paints at FCP). A translate is safe --
 * it blocks neither the paint nor the element's painted size.
 * See docs/seo/performance.md section 2.
 */
const BLOCK_ENTER = { initial: { y: 10 }, animate: { y: 0 } } as const;
const MASCOT_ENTER = {
  initial: { y: -10 },
  animate: { y: 0 },
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
          <Mascot pose={pose} size={mascotSize} priority />
        </div>
      </motion.div>
      <h2 className={titleClass}>{title}</h2>
      <p className={subtitleClass}>{subtitle}</p>
    </motion.div>
  );
}
