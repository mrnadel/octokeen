'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Target } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { getLessonById } from '@/data/course';

export { ResultScreen };
export default function ResultScreen() {
  const lessonResult = useCourseStore((s) => s.lessonResult);
  const dismissResult = useCourseStore((s) => s.dismissResult);

  if (!lessonResult) return null;

  const lessonInfo = getLessonById(lessonResult.lessonId);
  const unitColor = lessonInfo?.unit.color ?? '#10B981';

  const accuracyColor =
    lessonResult.accuracy >= 90
      ? 'text-green-600'
      : lessonResult.accuracy >= 70
        ? 'text-amber-600'
        : 'text-red-600';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
  } as const;

  return (
    <AnimatePresence>
      <motion.div
        key="result-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-white flex flex-col"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Decorative background dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-10"
              style={{
                backgroundColor: unitColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
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
            className="text-7xl mb-4"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
          >
            {lessonResult.stars === 3 ? '🌟' : lessonResult.stars === 2 ? '🎉' : '✅'}
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl font-extrabold text-gray-900 mb-1 text-center"
          >
            Lesson Complete!
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-500 mb-8 text-center"
          >
            {lessonResult.unitTitle} &mdash; {lessonResult.lessonTitle}
          </motion.p>

          {/* Stars */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-8"
          >
            {[1, 2, 3].map((starNum) => (
              <motion.div
                key={starNum}
                initial={{ scale: 0, rotate: -30 }}
                animate={{
                  scale: starNum <= lessonResult.stars ? 1 : 0.7,
                  rotate: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 250,
                  damping: 15,
                  delay: 0.5 + starNum * 0.15,
                }}
              >
                <Star
                  className={`w-12 h-12 ${
                    starNum <= lessonResult.stars
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200 fill-gray-200'
                  }`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Stats card */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-sm bg-gray-50 rounded-2xl p-5 space-y-4"
          >
            {/* Accuracy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Target className="w-5 h-5" />
                <span className="text-sm font-medium">Accuracy</span>
              </div>
              <span className={`text-lg font-bold ${accuracyColor}`}>
                {lessonResult.accuracy}%
              </span>
            </div>

            {/* Score breakdown */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Questions</span>
              <span className="text-sm font-semibold text-gray-700">
                {lessonResult.correctAnswers} / {lessonResult.totalQuestions} correct
              </span>
            </div>

            {/* XP earned */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">XP earned</span>
              <motion.span
                className="text-lg font-bold"
                style={{ color: unitColor }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 15, delay: 0.8 }}
              >
                +{lessonResult.xpEarned} XP
              </motion.span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Badges */}
            <div className="space-y-2">
              {lessonResult.isNewBest && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2"
                >
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">
                    New personal best!
                  </span>
                </motion.div>
              )}
              {lessonResult.isFirstCompletion && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.15 }}
                  className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2"
                >
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    First time completing this lesson!
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Continue button */}
        <motion.div
          className="px-6 pb-6"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <button
            onClick={dismissResult}
            className="w-full rounded-xl py-4 px-6 text-white font-bold text-lg transition-all duration-150 active:scale-[0.98] min-h-[56px]"
            style={{ backgroundColor: unitColor }}
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
