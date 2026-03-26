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

/** Fully-opaque multi-color SVG icons — Duolingo-inspired bold style */
function LessonTypeIcon({ type, color, dark, size = 64 }: {
  type: LessonType;
  color: string;
  dark: string;
  size?: number;
}) {
  switch (type) {
    case 'conversation':
      // Two solid overlapping speech bubbles
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Back bubble */}
          <rect x="8" y="8" width="14" height="10" rx="3" fill={dark} />
          <path d="M18 18v3l3-3h-3Z" fill={dark} />
          {/* Front bubble */}
          <rect x="2" y="2" width="15" height="11" rx="3" fill={color} />
          <path d="M6 13v3.5l-3.5-3.5H6Z" fill={color} />
          {/* Text lines inside front bubble */}
          <rect x="5" y="5.5" width="8" height="1.8" rx="0.9" fill="#FFF" />
          <rect x="5" y="9" width="5" height="1.8" rx="0.9" fill="#FFF" />
        </svg>
      );

    case 'speed-round':
      // Bold lightning bolt on energetic circle
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Outer circle */}
          <circle cx="12" cy="12" r="11" fill={color} />
          {/* Inner circle */}
          <circle cx="12" cy="12" r="8" fill={dark} />
          {/* Lightning bolt — bright yellow */}
          <path d="M13.5 3L7.5 13h5l-1.5 8L17.5 10h-5L14 3Z" fill="#FFD43B" />
          {/* Bolt highlight */}
          <path d="M13 5.5L9 12.5h3.5" stroke="#FFF" strokeWidth="1" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'timeline':
      // Story scroll with milestone markers
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Vertical path */}
          <rect x="5.5" y="2" width="3" height="20" rx="1.5" fill={dark} />
          {/* Top milestone */}
          <circle cx="7" cy="5" r="3.2" fill={color} />
          <circle cx="7" cy="5" r="1.5" fill="#FFF" />
          {/* Middle milestone */}
          <circle cx="7" cy="12" r="3.2" fill={color} />
          <circle cx="7" cy="12" r="1.5" fill="#FFF" />
          {/* Bottom milestone */}
          <circle cx="7" cy="19" r="3.2" fill={color} />
          <circle cx="7" cy="19" r="1.5" fill="#FFF" />
          {/* Side content bars */}
          <rect x="12.5" y="3" width="9" height="4" rx="2" fill={color} />
          <rect x="14" y="4.2" width="5" height="1.5" rx="0.75" fill="#FFF" />
          <rect x="12.5" y="10" width="7" height="4" rx="2" fill={dark} />
          <rect x="14" y="11.2" width="3.5" height="1.5" rx="0.75" fill="#FFF" />
          <rect x="12.5" y="17" width="8" height="4" rx="2" fill={color} />
          <rect x="14" y="18.2" width="4.5" height="1.5" rx="0.75" fill="#FFF" />
        </svg>
      );

    case 'case-study':
      // Document with magnifying glass
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Document body */}
          <rect x="2" y="1" width="14" height="19" rx="2.5" fill="#FFF" />
          <rect x="2" y="1" width="14" height="19" rx="2.5" stroke={dark} strokeWidth="1.8" />
          {/* Document header bar */}
          <rect x="2" y="1" width="14" height="5" rx="2.5" fill={color} />
          <rect x="4.5" y="2.8" width="6" height="1.5" rx="0.75" fill="#FFF" />
          {/* Text lines */}
          <rect x="5" y="8.5" width="8" height="1.5" rx="0.75" fill={dark} />
          <rect x="5" y="11.5" width="6" height="1.5" rx="0.75" fill={dark} />
          <rect x="5" y="14.5" width="5" height="1.5" rx="0.75" fill={dark} />
          {/* Magnifying glass */}
          <circle cx="18" cy="16" r="4.5" fill={color} />
          <circle cx="18" cy="16" r="2.8" fill="#FFF" />
          <circle cx="17.2" cy="15.2" r="0.8" fill={color} />
          {/* Handle */}
          <rect x="20.5" y="19.5" width="2.5" height="4" rx="1" fill={dark} transform="rotate(-45 21 20.5)" />
        </svg>
      );

    case 'standard':
    default:
      // Open book with colored covers and white pages
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Left cover */}
          <path d="M12 5C10.5 3.5 7 2.5 3 3v15.5c4 0 7.5 1 9 2.5" fill={color} />
          {/* Right cover */}
          <path d="M12 5c1.5-1.5 5-2.5 9-2v15.5c-4 0-7.5 1-9 2.5" fill={dark} />
          {/* Left page (white inset) */}
          <path d="M12 6.5C10.8 5.3 8.2 4.5 5 4.7V17c3.2 0 5.5.7 7 1.7" fill="#FFF" />
          {/* Right page (white inset) */}
          <path d="M12 6.5c1.2-1.2 3.8-2 7-1.8V17c-3.2 0-5.5.7-7 1.7" fill="#FFF" />
          {/* Spine */}
          <path d="M12 5v16" stroke={dark} strokeWidth="1.3" strokeLinecap="round" />
          {/* Left text lines */}
          <rect x="6.5" y="8" width="4" height="1.3" rx="0.65" fill={color} />
          <rect x="6.5" y="10.5" width="3" height="1.3" rx="0.65" fill={color} />
          <rect x="6.5" y="13" width="3.5" height="1.3" rx="0.65" fill={color} />
          {/* Right text lines */}
          <rect x="13.5" y="8" width="4" height="1.3" rx="0.65" fill={dark} />
          <rect x="13.5" y="10.5" width="3" height="1.3" rx="0.65" fill={dark} />
          {/* Bookmark ribbon */}
          <path d="M15 3v5l1.2-1.2L17.5 8V3" fill="#FF6B6B" />
        </svg>
      );
  }
}

function GoldenCrown({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Crown base */}
      <path d="M4 17h16v2.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19.5V17z" fill={GOLD_DARK} />
      {/* Crown body */}
      <path d="M4 17h16l-2.5-9-3.5 4.5L12 6l-2 6.5L6.5 8 4 17z" fill={GOLD} />
      {/* Crown highlight */}
      <path d="M5.5 17l1.5-5.5L9.5 14l2.5-6 2.5 6.5 2.5-3L18.5 17" stroke="#FFF" strokeWidth="0.8" fill="none" strokeLinejoin="round" />
      {/* Gems */}
      <circle cx="8" cy="18.5" r="1.3" fill="#FF6B6B" />
      <circle cx="12" cy="18.5" r="1.3" fill="#4ADE80" />
      <circle cx="16" cy="18.5" r="1.3" fill="#60A5FA" />
      {/* Top jewel */}
      <circle cx="12" cy="5" r="1.5" fill="#FF6B6B" />
      <circle cx="12" cy="5" r="0.6" fill="#FFF" />
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

  const iconColor = state === 'locked' ? '#CFCFCF' : isGold ? GOLD : theme.color;
  const iconDark = state === 'locked' ? '#ABABAB' : isGold ? GOLD_DARK : theme.dark;
  const shadowColor = state === 'locked' ? '#999999' : isGold ? GOLD_DARK : theme.dark;

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
          <GoldenCrown size={ICON_SIZE} />
        ) : (
          <LessonTypeIcon
            type={lesson.type ?? 'standard'}
            color={iconColor}
            dark={iconDark}
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
