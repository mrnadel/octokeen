'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Target, Zap } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { getLessonById } from '@/data/course';

export { ResultScreen };
export default function ResultScreen() {
  const lessonResult = useCourseStore((s) => s.lessonResult);
  const dismissResult = useCourseStore((s) => s.dismissResult);

  // Stable random positions for confetti
  const confettiPositions = useMemo(() => {
    const seed = (i: number) => {
      const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: 24 }, (_, i) => ({
      left: seed(i) * 100,
      top: seed(i + 50) * 100,
      size: 4 + seed(i + 100) * 8,
      delay: seed(i + 200) * 0.8,
      color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][
        Math.floor(seed(i + 300) * 8)
      ],
    }));
  }, []);

  if (!lessonResult) return null;

  const lessonInfo = getLessonById(lessonResult.lessonId);
  const unitColor = lessonInfo?.unit.color ?? '#10B981';

  const accuracyColor =
    lessonResult.accuracy >= 90
      ? 'text-green-600'
      : lessonResult.accuracy >= 70
        ? 'text-amber-600'
        : 'text-red-600';

  const getEmoji = () => {
    if (lessonResult.stars === 3) return '🌟';
    if (lessonResult.stars === 2) return '🎉';
    return '✅';
  };

  const getMessage = () => {
    if (lessonResult.stars === 3) return 'Perfect!';
    if (lessonResult.stars === 2) return 'Great job!';
    return 'Lesson Complete!';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 220, damping: 20 } },
  } as const;

  return (
    <AnimatePresence>
      <motion.div
        key="result-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          background: `linear-gradient(170deg, ${unitColor}08 0%, #FFFFFF 40%, ${unitColor}05 100%)`,
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiPositions.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: p.color,
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.5, 1, 0.8],
                rotate: [0, 180, 360],
                y: [0, -20, 10, 0],
              }}
              transition={{
                delay: 0.2 + p.delay,
                duration: 1.2,
                ease: 'easeOut',
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
          {/* Celebration emoji */}
          <motion.div
            variants={itemVariants}
            className="mb-2"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.1 }}
          >
            <span className="text-8xl block">{getEmoji()}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-extrabold text-gray-900 mb-1 text-center"
          >
            {getMessage()}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-500 mb-6 text-center font-medium"
          >
            {lessonResult.unitTitle} &mdash; {lessonResult.lessonTitle}
          </motion.p>

          {/* Stars */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-8"
          >
            {[1, 2, 3].map((starNum) => (
              <motion.div
                key={starNum}
                initial={{ scale: 0, rotate: -45 }}
                animate={{
                  scale: starNum <= lessonResult.stars ? 1 : 0.6,
                  rotate: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 12,
                  delay: 0.4 + starNum * 0.2,
                }}
              >
                <Star
                  className={`w-14 h-14 ${
                    starNum <= lessonResult.stars
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                      : 'text-gray-200 fill-gray-200'
                  }`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Stats card */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-lg border"
            style={{
              background: `linear-gradient(135deg, white, ${unitColor}06)`,
              borderColor: `${unitColor}20`,
            }}
          >
            {/* Accuracy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-gray-600">
                <Target className="w-5 h-5" />
                <span className="text-sm font-semibold">Accuracy</span>
              </div>
              <span className={`text-2xl font-extrabold ${accuracyColor}`}>
                {lessonResult.accuracy}%
              </span>
            </div>

            {/* Score breakdown */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-500 font-medium">Questions</span>
              <span className="text-sm font-bold text-gray-700">
                {lessonResult.correctAnswers} / {lessonResult.totalQuestions} correct
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200/60" />

            {/* XP earned */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-semibold">XP earned</span>
              </div>
              <motion.span
                className="text-2xl font-extrabold"
                style={{ color: unitColor }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 15, delay: 0.7 }}
              >
                +{lessonResult.xpEarned}
              </motion.span>
            </div>

            {/* Badges */}
            {(lessonResult.isNewBest || lessonResult.isFirstCompletion) && (
              <>
                <div className="border-t border-gray-200/60" />
                <div className="space-y-2">
                  {lessonResult.isNewBest && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center gap-2.5 bg-amber-50 rounded-xl px-3.5 py-2.5 border border-amber-200"
                    >
                      <Trophy className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-bold text-amber-700">
                        New personal best! 🏆
                      </span>
                    </motion.div>
                  )}
                  {lessonResult.isFirstCompletion && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.05 }}
                      className="flex items-center gap-2.5 bg-blue-50 rounded-xl px-3.5 py-2.5 border border-blue-200"
                    >
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-blue-700">
                        First time completing this lesson! 🎯
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.button
            onClick={dismissResult}
            className="w-full rounded-2xl py-5 px-6 text-white font-extrabold text-lg transition-all duration-150 min-h-[60px] shadow-lg"
            style={{
              backgroundColor: unitColor,
              boxShadow: `0 8px 24px ${unitColor}30`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            Continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
