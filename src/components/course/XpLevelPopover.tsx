'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsDark } from '@/store/useThemeStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { useStore } from '@/store/useStore';
import { getXpToNextLevel, levels } from '@/data/levels';
import { getLevelReward } from '@/data/level-rewards';
import { getTodayString } from '@/lib/utils';
import { LevelBadge } from '@/components/engagement/LevelBadge';
import { CurrencyIcon } from '@/components/ui/CurrencyIcon';
import { LevelUpConfetti } from '@/components/course/LevelUpConfetti';

// ─── Animated counter hook ───
function useAnimatedCount(target: number, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

export function XpLevelPopover({ totalXp }: { totalXp: number }) {
  const isDark = useIsDark();
  const { current, next, xpNeeded, progress: levelProgress } = getXpToNextLevel(totalXp);
  const isMaxLevel = !next;
  const progressPercent = Math.round(levelProgress * 100);
  const nextReward = next ? getLevelReward(next.level) : null;
  const isAlmostThere = !isMaxLevel && levelProgress >= 0.85;

  // Animated counters
  const animatedTotalXp = useAnimatedCount(totalXp);
  const animatedXpNeeded = useAnimatedCount(xpNeeded);

  // Daily XP from practice session history
  const sessionHistory = useStore((s) => s.progress.sessionHistory);
  const todayXp = useMemo(() => {
    const today = getTodayString();
    return sessionHistory
      .filter((s) => s.date === today)
      .reduce((sum, s) => sum + s.xpEarned, 0);
  }, [sessionHistory]);
  const animatedTodayXp = useAnimatedCount(todayXp);

  // Double XP boost
  const doubleXpExpiry = useEngagementStore((s) => s.doubleXpExpiry);
  const hasDoubleXp = doubleXpExpiry ? new Date(doubleXpExpiry) > new Date() : false;

  // Level-up celebration: detect if user just reached this level recently
  // Check if currentLevel changed since the popover last rendered a different level
  const [celebrateLevel, setCelebrateLevel] = useState<number | null>(null);
  const prevLevelRef = useRef(current.level);
  useEffect(() => {
    if (current.level > prevLevelRef.current) {
      setCelebrateLevel(current.level);
      const timer = setTimeout(() => setCelebrateLevel(null), 3000);
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = current.level;
  }, [current.level]);

  // Level roadmap: show next 3 levels
  const currentIdx = levels.findIndex((l) => l.level === current.level);
  const upcomingLevels = levels.slice(currentIdx + 1, currentIdx + 4);

  // Social comparison (simulated percentile based on level)
  const percentile = Math.min(99, Math.round(((current.level - 1) / (levels.length - 1)) * 100));

  return (
    <div style={{ position: 'relative' }}>
      {/* Confetti overlay for level-up */}
      <AnimatePresence>
        {celebrateLevel && <LevelUpConfetti />}
      </AnimatePresence>

      {/* Level-up celebration banner */}
      <AnimatePresence>
        {celebrateLevel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 14,
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            <motion.p
              style={{ fontSize: 22, marginBottom: 2 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              🎉
            </motion.p>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#78350F' }}>
              Level {celebrateLevel} Unlocked!
            </p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#92400E', marginTop: 2 }}>
              You&apos;re now a {current.title}!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level badge + title */}
      <div className="flex items-center" style={{ gap: 12, marginBottom: 14 }}>
        <motion.div
          style={{
            width: 52,
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0,
          }}
          initial={{ rotate: -8, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        >
          <LevelBadge level={current} size={52} />
          {/* Level number badge */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 900,
              color: 'white',
              border: isDark ? '2px solid #1E293B' : '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            {current.level}
          </div>
        </motion.div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: isDark ? '#E2E8F0' : '#3C3C3C', lineHeight: 1.2 }}>
            {current.title}
          </h3>
          <div className="flex items-center" style={{ gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#A855F7' }}>
              Level {current.level}{isMaxLevel ? ' — MAX' : ''}
            </span>
            {hasDoubleXp && (
              <motion.span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: '#D97706',
                  background: isDark ? 'rgba(217,119,6,0.15)' : '#FEF3C7',
                  padding: '1px 6px',
                  borderRadius: 6,
                  border: isDark ? '1px solid rgba(217,119,6,0.3)' : '1px solid #FDE68A',
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                2× XP
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Today's XP + Total XP stats row */}
      <div className="grid grid-cols-2" style={{ gap: 8, marginBottom: 14 }}>
        <motion.div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0.1) 100%)'
              : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: 12,
            padding: '10px 12px',
            textAlign: 'center',
            border: isDark ? '1.5px solid rgba(22,163,74,0.25)' : '1.5px solid #BBF7D0',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p style={{ fontSize: 22, fontWeight: 800, color: '#16A34A', lineHeight: 1 }}>
            +{animatedTodayXp.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: '#15803D', fontWeight: 700, marginTop: 3 }}>
            Today
          </p>
        </motion.div>
        <motion.div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.1) 100%)'
              : 'linear-gradient(135deg, #F5EAFF 0%, #EDE0FF 100%)',
            borderRadius: 12,
            padding: '10px 12px',
            textAlign: 'center',
            border: isDark ? '1.5px solid rgba(168,85,247,0.25)' : '1.5px solid #E4D0FA',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p style={{ fontSize: 22, fontWeight: 800, color: '#7B2FBE', lineHeight: 1 }}>
            {animatedTotalXp.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: '#9E5DD0', fontWeight: 700, marginTop: 3 }}>
            Total XP
          </p>
        </motion.div>
      </div>

      {/* XP progress bar to next level */}
      {!isMaxLevel && next ? (
        <motion.div
          style={{
            background: isAlmostThere
              ? (isDark ? 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.08) 100%)' : 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)')
              : (isDark ? 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.08) 100%)' : 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)'),
            borderRadius: 14,
            padding: '14px 14px 16px',
            marginBottom: 14,
            border: isAlmostThere
              ? (isDark ? '1.5px solid rgba(249,115,22,0.3)' : '1.5px solid #FDBA74')
              : (isDark ? '1.5px solid rgba(168,85,247,0.25)' : '1.5px solid #E9D5FF'),
            position: 'relative',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Almost-there glow effect */}
          {isAlmostThere && (
            <motion.div
              style={{
                position: 'absolute',
                inset: -2,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(168,85,247,0.08) 100%)',
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Next level label */}
          <div className="flex justify-between items-center" style={{ marginBottom: 10, position: 'relative' }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: isAlmostThere ? '#C2410C' : '#9333EA',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {isAlmostThere ? 'So close!' : `Next: Level ${next.level}`}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              color: isAlmostThere ? '#EA580C' : '#7C3AED',
            }}>
              {animatedXpNeeded.toLocaleString()} XP to go
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ position: 'relative', height: 16, background: isAlmostThere ? (isDark ? 'rgba(249,115,22,0.2)' : '#FED7AA') : (isDark ? 'rgba(168,85,247,0.2)' : '#E9D5FF'), borderRadius: 8, overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%',
                background: isAlmostThere
                  ? 'linear-gradient(90deg, #F97316 0%, #EA580C 40%, #DC2626 100%)'
                  : 'linear-gradient(90deg, #C084FC 0%, #A855F7 40%, #7C3AED 100%)',
                borderRadius: 8,
                position: 'relative',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Shimmer effect */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                  borderRadius: '8px 8px 0 0',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: isAlmostThere ? 1.5 : 2.5, repeat: Infinity, ease: 'linear', repeatDelay: isAlmostThere ? 0.3 : 1 }}
              />
            </motion.div>

            {/* "Almost there" pulse ring on the progress edge */}
            {isAlmostThere && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${progressPercent}%`,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#F97316',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 0 0 rgba(249,115,22,0.4)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(249,115,22,0.4)',
                    '0 0 0 6px rgba(249,115,22,0)',
                  ],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </div>

          {/* Percentage + XP counts */}
          <div className="flex justify-between items-center" style={{ marginTop: 6, position: 'relative' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: isAlmostThere ? '#EA580C' : '#A78BFA' }}>
              {progressPercent}%
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: isAlmostThere ? '#FB923C' : '#C4B5FD' }}>
              {(totalXp - current.xpRequired).toLocaleString()} / {(next.xpRequired - current.xpRequired).toLocaleString()} XP
            </span>
          </div>

          {/* Urgency message */}
          {isAlmostThere && (
            <motion.p
              style={{ fontSize: 11, fontWeight: 700, color: '#C2410C', textAlign: 'center', marginTop: 8 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Just {xpNeeded} more XP — one lesson could do it!
            </motion.p>
          )}
        </motion.div>
      ) : (
        /* Max level reached */
        <motion.div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(217,119,6,0.15) 0%, rgba(217,119,6,0.1) 100%)'
              : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            borderRadius: 14,
            padding: '16px 14px',
            marginBottom: 14,
            border: isDark ? '1.5px solid rgba(217,119,6,0.3)' : '1.5px solid #FCD34D',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.p
            style={{ fontSize: 28, marginBottom: 4 }}
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ type: 'tween', duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            👑
          </motion.p>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#92400E' }}>
            Mechanical Grandmaster
          </p>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#B45309', marginTop: 2 }}>
            You&apos;ve mastered it all. Legendary!
          </p>
        </motion.div>
      )}

      {/* Next level reward preview */}
      {nextReward && next && (
        <motion.div
          style={{
            background: nextReward.isMilestone
              ? (isDark ? 'linear-gradient(135deg, rgba(217,119,6,0.12) 0%, rgba(217,119,6,0.08) 100%)' : 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)')
              : (isDark ? '#0F172A' : '#F9FAFB'),
            borderRadius: 12,
            padding: '10px 12px',
            marginBottom: 12,
            border: nextReward.isMilestone
              ? (isDark ? '1.5px solid rgba(217,119,6,0.3)' : '1.5px solid #FDE68A')
              : (isDark ? '1px solid #334155' : '1px solid #F0F0F0'),
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            color: nextReward.isMilestone ? '#92400E' : '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 6,
          }}>
            {nextReward.isMilestone ? '⭐ Milestone Reward' : 'Next Reward'}
          </p>
          <div className="flex items-center" style={{ gap: 8 }}>
            <motion.span
              style={{ fontSize: 20 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.35 }}
            >
              <LevelBadge level={next} size={28} />
            </motion.span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#CBD5E1' : '#374151' }}>
                {next.title}
              </p>
              <div className="flex items-center flex-wrap" style={{ gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#7C3AED' }}>
                  +{nextReward.gems} <CurrencyIcon size={14} />
                </span>
                {nextReward.title && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#D97706' }}>
                    + &quot;{nextReward.title}&quot; title
                  </span>
                )}
                {nextReward.frame && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#059669' }}>
                    + Frame
                  </span>
                )}
                {nextReward.streakFreeze && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#2563EB' }}>
                    + Streak Freeze
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Level roadmap — next 3 levels */}
      {upcomingLevels.length > 0 && (
        <motion.div
          style={{
            background: isDark ? '#0F172A' : '#FAFAFA',
            borderRadius: 12,
            padding: '10px 12px',
            marginBottom: 12,
            border: isDark ? '1px solid #334155' : '1px solid #F0F0F0',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Ahead of you
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {upcomingLevels.map((level, i) => {
              const reward = getLevelReward(level.level);
              const isNext = i === 0;
              return (
                <motion.div
                  key={level.level}
                  className="flex items-center"
                  style={{
                    gap: 10,
                    padding: '6px 0',
                    borderBottom: i < upcomingLevels.length - 1 ? (isDark ? '1px solid #334155' : '1px solid #F0F0F0') : 'none',
                    opacity: 1 - i * 0.2,
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1 - i * 0.2, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                >
                  {/* Vertical line connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: isNext
                          ? 'linear-gradient(135deg, #A855F7, #7C3AED)'
                          : (isDark ? '#334155' : '#E5E7EB'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        boxShadow: isNext ? '0 2px 6px rgba(168,85,247,0.3)' : 'none',
                      }}
                    >
                      <LevelBadge level={level} size={20} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: isNext ? (isDark ? '#E2E8F0' : '#3C3C3C') : (isDark ? '#64748B' : '#9CA3AF') }}>
                      Lv.{level.level} — {level.title}
                    </p>
                    <p style={{ fontSize: 10, color: '#C4B5FD', fontWeight: 600 }}>
                      {level.xpRequired.toLocaleString()} XP
                      {reward?.isMilestone && (
                        <span style={{ color: '#F59E0B', marginLeft: 4 }}>★ Milestone</span>
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Social comparison footer */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {percentile > 0 && (
          <p style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', marginBottom: 4 }}>
            Ahead of {percentile}% of engineers
          </p>
        )}
        <p style={{ fontSize: 10, color: '#AFAFAF', fontWeight: 600 }}>
          {hasDoubleXp ? '2× XP active — earn double from every lesson!' : 'Earn XP by completing lessons. 3 stars = 3× XP!'}
        </p>
      </motion.div>
    </div>
  );
}
