'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Lesson } from '@/data/course/types';
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

function LevelDots({ current, max, color, isGolden }: { current: number; max: number; color: string; isGolden?: boolean }) {
  if (max <= 1) return null;
  return (
    <div className="flex items-center" style={{ gap: 3, marginTop: 4 }}>
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i < current
              ? (isGolden ? GOLD : color)
              : 'rgba(0,0,0,0.08)',
            transition: 'background 0.2s',
          }}
        />
      ))}
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
  const maxLevels = lesson.levels ?? 1;
  const questionCount = lesson.questions?.length || 0;
  const isGolden = state === 'completed' && golden;

  return (
    <motion.button
      className={`w-full flex items-center text-left ${isGolden ? 'golden-node' : ''}`}
      style={{
        padding: '12px 14px',
        background:
          state === 'locked' ? 'transparent'
          : isGolden ? undefined  /* handled by .golden-node */
          : 'rgba(255,255,255,0.85)',
        borderRadius: 16,
        gap: 12,
        opacity: state === 'locked' ? 0.55 : 1,
        cursor: state === 'locked' ? 'default' : 'pointer',
        boxShadow:
          state === 'locked'
            ? 'none'
            : isGolden ? undefined /* handled by .golden-node */
            : `0 3px 0 ${theme.dark}22, 0 1px 3px rgba(0,0,0,0.06)`,
        border:
          state === 'locked'
            ? 'none'
            : isGolden ? undefined /* handled by .golden-node */
            : '1.5px solid rgba(255,255,255,0.9)',
        position: 'relative',
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={onClick}
      whileHover={state !== 'locked' ? { scale: 1.015, ...((isGolden) ? {} : { backgroundColor: 'rgba(255,255,255,0.95)' }) } : undefined}
      whileTap={state !== 'locked' ? { scale: 0.97, y: 2, boxShadow: isGolden ? '0 1px 0 #996E00' : `0 1px 0 ${theme.dark}22, 0 0px 2px rgba(0,0,0,0.04)` } : undefined}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: state === 'locked' ? 0.55 : 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, scale: { duration: 0.1 }, y: { duration: 0.1 }, boxShadow: { duration: 0.1 } }}
      aria-label={
        state === 'completed'
          ? `Replay: ${lesson.title}`
          : state === 'current'
            ? `Start: ${lesson.title}`
            : `Upcoming: ${lesson.title}`
      }
    >
      {/* Icon with completion ring */}
      <div
        className={`flex items-center justify-center flex-shrink-0 ${isGolden ? 'golden-icon-box' : ''}`}
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          background:
            state === 'locked' ? 'rgba(0,0,0,0.04)'
            : isGolden ? undefined /* handled by .golden-icon-box */
            : state === 'completed' ? `${theme.color}15` : `${theme.color}20`,
          fontSize: 18,
          position: 'relative',
          border: state === 'completed' && !isGolden
            ? `2px solid ${theme.color}40`
            : state === 'current'
              ? `2px solid ${theme.color}30`
              : 'none',
        }}
      >
        {isGolden ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 16h14l-2-8-3.5 4L12 6l-1.5 6L7 8l-2 8z" fill={GOLD} />
            <path d="M5 16h14v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z" fill={GOLD} />
            <circle cx="7.5" cy="16" r="1.2" fill="#FFF8E1" />
            <circle cx="12" cy="16" r="1.2" fill="#FFF8E1" />
            <circle cx="16.5" cy="16" r="1.2" fill="#FFF8E1" />
          </svg>
        ) : (
          <span style={{ opacity: state === 'locked' ? 0.35 : 1 }}>{lesson.icon}</span>
        )}

        {/* Tiny checkmark overlay for completed (non-golden) */}
        {state === 'completed' && !isGolden && (
          <div
            style={{
              position: 'absolute',
              bottom: -3,
              right: -3,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: theme.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.5L5 9L9.5 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 700,
            color: state === 'locked' ? '#B0B0B0' : isGolden ? '#7A6200' : '#3C3C3C',
            lineHeight: 1.2,
          }}
        >
          {lesson.title}
        </div>
        {/* Subtitle: XP + question count */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: state === 'locked' ? '#C8C8C8'
              : isGolden ? '#A08520'
              : state === 'completed' ? '#999'
              : theme.color,
            marginTop: 3,
            lineHeight: 1,
          }}
        >
          {state === 'completed'
            ? `+${lesson.xpReward} XP earned`
            : `+${lesson.xpReward} XP · ${questionCount > 0 ? `${questionCount} Q` : 'Quick lesson'}`
          }
        </div>

        {/* Level progress dots for completed lessons */}
        {state === 'completed' && (
          <LevelDots current={stars ?? 0} max={Math.min(maxLevels, 4)} color={theme.color} isGolden={isGolden} />
        )}
      </div>

      {/* Right side: badge or GO button */}
      <div className="flex-shrink-0">
        {state === 'current' ? (
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
        ) : state === 'completed' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}>
            <path d="M9 6l6 6-6 6" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </div>
    </motion.button>
  );
});

export { LessonNode as LessonRow };
