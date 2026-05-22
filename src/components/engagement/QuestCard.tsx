'use client';

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Quest } from '@/data/engagement-types';
import { playSound } from '@/lib/sounds';
import { useIsDark } from '@/store/useThemeStore';
import { CurrencyIcon } from '@/components/ui/CurrencyIcon';
import { RARITY } from './questRarityThemes';
import { LegendarySparkles } from './LegendarySparkles';
import { QuestIcon } from './QuestIcon';

interface Props {
  quest: Quest;
  onClaim: (questId: string) => void;
  onOpenChest?: (quest: Quest) => void;
  compact?: boolean;
}

export const QuestCard = memo(function QuestCard({ quest, onClaim, onOpenChest, compact = false }: Props) {
  const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
  const isComplete = quest.completed;
  const isClaimed = quest.claimed;
  const [claimPhase, setClaimPhase] = useState<'idle' | 'celebrating' | 'done'>('idle');
  const isDark = useIsDark();
  const theme = RARITY[quest.rarity] ?? RARITY.common;
  const isEpic = quest.rarity === 'epic';
  const isLegendary = quest.rarity === 'legendary';
  const isElevated = isEpic || isLegendary;

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
        <div
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            background: isComplete
              ? isDark ? 'rgba(6,78,59,0.4)' : '#DCFCE7'
              : isDark ? theme.compactIconBgDark : theme.compactIconBg,
          }}
        >
          <QuestIcon icon={quest.icon} size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[13px] font-bold text-gray-800 dark:text-surface-100 truncate">{quest.title}</span>
              {quest.rarity !== 'common' && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: isDark ? theme.compactBadgeBgDark : theme.compactBadgeBg,
                    color: theme.compactBadgeText,
                  }}
                >
                  {theme.label}
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
                background: showClaimed ? '#A3E635'
                  : isComplete ? 'linear-gradient(90deg, #34D399, #10B981)'
                  : theme.barFill,
              }}
            />
          </div>
        </div>
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

  // ================================================================
  // Full-size card (/quests page) — 3-column: Icon | Content | Reward
  // ================================================================

  const shadowH = isElevated ? 6 : 5;

  const claimedBg = isDark ? 'rgba(6,78,59,0.2)' : '#F0FDF4';
  const claimedBorder = isDark ? '1.5px solid rgba(16,185,129,0.3)' : '1.5px solid rgba(16,185,129,0.4)';
  const claimedShadow = isDark ? 'rgba(6,78,59,0.4)' : 'rgba(16,185,129,0.25)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group select-none"
    >
      <div className="relative" style={{ paddingBottom: shadowH }}>
        {/* 3D shadow */}
        <div
          className="absolute left-0 right-0 bottom-0 rounded-2xl"
          style={{
            height: `calc(100% - ${shadowH}px)`,
            top: shadowH,
            background: showClaimed ? claimedShadow : isDark ? theme.shadowDark : theme.shadow,
          }}
        />

        {/* Card surface */}
        <div
          className="relative w-full rounded-2xl transition-transform duration-75 group-active:translate-y-[var(--sh)]"
          style={{
            '--sh': `${shadowH}px`,
            background: showClaimed ? claimedBg : isDark ? theme.cardBgDark : theme.cardBg,
            border: showClaimed ? claimedBorder : isDark ? theme.cardBorderDark : theme.cardBorder,
          } as React.CSSProperties}
        >
          {/* Effects layer — clipped so shimmer/sparkles don't overflow */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            {isLegendary && !showClaimed && <LegendarySparkles isDark={isDark} />}
            {isElevated && !showClaimed && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: isLegendary
                    ? 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.18) 52%, transparent 70%)'
                    : 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.1) 52%, transparent 65%)',
                }}
                animate={{ x: ['-150%', '250%'] }}
                transition={{
                  duration: isLegendary ? 2.5 : 4,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatDelay: isLegendary ? 2 : 4,
                }}
              />
            )}
          </div>

          {/* 2-column layout: Icon | Content (title, desc, progress+rewards) */}
          <div className="relative flex gap-3 px-3 py-3">
            {/* Left: Icon — no background, large */}
            <div
              className="flex-shrink-0 flex items-center justify-center self-center"
              style={{ width: 52 }}
            >
              <QuestIcon icon={quest.icon} size={48} />
            </div>

            {/* Right: Content */}
            <div className="flex-1 min-w-0">
              {/* Row 1: Title + Badge */}
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span
                  className="text-[15px] font-extrabold leading-tight truncate"
                  style={{
                    color: showClaimed
                      ? isDark ? '#6EE7B7' : '#065F46'
                      : isDark ? theme.titleColorDark : theme.titleColor,
                  }}
                >
                  {quest.title}
                </span>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: isDark ? theme.badgeBgDark : theme.badgeBg,
                    border: `1px solid ${isDark ? theme.badgeBorderDark : theme.badgeBorder}`,
                    color: isDark ? theme.badgeTextDark : theme.badgeText,
                  }}
                >
                  {theme.label}
                </span>
              </div>

              {/* Subtitle — only for quests that need extra clarification */}
              {quest.tooltip && (
                <p
                  className="text-[11px] leading-snug mb-1.5"
                  style={{
                    color: showClaimed
                      ? isDark ? 'rgba(110,231,183,0.7)' : '#047857'
                      : isDark ? theme.descColorDark : theme.descColor,
                  }}
                >
                  {quest.tooltip}
                </p>
              )}

              {/* Row 2: Progress + Rewards / Claim (same row, space-between) */}
              <div className="flex items-center justify-between gap-3">
                {/* Progress bar + counter */}
                <div className="flex items-center gap-2 min-w-0" style={{ flex: '1 1 0', maxWidth: '55%' }}>
                  <div
                    className="flex-1 overflow-hidden rounded-full"
                    style={{
                      height: 7,
                      background: showClaimed
                        ? isDark ? 'rgba(6,78,59,0.3)' : 'rgba(16,185,129,0.15)'
                        : isDark ? theme.barTrackDark : theme.barTrack,
                    }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{
                        background: showClaimed || isComplete
                          ? 'linear-gradient(90deg, #34D399, #10B981)'
                          : theme.barFill,
                      }}
                    />
                  </div>
                  <span
                    className="text-[11px] font-bold flex-shrink-0 tabular-nums"
                    style={{
                      color: showClaimed
                        ? isDark ? '#6EE7B7' : '#059669'
                        : isComplete ? '#10B981'
                        : isDark ? theme.counterColorDark : theme.counterColor,
                    }}
                  >
                    {quest.progress}/{quest.target}
                  </span>
                </div>

                {/* Chest (replaces reward text) */}
                <div className="flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {showClaimed ? (
                      <motion.div
                        key="claimed"
                        className="flex items-center justify-center w-11 h-11 rounded-xl"
                        style={{ background: isDark ? 'rgba(6,78,59,0.4)' : '#DCFCE7' }}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <span className="text-emerald-500 text-lg font-bold">✓</span>
                      </motion.div>
                    ) : isComplete ? (
                      <motion.button
                        key="chest-ready"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenChest?.(quest);
                        }}
                        className="flex items-center justify-center w-11 h-11 rounded-xl"
                        style={{
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(124,58,237,0.4))'
                            : 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
                          border: `1.5px solid ${isDark ? 'rgba(139,92,246,0.5)' : 'rgba(124,58,237,0.3)'}`,
                          cursor: 'pointer',
                          boxShadow: isDark
                            ? '0 2px 8px rgba(139,92,246,0.3)'
                            : '0 2px 8px rgba(124,58,237,0.15)',
                        }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                        whileTap={{ scale: 0.92 }}
                        exit={{ scale: 1.3, opacity: 0, transition: { duration: 0.2 } }}
                      >
                        <span className="text-xl">🎁</span>
                      </motion.button>
                    ) : (
                      <motion.div
                        key="chest-locked"
                        className="flex items-center justify-center w-11 h-11 rounded-xl"
                        style={{
                          background: isDark ? 'rgba(51,65,85,0.25)' : 'rgba(203,213,225,0.25)',
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <span className="text-xl" style={{ opacity: 0.35, filter: 'grayscale(0.8)' }}>🎁</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
