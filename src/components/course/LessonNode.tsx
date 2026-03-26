'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Lesson, LessonType } from '@/data/course/types';
import type { UnitTheme } from '@/lib/unitThemes';

interface LessonRowProps {
  lesson: Lesson;
  unitColor: string;
  state: 'completed' | 'current' | 'locked';
  stars?: number;
  golden?: boolean;
  index: number;
  onClick: () => void;
  theme: UnitTheme;
}

const GOLD = '#FFB800';
const GOLD_DARK = '#C8960B';

/** Bold SVG icon per lesson type — designed for large display on light backgrounds */
function LessonTypeIcon({ type, color, size = 64 }: { type: LessonType; color: string; size?: number }) {
  switch (type) {
    case 'conversation':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="14" height="11" rx="3" fill={color} />
          <path d="M6 14v3l3-3H6Z" fill={color} />
          <rect x="10" y="9" width="12" height="9" rx="3" fill={color} opacity="0.45" />
          <path d="M18 18v2.5l2.5-2.5H18Z" fill={color} opacity="0.45" />
          <rect x="5" y="7" width="6" height="1.5" rx="0.75" fill="#FFF" />
          <rect x="5" y="10" width="4" height="1.5" rx="0.75" fill="#FFF" opacity="0.7" />
        </svg>
      );
    case 'speed-round':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="13" r="9" fill={color} opacity="0.15" />
          <circle cx="12" cy="13" r="7" fill={color} opacity="0.3" />
          <path d="M13.5 4L8 14h4.5l-1 7L18 11h-4.5l1-7Z" fill={color} />
        </svg>
      );
    case 'timeline':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M7 4v16" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <circle cx="7" cy="6" r="2.5" fill={color} />
          <circle cx="7" cy="12" r="2.5" fill={color} />
          <circle cx="7" cy="18" r="2.5" fill={color} />
          <rect x="12" y="4" width="8" height="4" rx="2" fill={color} opacity="0.6" />
          <rect x="12" y="10" width="10" height="4" rx="2" fill={color} />
          <rect x="12" y="16" width="6" height="4" rx="2" fill={color} opacity="0.6" />
        </svg>
      );
    case 'case-study':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="2" width="13" height="18" rx="2.5" fill={color} opacity="0.15" />
          <rect x="3" y="2" width="13" height="18" rx="2.5" stroke={color} strokeWidth="2" />
          <rect x="6" y="6" width="7" height="1.5" rx="0.75" fill={color} />
          <rect x="6" y="9" width="5" height="1.5" rx="0.75" fill={color} opacity="0.5" />
          <rect x="6" y="12" width="4" height="1.5" rx="0.75" fill={color} opacity="0.5" />
          <circle cx="17.5" cy="16.5" r="3.5" fill={color} />
          <circle cx="17.5" cy="16.5" r="2" fill="#FFF" opacity="0.4" />
          <path d="M20 19.5L22 21.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'standard':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 6C10.5 4.5 7 3.5 4 4v14c3 0 6.5 1 8 2.5C13.5 19 17 18 20 18V4c-3-.5-6.5.5-8 2Z" fill={color} opacity="0.18" />
          <path d="M12 6C10.5 4.5 7 3.5 4 4v14c3 0 6.5 1 8 2.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 6c1.5-1.5 5-2.5 8-2v14c-3 0-6.5 1-8 2.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 6v14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      );
  }
}

function GoldenCrown({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 16h14l-2-8-3.5 4L12 6l-1.5 6L7 8l-2 8z" fill={color} />
      <path d="M5 16h14v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z" fill={color} />
      <circle cx="7.5" cy="16" r="1.2" fill="#FFF8E1" />
      <circle cx="12" cy="16" r="1.2" fill="#FFF8E1" />
      <circle cx="16.5" cy="16" r="1.2" fill="#FFF8E1" />
    </svg>
  );
}

const ICON_SIZE = 64;

export const LessonNode = memo(function LessonNode({
  lesson,
  state,
  stars,
  golden,
  index,
  onClick,
  theme,
}: LessonRowProps) {
  const isGold = state === 'completed' && golden;

  const iconColor = state === 'locked'
    ? '#D0D0D0'
    : isGold ? GOLD : theme.color;
  const shadowColor = state === 'locked'
    ? '#AAAAAA'
    : isGold ? GOLD_DARK : theme.dark;

  return (
    <div className="flex flex-col items-center" style={{ gap: 6 }}>
      <motion.button
        className={state === 'current' ? 'lesson-icon-pulse' : ''}
        style={{
          background: 'none',
          border: 'none',
          padding: 4,
          cursor: state === 'locked' ? 'default' : 'pointer',
          opacity: state === 'locked' ? 0.45 : 1,
          filter: `drop-shadow(0 4px 0 ${shadowColor})`,
          WebkitTapHighlightColor: 'transparent',
          '--icon-shadow': shadowColor,
          '--icon-glow': `${theme.color}40`,
        } as React.CSSProperties}
        onClick={onClick}
        whileHover={state !== 'locked' ? { scale: 1.12, y: -3 } : undefined}
        whileTap={state !== 'locked' ? {
          scale: 0.95,
          y: 3,
          filter: `drop-shadow(0 1px 0 ${shadowColor})`,
        } : undefined}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: state === 'locked' ? 0.45 : 1, scale: 1 }}
        transition={{
          delay: index * 0.06,
          duration: 0.35,
          type: 'spring',
          stiffness: 300,
          damping: 20,
          scale: { duration: 0.1 },
          y: { duration: 0.1 },
          filter: { duration: 0.1 },
        }}
        aria-label={
          state === 'completed'
            ? `Replay: ${lesson.title}`
            : state === 'current'
              ? `Start: ${lesson.title}`
              : `Locked: ${lesson.title}`
        }
      >
        {isGold ? (
          <GoldenCrown size={ICON_SIZE} color={GOLD} />
        ) : (
          <LessonTypeIcon
            type={lesson.type ?? 'standard'}
            color={iconColor}
            size={ICON_SIZE}
          />
        )}
      </motion.button>

      {/* Mini stars for completed lessons */}
      {state === 'completed' && stars !== undefined && stars > 0 && (
        <div className="flex items-center" style={{ gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
                fill={i <= stars ? (isGold ? GOLD : theme.color) : '#E0E0E0'}
              />
            </svg>
          ))}
        </div>
      )}
    </div>
  );
});

export { LessonNode as LessonRow };
