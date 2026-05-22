'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCourseStore } from '@/store/useCourseStore';
import { useIsDark } from '@/store/useThemeStore';

import { StreakFlame, type StreakState } from '@/components/icons/StreakFlame';
import { getProfession } from '@/data/professions';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useGems } from '@/store/useEngagementStore';
import { useHeartsStore } from '@/store/useHeartsStore';
import { currencyLabel } from '@/data/currency';
import { CurrencyIcon } from '@/components/ui/CurrencyIcon';
import { getStreakStatus } from '@/lib/utils';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { CourseIcon } from '@/components/course/CourseIcon';

import { DoubleXpCountdown } from '@/components/course/DoubleXpCountdown';
import { CoursePopoverContent } from '@/components/course/CoursePopoverContent';
import { GemsPopoverContent } from '@/components/course/GemsPopoverContent';
import { HeartsPopoverContent } from '@/components/course/HeartsPopoverContent';

type PopoverType = 'course' | 'streak' | 'gems' | 'hearts' | null;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 17) return 'Good afternoon!';
  return 'Good evening!';
}

export function CourseHeader() {
  useSession();
  const isDark = useIsDark();
  const progress = useCourseStore((s) => s.progress);
  const streakStatus = getStreakStatus(progress.lastActiveDate);
  const flameState: StreakState = progress.currentStreak === 0
    ? 'none'
    : streakStatus === 'active'
      ? 'active'
      : streakStatus === 'at-risk'
        ? 'weak'
        : 'lost';
  const [popover, setPopover] = useState<PopoverType>(null);
  const gems = useGems();
  const activeProfession = useCourseStore((s) => s.activeProfession);
  const setActiveProfession = useCourseStore((s) => s.setActiveProfession);
  const profession = getProfession(activeProfession);
  const grantedCourses = useCourseAccess();
  const router = useRouter();

  const heartsCurrent = useHeartsStore((s) => s.current);
  const heartsMax = useHeartsStore((s) => s.max);
  const heartsIsUnlimited = useHeartsStore((s) => s.isUnlimited);
  const heartsRecharge = useHeartsStore((s) => s.rechargeHearts);

  const headerRef = useRef<HTMLElement>(null);
  const courseBtnRef = useRef<HTMLButtonElement>(null);
  const streakBtnRef = useRef<HTMLButtonElement>(null);
  const gemsBtnRef = useRef<HTMLButtonElement>(null);
  const heartsBtnRef = useRef<HTMLButtonElement>(null);
  const popoverPanelRef = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number; width: number; arrowLeft: number } | null>(null);

  const togglePopover = (type: PopoverType) => {
    if (popover === type) {
      setPopover(null);
      setPopoverPos(null);
      return;
    }
    const ref = type === 'course' ? courseBtnRef : type === 'streak' ? streakBtnRef : type === 'hearts' ? heartsBtnRef : gemsBtnRef;
    const headerEl = headerRef.current;
    if (!headerEl || !ref?.current) return;

    const headerRect = headerEl.getBoundingClientRect();
    const btnRect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const maxW = type === 'course' ? 360 : type === 'hearts' ? 320 : 340;
    const popoverWidth = vw >= 640 ? Math.min(maxW, vw - 32) : Math.min(300, vw - 32);

    // Center popover under the clicked button, clamped to viewport edges
    let left = btnCenterX - popoverWidth / 2;
    left = Math.max(16, Math.min(left, vw - popoverWidth - 16));

    const arrowLeft = btnCenterX - left - 7;

    setPopoverPos({
      top: headerRect.bottom + 10,
      left,
      width: popoverWidth,
      arrowLeft: Math.max(24, Math.min(arrowLeft, popoverWidth - 24)),
    });
    setPopover(type);
  };

  const closePopover = () => {
    setPopover(null);
    setPopoverPos(null);
  };

  // Close popover on scroll or outside tap (backdrop is z-40 but header is z-50, so taps on header miss the backdrop)
  useEffect(() => {
    if (!popover) return;
    const onScroll = () => closePopover();
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        popoverPanelRef.current?.contains(target) ||
        courseBtnRef.current?.contains(target) ||
        streakBtnRef.current?.contains(target) ||
        gemsBtnRef.current?.contains(target) ||
        heartsBtnRef.current?.contains(target)
      ) return;
      closePopover();
    };
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true });
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [popover]);

  return (
    <>
      {/* Header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 bg-[#FAFAFA] dark:bg-surface-950 px-4 sm:px-5 py-1.5 relative"
      >
        <div className="flex items-center justify-between w-full">
            {profession && (
              <button
                ref={courseBtnRef}
                className="flex items-center justify-center transition-all active:scale-95"
                style={{
                  width: 44,
                  height: 44,
                  background: popover === 'course' ? `${profession.color}12` : 'transparent',
                  borderRadius: 12,
                }}
                onClick={() => togglePopover('course')}
                aria-label={`Switch course — ${profession.name}`}
                aria-expanded={popover === 'course'}
              >
                <CourseIcon professionId={profession.id} color={profession.color} size={32} />
              </button>
            )}
            <button
              ref={streakBtnRef}
              className="flex items-center transition-all active:scale-95"
              style={{
                gap: 4,
                fontWeight: 800,
                fontSize: 17,
                color: streakStatus === 'at-risk'
                  ? '#DC2626'
                  : (isDark ? '#E2E8F0' : '#3C3C3C'),
                padding: '4px 8px',
                borderRadius: 10,
                background: streakStatus === 'at-risk'
                  ? (isDark ? 'rgba(220,38,38,0.15)' : '#FEF2F2')
                  : 'transparent',
                minWidth: 44,
                minHeight: 44,
                justifyContent: 'center',
              }}
              onClick={() => router.push('/streak')}
              aria-label={`${progress.currentStreak} day streak`}
            >
              <StreakFlame state={flameState} size={28} />
              <AnimatedCounter value={progress.currentStreak} showDelta deltaColor="#D97706" />
            </button>

            <button
              ref={gemsBtnRef}
              className="flex items-center transition-all active:scale-95"
              style={{
                gap: 4,
                fontWeight: 800,
                fontSize: 17,
                color: popover === 'gems' ? '#7C3AED' : (isDark ? '#E2E8F0' : '#3C3C3C'),
                padding: '4px 8px',
                borderRadius: 10,
                background: popover === 'gems' ? (isDark ? 'rgba(124,58,237,0.15)' : '#F3E8FF') : 'transparent',
                minWidth: 44,
                minHeight: 44,
                justifyContent: 'center',
              }}
              onClick={() => togglePopover('gems')}
              aria-label={`${gems.balance} ${currencyLabel(gems.balance)}`}
              aria-expanded={popover === 'gems'}
            >
              <CurrencyIcon size={28} />
              <AnimatedCounter value={gems.balance} showDelta deltaColor="#7C3AED" />
            </button>

            <button
              ref={heartsBtnRef}
              className="flex items-center transition-all active:scale-95"
              style={{
                gap: 4,
                fontWeight: 800,
                fontSize: 17,
                color: popover === 'hearts' ? '#E11D48' : heartsCurrent > 0 ? '#EF4444' : (isDark ? '#64748B' : '#9CA3AF'),
                padding: '4px 8px',
                borderRadius: 10,
                background: popover === 'hearts' ? (isDark ? 'rgba(225,29,72,0.15)' : '#FFF1F2') : 'transparent',
                minWidth: 44,
                minHeight: 44,
                justifyContent: 'center',
              }}
              onClick={() => { heartsRecharge(); togglePopover('hearts'); }}
              aria-label={heartsIsUnlimited() ? 'Unlimited hearts' : `${heartsCurrent} hearts`}
              aria-expanded={popover === 'hearts'}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {heartsIsUnlimited() ? (
                <span style={{ fontSize: 15 }}>&infin;</span>
              ) : (
                <AnimatedCounter value={heartsCurrent} />
              )}
            </button>

        </div>
        <AnimatePresence>
          <DoubleXpCountdown />
        </AnimatePresence>
      </header>


      {/* Backdrop — z-40, behind the z-50 header so buttons remain clickable */}
      <AnimatePresence>
        {popover && (
          <motion.div
            key="popover-backdrop"
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={closePopover}
          >
            <div className="absolute inset-0 bg-black/15" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popover panel — z-50, sibling of header so it floats above backdrop */}
      <AnimatePresence>
        {popover && popoverPos && (
          <motion.div
            ref={popoverPanelRef}
            key="popover-panel"
            className="fixed z-50"
            style={{
              top: popoverPos.top,
              left: popoverPos.left,
              width: popoverPos.width,
              maxWidth: popover === 'course' ? 360 : popover === 'hearts' ? 320 : 340,
              borderRadius: 16,
              background: isDark ? '#1E293B' : 'white',
              border: isDark ? '2px solid #334155' : '2px solid #E5E5E5',
              boxShadow: isDark
                ? '0 10px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)'
                : '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
              overflow: 'visible',
            }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow */}
            <div
              style={{
                position: 'absolute',
                top: -8,
                left: popoverPos.arrowLeft,
                width: 14,
                height: 14,
                background: isDark ? '#1E293B' : 'white',
                borderTop: isDark ? '2px solid #334155' : '2px solid #E5E5E5',
                borderLeft: isDark ? '2px solid #334155' : '2px solid #E5E5E5',
                transform: 'rotate(45deg)',
              }}
            />

            {/* Content */}
            <div style={{ padding: popover === 'course' ? 0 : 20, position: 'relative' }}>
                {popover === 'course' ? (
                  <CoursePopoverContent
                    activeProfession={activeProfession}
                    grantedCourses={grantedCourses}
                    onSelect={(id) => {
                      setActiveProfession(id);
                      closePopover();
                      if (id !== activeProfession) router.push('/');
                    }}
                  />
                ) : popover === 'gems' ? (
                  <GemsPopoverContent gems={gems} onGoToShop={closePopover} />
                ) : popover === 'hearts' ? (
                  <HeartsPopoverContent onClose={closePopover} />
                ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
