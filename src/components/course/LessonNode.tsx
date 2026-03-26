'use client';

import { memo, useRef, useEffect, useState } from 'react';
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
const GOLD_DARK = '#B38600';

const ICON_SIZE = 28;
const DEPTH = 7; // 3D bottom layer offset

function LessonIcon({ type, size = ICON_SIZE }: { type: LessonType; size?: number }) {
  switch (type) {
    case 'conversation':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="13" rx="4" fill="#FFF" />
          <path d="M8 16v4.5l5-4.5H8Z" fill="#FFF" />
        </svg>
      );
    case 'speed-round':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M14.5 2L7 13h5.5L11 22L19 10h-5.5L14.5 2Z" fill="#FFF" />
        </svg>
      );
    case 'timeline':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="4.5" width="14" height="3.5" rx="1.75" fill="#FFF" />
          <rect x="5" y="10.25" width="14" height="3.5" rx="1.75" fill="#FFF" />
          <rect x="5" y="16" width="14" height="3.5" rx="1.75" fill="#FFF" />
        </svg>
      );
    case 'case-study':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="10.5" cy="10.5" r="7" stroke="#FFF" strokeWidth="3.2" />
          <path d="M16 16L21 21" stroke="#FFF" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case 'standard':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="7.8" height="14" rx="2" fill="#FFF" />
          <rect x="13.2" y="5" width="7.8" height="14" rx="2" fill="#FFF" />
        </svg>
      );
  }
}

function CheckIcon({ size = ICON_SIZE }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.5 12.5L10 17L18.5 7" stroke="#FFF" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrownIcon({ size = ICON_SIZE }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 16.5h16L18 7.5l-3.5 4.5L12 5l-2.5 7L6 7.5 4 16.5Z" fill="#FFF" />
      <rect x="4" y="16.5" width="16" height="3" rx="1" fill="#FFF" />
    </svg>
  );
}

/** Star dots for completed lessons */
function StarDots({ count, max }: { count: number; max: number }) {
  if (max <= 1) return null;
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: i < count ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
          }}
        />
      ))}
    </div>
  );
}

/** Hook: detects when element enters viewport */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
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
  const isGold = state === 'completed' && golden;
  const { ref, isVisible } = useInView(0.1);

  const bg = state === 'locked'
    ? '#D8D8D8'
    : isGold ? GOLD : theme.color;
  const rim = state === 'locked'
    ? '#ABABAB'
    : isGold ? GOLD_DARK : theme.dark;

  const icon = isGold
    ? <CrownIcon />
    : state === 'completed'
      ? <CheckIcon />
      : <LessonIcon type={lesson.type ?? 'standard'} />;

  const maxLevels = lesson.levels ?? 1;
  const completedLevels = state === 'completed'
    ? Math.min((golden ? (stars ?? 0) + 1 : (stars ?? 0)), maxLevels)
    : 0;

  const filterId = `wb-${lesson.id}`;

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.92 }}
        transition={{
          delay: index * 0.04,
          duration: 0.45,
          type: 'spring',
          stiffness: 300,
          damping: 24,
        }}
        style={{ width: '100%' }}
      >
        {/* 3D wide button container */}
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Bottom 3D layer */}
          <svg
            width="100%"
            viewBox="0 0 1012 293"
            fill="none"
            style={{
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          >
            <rect y="17" width="1012" height="270" rx="43" fill={rim} />
          </svg>

          {/* Interactive face button */}
          <motion.button
            className={state === 'current' ? 'lesson-btn-pulse' : ''}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: state === 'locked' ? 'default' : 'pointer',
              opacity: state === 'locked' ? 0.55 : 1,
              WebkitTapHighlightColor: 'transparent',
              '--go-glow-color': `${theme.color}40`,
            } as React.CSSProperties}
            onClick={onClick}
            whileHover={state !== 'locked' ? { y: -2, scale: 1.015 } : undefined}
            whileTap={state !== 'locked' ? { y: 4, scale: 0.985 } : undefined}
            aria-label={
              state === 'completed'
                ? `Replay: ${lesson.title}`
                : state === 'current'
                  ? `Start: ${lesson.title}`
                  : `Locked: ${lesson.title}`
            }
          >
            {/* Wide button SVG face */}
            <svg
              width="100%"
              viewBox="0 0 1012 280"
              fill="none"
              style={{ display: 'block' }}
            >
              <defs>
                <filter id={filterId} x="0" y="0" width="1012" height="284" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feMorphology radius="16" operator="erode" in="SourceAlpha" result="innerShadow"/>
                  <feOffset dy="4"/>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0"/>
                  <feBlend mode="normal" in2="shape" result="innerShadow"/>
                </filter>
                <clipPath id={`clip-${filterId}`}>
                  <rect width="1012" height="260" rx="43" />
                </clipPath>
              </defs>
              <g filter={`url(#${filterId})`}>
                <rect width="1012" height="260" rx="43" fill={bg} />
              </g>
              {/* Top highlight for 3D curvature */}
              <g clipPath={`url(#clip-${filterId})`}>
                <rect y="0" width="1012" height="80" fill="white" fillOpacity="0.12" rx="43" />
                <rect x="40" y="16" width="932" height="6" rx="3" fill="white" fillOpacity="0.18" />
              </g>
            </svg>

            {/* Content overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                gap: 14,
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                  }}
                >
                  {lesson.title}
                </div>
                {state === 'completed' && maxLevels > 1 && (
                  <StarDots count={completedLevels} max={maxLevels} />
                )}
              </div>

              {/* Right arrow / status */}
              <div
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {state === 'locked' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="3" fill="rgba(255,255,255,0.4)" />
                    <path d="M8 11V8a4 4 0 118 0v3" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
});

export { LessonNode as LessonRow };
