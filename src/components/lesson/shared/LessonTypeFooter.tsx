'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLessonColors } from '@/lib/lessonColors';

const RISE_FROM = { y: 30, opacity: 0 } as const;
const RISE_TO = { y: 0, opacity: 1 } as const;
const RISE_SPRING = { type: 'spring', stiffness: 300, damping: 25 } as const;

export interface LessonTypeFooterProps {
  children: ReactNode;
  /** Spring slide-up entrance. Omit for a static footer. */
  animated?: boolean;
  /** Overrides the default card background (e.g. answer-feedback tint). */
  background?: string;
  /** Overrides the default 2px top border color. */
  borderColor?: string;
}

/**
 * Bottom action bar shared by the non-standard lesson type views
 * (speed-round, timeline, case-study).
 */
export function LessonTypeFooter({ children, animated, background, borderColor }: LessonTypeFooterProps) {
  const c = useLessonColors();
  const style: CSSProperties = {
    padding: '12px 20px',
    paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
    borderTop: `2px solid ${borderColor ?? c.border}`,
    background: background ?? c.cardBg,
  };

  if (!animated) return <div style={style}>{children}</div>;

  return (
    <motion.div initial={RISE_FROM} animate={RISE_TO} transition={RISE_SPRING} style={style}>
      {children}
    </motion.div>
  );
}
