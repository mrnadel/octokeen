'use client';

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Quest, QuestRarity } from '@/data/engagement-types';
import { playSound } from '@/lib/sounds';
import { useIsDark } from '@/store/useThemeStore';
import { CurrencyIcon } from '@/components/ui/CurrencyIcon';

interface Props {
  quest: Quest;
  onClaim: (questId: string) => void;
  compact?: boolean;
}

// ---- Rarity color system ----

interface RarityTheme {
  label: string;
  /** Light-mode icon background */
  bg: string;
  /** Dark-mode icon background */
  bgDark: string;
  /** Primary accent (border, counter, badge) */
  accent: string;
  /** Progress bar gradient */
  bar: string;
  /** Light-mode rarity badge bg */
  badgeBg: string;
  /** Dark-mode rarity badge bg */
  badgeBgDark: string;
  /** Badge text color */
  badgeText: string;
}

const RARITY: Record<QuestRarity, RarityTheme> = {
  common: {
    label: 'Common',
    bg: '#F1F5F9',
    bgDark: 'rgba(148,163,184,0.15)',
    accent: '#64748B',
    bar: 'linear-gradient(90deg, #94A3B8, #64748B)',
    badgeBg: '#F1F5F9',
    badgeBgDark: 'rgba(148,163,184,0.2)',
    badgeText: '#64748B',
  },
  rare: {
    label: 'Rare',
    bg: '#DBEAFE',
    bgDark: 'rgba(59,130,246,0.15)',
    accent: '#3B82F6',
    bar: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
    badgeBg: '#DBEAFE',
    badgeBgDark: 'rgba(59,130,246,0.2)',
    badgeText: '#2563EB',
  },
  epic: {
    label: 'Epic',
    bg: '#EDE9FE',
    bgDark: 'rgba(139,92,246,0.15)',
    accent: '#8B5CF6',
    bar: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
    badgeBg: '#EDE9FE',
    badgeBgDark: 'rgba(139,92,246,0.2)',
    badgeText: '#7C3AED',
  },
  legendary: {
    label: 'Legendary',
    bg: '#FEF3C7',
    bgDark: 'rgba(245,158,11,0.15)',
    accent: '#F59E0B',
    bar: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
    badgeBg: '#FEF3C7',
    badgeBgDark: 'rgba(245,158,11,0.2)',
    badgeText: '#D97706',
  },
};

export const QuestCard = memo(function QuestCard({ quest, onClaim, compact = false }: Props) {
  const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
  const isComplete = quest.completed;
  const isClaimed = quest.claimed;
  const [claimPhase, setClaimPhase] = useState<'idle' | 'celebrating' | 'done'>('idle');
  const isDark = useIsDark();
  const rarity = RARITY[quest.rarity] ?? RARITY.common;
  const isLegendary = quest.rarity === 'legendary';

  // Show claimed state from either store (isClaimed) or local animation (claimPhase)
  const showClaimed = isClaimed || claimPhase !== 'idle';

  const handleClaim = useCallback(
    (questId: string) => {
      playSound('claimReward');
      setClaimPhase('celebrating');
      onClaim(questId);
      setTimeout(() => setClaimPhase('done'), 1400);
    },
    [onClaim],
  );

  // ---------- Compact card (home page widget) ----------
  if (compact) {
    return (
      <motion.div
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
          isDark ? 'bg-surface-800/80 hover:bg-surface-700/80' : 'bg-gray-50/80 hover:bg-gray-100/80'
        }`}
        animate={
          isComplete && !showClaimed
            ? {
                backgroundColor: isDark
                  ? ['rgba(30,41,59,0.8)', 'rgba(6,78,59,0.3)', 'rgba(30,41,59,0.8)']
                  : ['rgba(249,250,251,0.8)', 'rgba(220,252,231,0.5)', 'rgba(249,250,251,0.8)'],
              }
            : undefined
        }
        transition={isComplete && !showClaimed ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        {/* Icon */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-base"
          style={{
            background: isComplete
              ? isDark ? 'rgba(6,78,59,0.4)' : '#DCFCE7'
              : isDark ? rarity.bgDark : rarity.bg,
          }}
        >
          {quest.icon}
        </div>

        {/* Center */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[13px] font-bold text-gray-800 dark:text-surface-100 truncate">{quest.title}</span>
              {quest.rarity !== 'common' && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: isDark ? rarity.badgeBgDark : rarity.badgeBg,
                    color: rarity.badgeText,
                  }}
                >
                  {rarity.label}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-gray-400 dark:text-surface-500 shrink-0">
              {quest.progress}/{quest.target}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200/60 dark:bg-surface-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                background: showClaimed
                  ? '#A3E635'
                  : isComplete
                    ? 'linear-gradient(90deg, #34D399, #10B981)'
                    : rarity.bar,
              }}
            />
          </div>
        </div>

        {/* Right action */}
        <div className="flex-shrink-0">
          <AnimatePresence mode="wait">
            {showClaimed ? (
              claimPhase === 'celebrating' ? (
                <motion.div
                  key="celebrating"
                  className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-extrabold text-emerald-600"
                  initial={{ scale: 0, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                >
                  <CurrencyIcon size={13} />
                  <span>+{quest.reward.gems}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="claimed"
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: isDark ? 'rgba(6,78,59,0.4)' : '#DCFCE7' }}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <span className="text-emerald-500 text-sm font-bold">✓</span>
                </motion.div>
              )
            ) : isComplete ? (
              <motion.button
                key="claim-btn"
                onClick={() => handleClaim(quest.definitionId)}
                className="px-3 py-2 rounded-lg text-[11px] font-extrabold text-white shadow-sm min-h-[44px] min-w-[44px]"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 0 #047857',
                }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                whileTap={{ scale: 0.92 }}
                exit={{ scale: 1.3, opacity: 0, transition: { duration: 0.2 } }}
              >
                Claim
              </motion.button>
            ) : (
              <motion.div
                key="reward"
                className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-bold ${
                  isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-700'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CurrencyIcon size={14} />
                <span>{quest.reward.gems}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // ---------- Full-size card (/quests page) ----------
  return (
    <motion.div
      className="relative flex items-center gap-3 p-3 rounded-xl overflow-hidden"
      style={{
        background: showClaimed
          ? isDark ? 'rgba(6,78,59,0.15)' : '#F0FDF4'
          : isDark ? 'rgba(30,41,59,0.5)' : '#FAFAFA',
        borderLeft: `3px solid ${showClaimed ? '#10B981' : rarity.accent}`,
        minHeight: 76,
      }}
      animate={
        isLegendary && !showClaimed
          ? { borderLeftColor: [rarity.accent, '#FBBF24', rarity.accent] }
          : isComplete && !showClaimed
            ? { borderLeftColor: ['#10B981', '#34D399', '#10B981'] }
            : undefined
      }
      transition={
        (isLegendary && !showClaimed) || (isComplete && !showClaimed)
          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          : undefined
      }
    >
      {/* Legendary shimmer overlay */}
      {isLegendary && !showClaimed && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: isDark
              ? 'linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.06) 50%, transparent 60%)'
              : 'linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.08) 50%, transparent 60%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
      )}

      {/* Icon */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl text-xl"
        style={{
          background: showClaimed
            ? isDark ? 'rgba(6,78,59,0.4)' : '#DCFCE7'
            : isDark ? rarity.bgDark : rarity.bg,
        }}
      >
        {quest.icon}
      </div>

      {/* Center: title + rarity badge + description + progress bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-bold text-gray-800 dark:text-surface-100 truncate">{quest.title}</span>
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
            style={{
              background: isDark ? rarity.badgeBgDark : rarity.badgeBg,
              color: rarity.badgeText,
            }}
          >
            {rarity.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-surface-400 mb-1.5 truncate">{quest.description}</p>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200/60 dark:bg-surface-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                background: showClaimed
                  ? 'linear-gradient(90deg, #A3E635, #84CC16)'
                  : isComplete
                    ? 'linear-gradient(90deg, #34D399, #10B981)'
                    : rarity.bar,
              }}
            />
          </div>
          <span
            className="text-xs font-bold flex-shrink-0"
            style={{ color: showClaimed ? '#16A34A' : isComplete ? '#10B981' : rarity.accent }}
          >
            {quest.progress}/{quest.target}
          </span>
        </div>
      </div>

      {/* Right: reward badge / claim button / celebration / checkmark */}
      <div className="flex-shrink-0 flex items-center">
        <AnimatePresence mode="wait">
          {showClaimed ? (
            claimPhase === 'celebrating' ? (
              <motion.div
                key="celebrating"
                className="flex flex-col items-center gap-0.5"
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              >
                <span className="text-sm font-extrabold text-emerald-500 inline-flex items-center gap-0.5">
                  <CurrencyIcon size={15} />+{quest.reward.gems}
                </span>
                <span className="text-[10px] font-bold text-amber-500">+{quest.reward.xp} XP</span>
              </motion.div>
            ) : (
              <motion.div
                key="claimed"
                className="flex items-center justify-center w-9 h-9 rounded-full"
                style={{ background: isDark ? 'rgba(6,78,59,0.4)' : '#DCFCE7' }}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <span className="text-emerald-600 text-lg font-bold">✓</span>
              </motion.div>
            )
          ) : isComplete ? (
            <motion.button
              key="claim-btn"
              onClick={() => handleClaim(quest.definitionId)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white min-h-[44px]"
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 3px 0 #047857',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              whileTap={{ scale: 0.95 }}
              exit={{ scale: 1.3, opacity: 0, transition: { duration: 0.2 } }}
            >
              Claim
            </motion.button>
          ) : (
            <motion.div
              key="reward"
              className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-xs font-bold"
              style={{
                background: isDark ? rarity.bgDark : rarity.bg,
                color: rarity.accent,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="inline-flex items-center gap-0.5">
                <CurrencyIcon size={14} />
                {quest.reward.gems}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});
