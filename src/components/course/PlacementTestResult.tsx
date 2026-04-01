'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useBackHandler } from '@/hooks/useBackHandler';
import { useEngagementActions } from '@/store/useEngagementStore';
import { GameButton } from '@/components/ui/GameButton';
import { FullScreenModal } from '@/components/ui/FullScreenModal';
import { MascotWithGlow } from '@/components/ui/MascotWithGlow';
import { playSound } from '@/lib/sounds';

export default function PlacementTestResult() {
  const result = useCourseStore((s) => s.placementTestResult);
  const dismiss = useCourseStore((s) => s.dismissPlacementResult);
  const { updateQuestProgress, updateLeagueXp } = useEngagementActions();
  const engagementTracked = useRef(false);

  useBackHandler(!!result, dismiss);

  // Enter / Space dismisses
  useEffect(() => {
    if (!result) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismiss();
      }
    };
    const timer = setTimeout(() => window.addEventListener('keydown', handle), 500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handle);
    };
  }, [result, dismiss]);

  // Sound on mount
  useEffect(() => {
    if (!result) return;
    playSound(result.passed ? 'achievement' : 'lessonFail');
  }, [result]);

  // Engagement tracking (once)
  useEffect(() => {
    if (!result || engagementTracked.current) return;
    if (result.xpEarned <= 0) return;
    engagementTracked.current = true;

    updateLeagueXp(result.xpEarned);
    updateQuestProgress('xp_earned', result.xpEarned);
    if (result.passed) {
      updateQuestProgress('lessons_completed', result.unitsSkipped);
      if (result.accuracy >= 90) updateQuestProgress('accuracy_above_threshold', 1, { threshold: 0.9 });
      if (result.accuracy >= 80) updateQuestProgress('accuracy_above_threshold', 1, { threshold: 0.8 });
      if (result.accuracy === 100 && result.totalQuestions >= 3) updateQuestProgress('perfect_sessions', 1);
    }
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) return null;

  const passed = result.passed;

  return (
    <FullScreenModal
      show={true}
      bg={passed ? '#58A700' : '#CE3030'}
      fx={passed ? 'confetti' : 'hearts'}
      fullScreen
      labelId="placement-result-heading"
      footer={
        <GameButton variant={passed ? 'gold' : 'red'} onClick={dismiss}>
          {passed ? 'Continue' : 'Start from the beginning'}
        </GameButton>
      }
    >
      <motion.div
        className="mb-4"
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {passed ? (
          <MascotWithGlow pose="celebrating" size={120} flame />
        ) : (
          <MascotWithGlow pose="thinking" size={120} />
        )}
      </motion.div>

      <h2 id="placement-result-heading" className="text-2xl font-extrabold mb-1">
        {passed ? 'Placement Test Passed!' : 'Not quite yet'}
      </h2>

      <p className="text-sm text-white/60 mb-6">
        {passed
          ? `You unlocked ${result.targetUnitTitle}`
          : 'Work through the earlier units to build a stronger foundation.'}
      </p>

      {result.totalQuestions > 0 && (
        <motion.div
          className="flex gap-3 w-full max-w-xs"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* XP card */}
          <motion.div
            className="flex-1 rounded-2xl overflow-hidden"
            style={{ border: '3px solid rgba(255,255,255,0.3)' }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.55, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="py-1.5 text-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white">Total XP</span>
            </div>
            <div className="py-4 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
              <motion.span
                className="text-[26px] font-extrabold text-white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 15, delay: 0.7 }}
              >
                {result.xpEarned}
              </motion.span>
            </div>
          </motion.div>

          {/* Accuracy card */}
          <motion.div
            className="flex-1 rounded-2xl overflow-hidden"
            style={{ border: '3px solid rgba(255,255,255,0.3)' }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="py-1.5 text-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white">
                {result.accuracy >= 90 ? 'AMAZING' : result.accuracy >= 80 ? 'GREAT' : result.accuracy >= 60 ? 'GOOD' : 'KEEP TRYING'}
              </span>
            </div>
            <div className="py-4 flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-white" />
              <span className="text-[26px] font-extrabold text-white">{result.accuracy}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}

      {result.totalQuestions > 0 && passed && (
        <motion.div
          className="mt-4 flex w-full max-w-xs bg-white/10 rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          <div className="flex-1 py-3 text-center">
            <p className="text-lg font-extrabold">{result.correctAnswers}/{result.totalQuestions}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mt-0.5">Correct</p>
          </div>
          <div className="w-px bg-white/10 my-2" />
          <div className="flex-1 py-3 text-center">
            <p className="text-lg font-extrabold">{result.mistakes}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mt-0.5">Mistakes</p>
          </div>
          <div className="w-px bg-white/10 my-2" />
          <div className="flex-1 py-3 text-center">
            <p className="text-lg font-extrabold">{result.unitsSkipped} units</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mt-0.5">Skipped</p>
          </div>
        </motion.div>
      )}

      {result.accuracy === 100 && result.totalQuestions >= 3 && passed && (
        <motion.p
          className="mt-4 text-sm font-bold text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Flawless! 2x XP bonus
        </motion.p>
      )}
    </FullScreenModal>
  );
}
