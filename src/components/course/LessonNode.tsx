'use client';

import { motion } from 'framer-motion';
import type { Lesson } from '@/data/course/types';

interface LessonNodeProps {
  lesson: Lesson;
  unitColor: string;
  state: 'completed' | 'current' | 'locked';
  stars?: number;
  onClick: () => void;
}

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5 mt-1" aria-label={`${count} out of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="text-xs leading-none"
          style={{ opacity: i <= count ? 1 : 0.25 }}
          aria-hidden="true"
        >
          &#x2B50;
        </span>
      ))}
    </div>
  );
}

export function LessonNode({ lesson, unitColor, state, stars, onClick }: LessonNodeProps) {
  const isInteractive = true;

  // Determine circle sizing and styles per state
  const circleSize = state === 'current' ? 72 : 64;

  const circleStyle: React.CSSProperties = {
    width: circleSize,
    height: circleSize,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: state === 'current' ? '1.75rem' : '1.5rem',
    cursor: isInteractive ? 'pointer' : 'default',
    border: 'none',
    outline: 'none',
    padding: 0,
    position: 'relative',
    ...(state === 'completed'
      ? {
          backgroundColor: unitColor,
          color: 'white',
          boxShadow: `0 2px 8px ${unitColor}40`,
        }
      : state === 'current'
        ? {
            backgroundColor: unitColor,
            color: 'white',
            boxShadow: `0 4px 20px ${unitColor}50`,
          }
        : {
            backgroundColor: '#E2E8F0',
            color: '#94A3B8',
            opacity: 0.6,
          }),
  };

  // Animation variants by state
  const currentPulse = {
    scale: [1, 1.06, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  const completedVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
    },
  };

  // Glow ring for current lesson
  const glowRing = state === 'current' ? (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        border: `3px solid ${unitColor}`,
        borderRadius: '50%',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 0, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  ) : null;

  const iconContent = state === 'completed' ? (
    <span aria-hidden="true">&#x2713;</span>
  ) : state === 'locked' ? (
    <span aria-hidden="true">&#x1F512;</span>
  ) : (
    <span aria-hidden="true">{lesson.icon}</span>
  );

  const handleClick = () => {
    if (isInteractive) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="flex flex-col items-center" style={{ minWidth: 100 }}>
      <div className="relative">
        {glowRing}
        {state === 'current' ? (
          <motion.div
            style={circleStyle}
            animate={currentPulse}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Start lesson: ${lesson.title}`}
            whileTap={isInteractive ? { scale: 0.92 } : undefined}
          >
            {iconContent}
          </motion.div>
        ) : state === 'completed' ? (
          <motion.div
            style={circleStyle}
            variants={completedVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Replay lesson: ${lesson.title}. ${stars ?? 0} of 3 stars.`}
            whileTap={isInteractive ? { scale: 0.92 } : undefined}
          >
            {iconContent}
          </motion.div>
        ) : (
          <motion.div
            style={circleStyle}
            role="button"
            tabIndex={0}
            aria-label={`Jump to lesson: ${lesson.title}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            whileTap={{ scale: 0.92 }}
          >
            {iconContent}
          </motion.div>
        )}
      </div>

      {/* Lesson title */}
      <p
        className="mt-2 text-xs font-medium text-center leading-tight max-w-[100px]"
        style={{
          color: state === 'locked' ? '#94A3B8' : '#334155',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {lesson.title}
      </p>

      {/* Stars for completed lessons */}
      {state === 'completed' && stars !== undefined && stars > 0 && (
        <StarDisplay count={stars} />
      )}
    </div>
  );
}
