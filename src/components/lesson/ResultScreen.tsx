'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useBackHandler } from '@/hooks/useBackHandler';
import { useEngagementActions } from '@/store/useEngagementStore';
import { TrialPromptModal } from '@/components/ui/TrialPromptModal';
import { GameButton } from '@/components/ui/GameButton';
import { FullScreenModal } from '@/components/ui/FullScreenModal';
import { MascotWithGlow } from '@/components/ui/MascotWithGlow';
import type { FXName } from '@/components/ui/ScreenFX';
import { playSound } from '@/lib/sounds';
import { useCompletionAdGate } from '@/components/ads/useCompletionAdGate';
import { InterstitialAd } from '@/components/ads/InterstitialAd';
import { CharacterAvatar } from '@/components/ui/CharacterAvatar';
import { creditAccuracyQuests, reportCompletionToFriendQuests } from './shared/completion-quests';
import { useDelayedContinueKey } from './shared/useDelayedContinueKey';
import { ResultStatCard } from './shared/ResultStatCard';

/** Stars awarded for a flawless lesson. */
const MAX_STARS = 3;
/** Gem bonus for three-starring a lesson on the first attempt. */
const THREE_STAR_FIRST_TIME_GEMS = 10;

export { ResultScreen };
export default function ResultScreen() {
  const lessonResult = useCourseStore((s) => s.lessonResult);
  const dismissResult = useCourseStore((s) => s.dismissResult);
  const { updateQuestProgress, updateLeagueXp, addGems } = useEngagementActions();
  const engagementTracked = useRef(false);
  const [resultCharacter, setResultCharacter] = useState<{ id: string; name: string; line: string } | null>(null);
  const { showingAd, requestDismiss: handleDismiss, closeAd } = useCompletionAdGate(dismissResult, !!lessonResult);

  useEffect(() => {
    (async () => {
      const profId = useCourseStore.getState().activeProfession;
      const { getCourseMetaForProfession } = await import('@/data/course/course-meta');
      const courseMeta = getCourseMetaForProfession(profId);
      if (!courseMeta) return;
      let sectionIdx: number | undefined;
      for (const unit of courseMeta) {
        if (unit.lessons.some(l => l.id === lessonResult?.lessonId)) {
          sectionIdx = unit.sectionIndex;
          break;
        }
      }
      if (sectionIdx === undefined) return;
      const { loadCharacters, loadSectionCharacterMap, loadCharacterLines, getCharacterForSection, getResultLine } = await import('@/lib/story-utils');
      const [characters, sectionMap, lines] = await Promise.all([
        loadCharacters(profId),
        loadSectionCharacterMap(profId),
        loadCharacterLines(profId),
      ]);
      const char = getCharacterForSection(sectionIdx, sectionMap, characters);
      if (!char) return;
      const line = getResultLine(lessonResult!.accuracy, char.id, lines);
      if (line) setResultCharacter({ id: char.id, name: char.name, line });
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useBackHandler(!!lessonResult, handleDismiss);
  useDelayedContinueKey(handleDismiss, !!lessonResult);

  // Sound on mount
  useEffect(() => {
    if (!lessonResult) return;
    playSound(lessonResult.passed ? 'lessonPass' : 'lessonFail');
  }, [lessonResult]);

  useEffect(() => {
    if (!lessonResult || engagementTracked.current) return;
    engagementTracked.current = true;
    updateLeagueXp(lessonResult.xpEarned);
    updateQuestProgress('xp_earned', lessonResult.xpEarned);
    if (lessonResult.passed) {
      updateQuestProgress('lessons_completed', 1);
      creditAccuracyQuests(updateQuestProgress, {
        accuracy: lessonResult.accuracy,
        questionCount: lessonResult.totalQuestions,
      });
      if (lessonResult.stars === MAX_STARS) updateQuestProgress('stars_earned', 1);
      if (lessonResult.isFirstCompletion && lessonResult.stars === MAX_STARS) {
        addGems(THREE_STAR_FIRST_TIME_GEMS, '3_star_first_time');
      }
    }
    reportCompletionToFriendQuests({
      xpEarned: lessonResult.xpEarned,
      accuracy: lessonResult.accuracy,
      completed: lessonResult.passed,
    });
  }, [lessonResult]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!lessonResult) return null;

  const passed = lessonResult.passed;
  const isFlawless = lessonResult.isFlawless;
  const isGolden = lessonResult.isGolden;
  const lessonProgress = useCourseStore((s) => s.progress.completedLessons[lessonResult.lessonId]);
  const attempts = lessonProgress?.attempts ?? 1;

  // Design system colors
  const bg = !passed ? '#CE3030' : isFlawless ? '#5B4FCF' : isGolden ? '#E8850C' : '#58A700';
  const fx: FXName = !passed ? 'hearts' : isFlawless ? 'sparkle-dust' : isGolden ? 'golden-rain' : 'confetti';
  const mascotPose = !passed ? 'sad' as const : isFlawless ? 'celebrating' as const : isGolden ? 'excited' as const : 'laughing' as const;
  const btnVariant = !passed ? 'red' as const : 'gold' as const;

  const getMessage = () => {
    if (!passed) return 'Not Quite!';
    if (isFlawless && isGolden) return 'Flawless Mastery!';
    if (isFlawless) return 'Flawless!';
    if (isGolden) return 'Mastered!';
    if (attempts >= 3) return 'Golden Unlocked!';
    if (lessonResult.accuracy >= 90) return 'Perfect Score!';
    return 'Lesson Complete!';
  };

  const getAccuracyLabel = () => {
    if (lessonResult.accuracy === 100) return 'PERFECT';
    if (lessonResult.accuracy >= 90) return 'AMAZING';
    if (lessonResult.accuracy >= 80) return 'GREAT';
    if (lessonResult.accuracy >= 60) return 'GOOD';
    return 'KEEP TRYING';
  };

  return (
    <>
      <FullScreenModal
        show={true}
        bg={bg}
        fx={fx}
        fullScreen
        labelId="result-heading"
        footer={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <GameButton variant={btnVariant} onClick={handleDismiss}>
              {passed ? 'Continue' : 'Try Again'}
            </GameButton>
          </motion.div>
        }
      >
        <motion.div
          className="mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
        >
          <MascotWithGlow pose={mascotPose} size={160} />
        </motion.div>

        <motion.h1
          id="result-heading"
          className="text-[28px] font-extrabold mb-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {getMessage()}
        </motion.h1>

        <motion.p
          className="text-sm text-white/50 font-semibold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {lessonResult.lessonTitle}
        </motion.p>

        {/* Stats — Duolingo-style cards */}
        <motion.div
          className="flex gap-3 w-full max-w-xs"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ResultStatCard
            header="Total XP"
            from="left"
            delay={0.55}
            ariaLabel={`Total XP: ${lessonResult.xpEarned}`}
          >
            <div className="py-4 flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
                <motion.span
                  className="text-[26px] font-extrabold text-white"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 15, delay: 0.7 }}
                >
                  {lessonResult.xpEarned}
                </motion.span>
              </div>
              {lessonResult.eventXpMultiplier && lessonResult.eventXpMultiplier > 1 && (
                <motion.div
                  className="text-[10px] font-semibold text-white/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  +{Math.round(lessonResult.xpEarned * (1 - 1 / lessonResult.eventXpMultiplier))} bonus from {lessonResult.activeEventNames?.join(' + ')}
                </motion.div>
              )}
            </div>
          </ResultStatCard>

          <ResultStatCard
            header={getAccuracyLabel()}
            from="right"
            delay={0.6}
            ariaLabel={`Accuracy: ${lessonResult.accuracy}%, ${getAccuracyLabel()}`}
          >
            <div className="py-4 flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-white" />
              <span className="text-[26px] font-extrabold text-white">
                {lessonResult.accuracy}%
              </span>
            </div>
          </ResultStatCard>
        </motion.div>

        {resultCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 mt-4"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)' }}
          >
            <CharacterAvatar characterId={resultCharacter.id} size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{resultCharacter.name}</div>
              <div className="text-sm font-semibold text-white/90">&ldquo;{resultCharacter.line}&rdquo;</div>
            </div>
          </motion.div>
        )}

        {isFlawless && passed && (
          <motion.p className="mt-4 text-sm font-bold text-white/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Flawless! 4x XP bonus
          </motion.p>
        )}
      </FullScreenModal>
      {lessonResult.isFirstCompletion && lessonResult.passed && <TrialPromptModal />}
      <InterstitialAd show={showingAd} onClose={closeAd} />
    </>
  );
}
