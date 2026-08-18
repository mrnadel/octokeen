'use client';

import type { ReactNode } from 'react';
import LessonProgressBar from './LessonProgressBar';
import { GoldenBadge } from './GoldenBadge';
import { HeartDisplay } from '@/components/ui/HeartDisplay';
import { useLessonColors } from '@/lib/lessonColors';
import { GOLD } from '@/components/course/constants';

const CLOSE_BUTTON_SIZE = 44;

export interface LessonTopBarProps {
  onExit: () => void;
  exitLabel: string;
  isGolden: boolean;
  answeredCount: number;
  totalQuestions: number;
  unitColor: string;
  /** Pulses the progress bar while the learner is on an easy streak. */
  progressGlowing: boolean;
  milestoneGlow: boolean;
  showHearts: boolean;
  isDoubleXp: boolean;
  /** Development-only navigation controls rendered between progress and hearts. */
  debugControls?: ReactNode;
}

/** Sticky lesson header: close button, golden badge, progress bar, hearts and 2x indicator. */
export function LessonTopBar({
  onExit,
  exitLabel,
  isGolden,
  answeredCount,
  totalQuestions,
  unitColor,
  progressGlowing,
  milestoneGlow,
  showHearts,
  isDoubleXp,
  debugControls,
}: LessonTopBarProps) {
  const c = useLessonColors();

  return (
    <div
      className="flex items-center flex-shrink-0 z-20"
      style={{
        padding: '10px 16px',
        gap: 12,
        borderBottom: `2px solid ${c.headerBorder}`,
        background: c.cardBg,
        position: 'relative',
        zIndex: 20,
      }}
    >
      <button
        onClick={onExit}
        className="flex-shrink-0 flex items-center justify-center transition-transform active:scale-90"
        style={{
          width: CLOSE_BUTTON_SIZE,
          height: CLOSE_BUTTON_SIZE,
          borderRadius: 12,
          background: c.closeBtnBg,
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label={exitLabel}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke={c.closeBtnStroke} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {isGolden && <GoldenBadge />}

      <LessonProgressBar
        current={answeredCount}
        total={totalQuestions}
        color={isGolden ? GOLD : unitColor}
        glowing={progressGlowing}
        milestoneGlow={milestoneGlow}
      />

      {debugControls}

      <div className="flex-shrink-0 flex items-center gap-2">
        {showHearts && <HeartDisplay />}
        {isDoubleXp && (
          <div
            className="flex items-center"
            style={{
              padding: '3px 7px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: 0.3,
              lineHeight: 1,
              boxShadow: '0 1px 4px rgba(245,158,11,0.4)',
            }}
          >
            2X
          </div>
        )}
      </div>
    </div>
  );
}
