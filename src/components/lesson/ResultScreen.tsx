'use client';

import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Target, Zap, Trophy, Crown, ChevronRight } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { getLessonById } from '@/data/course';

export { ResultScreen };
export default function ResultScreen() {
  const lessonResult = useCourseStore((s) => s.lessonResult);
  const dismissResult = useCourseStore((s) => s.dismissResult);

  // Stable confetti particles
  const confetti = useMemo(() => {
    const hash = (i: number) => {
      const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    const shapes = ['circle', 'square', 'triangle'] as const;
    return Array.from({ length: 36 }, (_, i) => ({
      left: hash(i) * 100,
      delay: hash(i + 50) * 2.5,
      size: 5 + hash(i + 100) * 9,
      duration: 2.5 + hash(i + 150) * 2,
      shape: shapes[Math.floor(hash(i + 200) * 3)],
      color: [
        '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3',
        '#54A0FF', '#5F27CD',
      ][Math.floor(hash(i + 300) * 10)],
      rotation: hash(i + 400) * 360,
      drift: (hash(i + 500) - 0.5) * 80,
    }));
  }, []);

  // Enter/Space to dismiss result screen
  useEffect(() => {
    if (!lessonResult) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismissResult();
      }
    };
    // Delay to prevent accidental trigger from previous Enter press
    const timer = setTimeout(() => {
      window.addEventListener('keydown', handleKeyDown);
    }, 500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lessonResult, dismissResult]);

  if (!lessonResult) return null;

  const lessonInfo = getLessonById(lessonResult.lessonId);
  const unitColor = lessonInfo?.unit.color ?? '#10B981';

  // Derive a darker shade for the gradient
  const darkenHex = (hex: string, factor: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
  };

  const darkBg = darkenHex(unitColor, 0.15);
  const midBg = darkenHex(unitColor, 0.25);

  const getMessage = () => {
    if (lessonResult.stars === 3) return 'Perfect Score!';
    if (lessonResult.stars === 2) return 'Great Work!';
    return 'Lesson Complete!';
  };

  const getSubMessage = () => {
    if (lessonResult.stars === 3) return 'Flawless performance';
    if (lessonResult.stars === 2) return 'Almost perfect';
    return 'You finished the lesson';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
    },
  } as const;

  return (
    <AnimatePresence>
      <motion.div
        key="result-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex flex-col overflow-hidden"
        style={{
          background: `linear-gradient(170deg, ${darkBg} 0%, ${midBg} 35%, ${darkenHex(unitColor, 0.3)} 100%)`,
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Radial glow behind the stars area */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140%',
            height: '50%',
            background: `radial-gradient(ellipse at center, ${unitColor}30 0%, transparent 65%)`,
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Falling confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map((p, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${p.left}%`,
                top: -20,
                width: p.size,
                height: p.shape === 'triangle' ? 0 : p.size,
                backgroundColor: p.shape === 'triangle' ? 'transparent' : p.color,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : 0,
                borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
                borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
                borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
              }}
              initial={{ y: -30, rotate: 0, opacity: 0 }}
              animate={{
                y: ['0vh', '110vh'],
                x: [0, p.drift],
                rotate: [0, p.rotation],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                delay: p.delay,
                duration: p.duration,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Crown / Trophy icon */}
          <motion.div
            variants={itemVariants}
            className="mb-4"
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${unitColor}, ${darkenHex(unitColor, 0.7)})`,
                boxShadow: `0 0 40px ${unitColor}50, 0 0 80px ${unitColor}25`,
              }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.15 }}
            >
              {lessonResult.stars === 3 ? (
                <Crown className="w-10 h-10 text-white drop-shadow-lg" />
              ) : (
                <Trophy className="w-10 h-10 text-white drop-shadow-lg" />
              )}
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-extrabold text-white mb-1 text-center tracking-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
          >
            {getMessage()}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm text-white/60 mb-6 text-center font-medium"
          >
            {getSubMessage()}
          </motion.p>

          {/* Stars */}
          <motion.div
            variants={itemVariants}
            className="flex items-end gap-2 mb-8"
          >
            {[1, 2, 3].map((starNum) => {
              const earned = starNum <= lessonResult.stars;
              const isMiddle = starNum === 2;
              return (
                <motion.div
                  key={starNum}
                  className="relative"
                  initial={{ scale: 0, rotate: -60, y: 20 }}
                  animate={{
                    scale: earned ? 1 : 0.55,
                    rotate: 0,
                    y: isMiddle && earned ? -8 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 14,
                    delay: 0.5 + starNum * 0.18,
                  }}
                >
                  {/* Glow behind earned stars */}
                  {earned && (
                    <div
                      className="absolute inset-0 blur-xl rounded-full"
                      style={{
                        background: '#FFD700',
                        opacity: 0.4,
                        transform: 'scale(1.5)',
                      }}
                    />
                  )}
                  <Star
                    className={`relative ${isMiddle ? 'w-16 h-16' : 'w-12 h-12'}`}
                    style={{
                      color: earned ? '#FFD700' : 'rgba(255,255,255,0.15)',
                      fill: earned ? '#FFD700' : 'rgba(255,255,255,0.08)',
                      filter: earned
                        ? 'drop-shadow(0 2px 8px rgba(255,215,0,0.5))'
                        : 'none',
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats card — frosted glass */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-sm rounded-3xl p-5 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Lesson info */}
            <div className="text-center pb-2 border-b border-white/10">
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">
                {lessonResult.unitTitle}
              </p>
              <p className="text-sm text-white/70 font-medium mt-0.5">
                {lessonResult.lessonTitle}
              </p>
            </div>

            {/* Accuracy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-white/60">
                <Target className="w-4.5 h-4.5" />
                <span className="text-sm font-semibold">Accuracy</span>
              </div>
              <span
                className="text-2xl font-extrabold"
                style={{
                  color:
                    lessonResult.accuracy >= 90
                      ? '#4ADE80'
                      : lessonResult.accuracy >= 70
                        ? '#FBBF24'
                        : '#FB7185',
                }}
              >
                {lessonResult.accuracy}%
              </span>
            </div>

            {/* Questions breakdown */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40 font-medium">Questions</span>
              <span className="text-sm font-bold text-white/80">
                {lessonResult.correctAnswers} / {lessonResult.totalQuestions} correct
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* XP earned */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <Zap className="w-4.5 h-4.5" />
                <span className="text-sm font-semibold">XP earned</span>
              </div>
              <motion.span
                className="text-2xl font-extrabold"
                style={{
                  color: unitColor,
                  filter: `drop-shadow(0 0 8px ${unitColor}60)`,
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 15, delay: 0.8 }}
              >
                +{lessonResult.xpEarned}
              </motion.span>
            </div>

            {/* Achievement badges */}
            {(lessonResult.isNewBest || lessonResult.isFirstCompletion) && (
              <>
                <div className="border-t border-white/10" />
                <div className="space-y-2">
                  {lessonResult.isNewBest && (
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                      style={{
                        background: 'rgba(255,215,0,0.12)',
                        border: '1px solid rgba(255,215,0,0.25)',
                      }}
                    >
                      <Trophy className="w-4.5 h-4.5 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-300">
                        New personal best!
                      </span>
                    </motion.div>
                  )}
                  {lessonResult.isFirstCompletion && (
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                      style={{
                        background: 'rgba(96,165,250,0.12)',
                        border: '1px solid rgba(96,165,250,0.25)',
                      }}
                    >
                      <Target className="w-4.5 h-4.5 text-blue-400" />
                      <span className="text-sm font-bold text-blue-300">
                        First time completing!
                      </span>
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Continue button */}
        <motion.div
          className="px-6 pb-6"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.button
            onClick={dismissResult}
            className="w-full rounded-2xl py-5 px-6 font-extrabold text-lg min-h-[60px] flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${unitColor}, ${darkenHex(unitColor, 0.8)})`,
              color: 'white',
              boxShadow: `0 4px 20px ${unitColor}40, 0 0 40px ${unitColor}20, inset 0 1px 0 rgba(255,255,255,0.2)`,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Continue
            <ChevronRight className="w-5 h-5" />
            <span className="text-xs opacity-60 font-semibold ml-0.5">↵</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
