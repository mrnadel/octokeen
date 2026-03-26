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

/** SVG icon per lesson type — Duolingo-inspired flat bold style */
function LessonTypeIcon({ type, color, size = 20 }: { type: LessonType; color: string; size?: number }) {
  switch (type) {
    case 'conversation':
      // Chat bubbles
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="14" height="11" rx="3" fill={color} />
          <path d="M6 14v3l3-3H6Z" fill={color} />
          <rect x="10" y="9" width="12" height="9" rx="3" fill={color} opacity="0.5" />
          <path d="M18 18v2.5l2.5-2.5H18Z" fill={color} opacity="0.5" />
          <rect x="5" y="7" width="6" height="1.5" rx="0.75" fill="#FFF" />
          <rect x="5" y="10" width="4" height="1.5" rx="0.75" fill="#FFF" opacity="0.7" />
        </svg>
      );
    case 'speed-round':
      // Lightning bolt / stopwatch
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="13" r="9" fill={color} opacity="0.2" />
          <circle cx="12" cy="13" r="7" fill={color} opacity="0.4" />
          <path d="M13.5 4L8 14h4.5l-1 7L18 11h-4.5l1-7Z" fill={color} />
          <path d="M13.5 4L8 14h4.5l-1 7L18 11h-4.5l1-7Z" fill="#FFF" opacity="0.3" />
        </svg>
      );
    case 'timeline':
      // Branching path / story book
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
      // Document with magnifying glass
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="2" width="13" height="18" rx="2.5" fill={color} opacity="0.2" />
          <rect x="3" y="2" width="13" height="18" rx="2.5" stroke={color} strokeWidth="2" />
          <rect x="6" y="6" width="7" height="1.5" rx="0.75" fill={color} />
          <rect x="6" y="9" width="5" height="1.5" rx="0.75" fill={color} opacity="0.5" />
          <rect x="6" y="12" width="4" height="1.5" rx="0.75" fill={color} opacity="0.5" />
          <circle cx="17.5" cy="16.5" r="3.5" fill={color} />
          <circle cx="17.5" cy="16.5" r="2" fill="#FFF" opacity="0.4" />
          <path d="M20 19.5L22 21.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function CompletionBadge({ stars, color, darkColor, isGolden }: { stars: number; color: string; darkColor: string; isGolden?: boolean }) {
  const starColor = isGolden ? '#FFFFFF' : color;
  const starEmptyColor = isGolden ? 'rgba(255,255,255,0.35)' : '#E0E0E0';
  const bgColor = isGolden ? '#CC9400' : `${color}18`;
  const borderColor = isGolden ? 'transparent' : `${color}25`;

  return (
    <div
      className="flex items-center"
      style={{
        gap: 3,
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 10,
        padding: '5px 10px',
      }}
    >
      {[1, 2, 3].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
            fill={i <= stars ? starColor : starEmptyColor}
            strokeLinejoin="round"
          />
        </svg>
      ))}
      {isGolden && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 1 }}>
          <path d="M5 16h14l-2-8-3.5 4L12 6l-1.5 6L7 8l-2 8z" fill="#FFE082" />
          <path d="M5 16h14v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z" fill="#FFE082" />
        </svg>
      )}
    </div>
  );
}

export const LessonNode = memo(function LessonNode({
  lesson,
  state,
  stars,
  golden,
  index,
  onClick,
  theme,
}: LessonRowProps) {
  return (
    <motion.button
      className={`w-full flex items-center text-left ${state === 'completed' && golden ? 'golden-node' : ''}`}
      style={{
        padding: '12px 14px',
        background:
          state === 'locked' ? 'transparent'
          : (state === 'completed' && golden) ? undefined  /* handled by .golden-node */
          : 'rgba(255,255,255,0.85)',
        borderRadius: 16,
        gap: 12,
        opacity: state === 'locked' ? 0.7 : 1,
        cursor: state === 'locked' ? 'default' : 'pointer',
        boxShadow:
          state === 'locked'
            ? 'none'
            : (state === 'completed' && golden) ? undefined /* handled by .golden-node */
            : `0 3px 0 ${theme.dark}22, 0 1px 3px rgba(0,0,0,0.06)`,
        border:
          state === 'locked'
            ? 'none'
            : (state === 'completed' && golden) ? undefined /* handled by .golden-node */
            : '1.5px solid rgba(255,255,255,0.9)',
        position: 'relative',
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={onClick}
      whileHover={state !== 'locked' ? { scale: 1.015, ...((state === 'completed' && golden) ? {} : { backgroundColor: 'rgba(255,255,255,0.95)' }) } : undefined}
      whileTap={state !== 'locked' ? { scale: 0.97, y: 2, boxShadow: (state === 'completed' && golden) ? '0 1px 0 #996E00' : `0 1px 0 ${theme.dark}22, 0 0px 2px rgba(0,0,0,0.04)` } : undefined}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: state === 'locked' ? 0.7 : 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, scale: { duration: 0.1 }, y: { duration: 0.1 }, boxShadow: { duration: 0.1 } }}
      aria-label={
        state === 'completed'
          ? `Replay: ${lesson.title}`
          : state === 'current'
            ? `Start: ${lesson.title}`
            : `Locked: ${lesson.title}`
      }
    >
      {/* Icon */}
      <div
        className={`flex items-center justify-center flex-shrink-0 ${state === 'completed' && golden ? 'golden-icon-box' : ''}`}
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background:
            state === 'locked' ? '#F0F0F0'
            : (state === 'completed' && golden) ? undefined /* handled by .golden-icon-box */
            : `${theme.color}20`,
          fontSize: 16,
        }}
      >
        {state === 'completed' && golden ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 16h14l-2-8-3.5 4L12 6l-1.5 6L7 8l-2 8z" fill={GOLD} />
            <path d="M5 16h14v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z" fill={GOLD} />
            <circle cx="7.5" cy="16" r="1.2" fill="#FFF8E1" />
            <circle cx="12" cy="16" r="1.2" fill="#FFF8E1" />
            <circle cx="16.5" cy="16" r="1.2" fill="#FFF8E1" />
          </svg>
        ) : state === 'completed' ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 10.5L8.5 14L15 6"
              stroke={theme.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : lesson.type && lesson.type !== 'standard' ? (
          <div style={{ opacity: state === 'locked' ? 0.5 : 1 }}>
            <LessonTypeIcon type={lesson.type} color={state === 'locked' ? '#AFAFAF' : theme.color} />
          </div>
        ) : (
          <span style={{ opacity: state === 'locked' ? 0.5 : 1 }}>{lesson.icon}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 700,
            color: state === 'locked' ? '#AFAFAF' : '#3C3C3C',
            lineHeight: 1.2,
          }}
        >
          {lesson.title}
        </div>
      </div>

      {/* Badge */}
      <div className="flex-shrink-0">
        {state === 'completed' && stars !== undefined && stars > 0 ? (
          <CompletionBadge stars={stars} color={golden ? GOLD : theme.color} darkColor={golden ? GOLD_DARK : theme.dark} isGolden={golden} />
        ) : state === 'current' ? (
          <div
            className="go-btn-pulse"
            style={
              {
                background: theme.color,
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 800,
                padding: '8px 20px',
                borderRadius: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                boxShadow: `0 4px 0 ${theme.dark}`,
                '--go-shadow-color': theme.dark,
                '--go-glow-color': `${theme.color}25`,
              } as React.CSSProperties
            }
          >
            Go
          </div>
        ) : null}
      </div>
    </motion.button>
  );
});

export { LessonNode as LessonRow };
