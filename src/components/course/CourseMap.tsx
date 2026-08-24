'use client';

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useHeartsStore } from '@/store/useHeartsStore';
import { useSubscription } from '@/hooks/useSubscription';
import { LIMITS, isUnitUnlocked } from '@/lib/pricing';
import { getUnitTheme } from '@/lib/unitThemes';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { OutOfHeartsModal } from '@/components/ui/OutOfHeartsModal';
import { LessonNode } from './LessonNode';
import { UnitHeroHeader, HERO_COMPACT_HEIGHT } from './UnitHeroHeader';
import { useIsDark } from '@/store/useThemeStore';
import { useMasteryStore } from '@/store/useMasteryStore';
import { getDecayedQuestions } from '@/lib/review-engine';
import { ActiveEventBanner } from '@/components/ui/ActiveEventBanner';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { JumpHereButton } from './JumpHereButton';
import { useScrollDirection } from './useScrollDirection';
import { ScrollToCurrentButton } from './ScrollToCurrentButton';
import { JumpModals, type JumpModalType } from './JumpModals';
import { GOLD } from './constants';

export function CourseMap() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUnitRef = useRef<HTMLDivElement>(null);
  const currentLessonRef = useRef<HTMLDivElement>(null);
  const unitElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollDirection = useScrollDirection(currentLessonRef, scrollRef);
  const [headerStyle, setHeaderStyle] = useState({ top: 0 });
  const progress = useCourseStore((s) => s.progress);
  const courseData = useCourseStore((s) => s.courseData);
  const startLesson = useCourseStore((s) => s.startLesson);
  const contentLoadError = useCourseStore((s) => s.contentLoadError);
  const dismissContentLoadError = useCourseStore((s) => s.dismissContentLoadError);
  const startPlacementTest = useCourseStore((s) => s.startPlacementTest);
  const debugSkipToUnit = useCourseStore((s) => s.debugSkipToUnit);
  const debugSkipToLesson = useCourseStore((s) => s.debugSkipToLesson);
  const isLessonUnlocked = useCourseStore((s) => s.isLessonUnlocked);
  const activeProfession = useCourseStore((s) => s.activeProfession);
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDark = useIsDark();
  const isGuest = status !== 'authenticated';
  const { isProUser } = useSubscription();
  const hasHearts = useHeartsStore((s) => s.hasHearts);
  const masteryEvents = useMasteryStore((s) => s.events);

  // Build set of lesson IDs that need spaced review
  const reviewLessonIds = useMemo(() => {
    const decayed = getDecayedQuestions(masteryEvents, courseData);
    const ids = new Set<string>();
    for (const c of decayed) {
      const unit = courseData[c.unitIndex];
      const lesson = unit?.lessons?.[c.lessonIndex];
      if (lesson) ids.add(lesson.id);
    }
    return ids;
  }, [masteryEvents, courseData]);

  const [sectionCharMap, setSectionCharMap] = useState<Record<number, string>>({});

  useEffect(() => {
    (async () => {
      const { loadSectionCharacterMap } = await import('@/lib/story-utils');
      const profId = useCourseStore.getState().activeProfession;
      const map = await loadSectionCharacterMap(profId);
      setSectionCharMap(map);
    })();
  }, []);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [jumpModal, setJumpModal] = useState<JumpModalType | null>(null);
  const [visibleUnitIndex, setVisibleUnitIndex] = useState(0);
  const floatingRef = useRef<HTMLDivElement>(null);

  const isFreeLocked = useCallback((unitIndex: number) =>
    !isGuest && !isProUser && !isUnitUnlocked(LIMITS.free.unlockedUnits, unitIndex), [isGuest, isProUser]);

  // Check if a unit is jumpable via placement test (locked, but not paywall/guest blocked)
  const isUnitJumpable = useCallback((unitIndex: number) => {
    const isGuestLocked = isGuest && !isUnitUnlocked(LIMITS.free.unlockedUnits, unitIndex);
    if (isGuestLocked || isFreeLocked(unitIndex)) return false;
    // All lessons must be locked (unit not yet reached)
    const noAccessible = !courseData[unitIndex]?.lessons.some((_, li) => isLessonUnlocked(unitIndex, li));
    return noAccessible;
  }, [isGuest, isFreeLocked, courseData, isLessonUnlocked]);

  const getLessonState = useCallback(
    (
      unitIndex: number,
      lessonIndex: number
    ): 'completed' | 'current' | 'locked' => {
      const lessonId = courseData[unitIndex]?.lessons[lessonIndex]?.id;
      if (!lessonId) return 'locked';

      if (isGuest && !isUnitUnlocked(LIMITS.free.unlockedUnits, unitIndex)) return 'locked';
      if (isFreeLocked(unitIndex)) return 'locked';

      if (progress.completedLessons[lessonId]?.passed) return 'completed';
      if (isLessonUnlocked(unitIndex, lessonIndex)) return 'current';
      return 'locked';
    },
    [progress.completedLessons, isLessonUnlocked, isGuest, isProUser] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const placementUnitIndex = useCourseStore((s) => s.progress.placementUnitIndex ?? 0);

  // The unit the map should open on: the one holding the next lesson to do, so
  // the section shown matches the lesson the map scrolls to. Falls back to the
  // last completed unit (course finished) and then to the placement unit.
  const findActiveUnitIndex = useCallback((): number => {
    const startUnit = placementUnitIndex;
    for (let ui = startUnit; ui < courseData.length; ui++) {
      for (let li = 0; li < courseData[ui].lessons.length; li++) {
        if (getLessonState(ui, li) === 'current') return ui;
      }
    }
    // User may have gone back to an earlier unit than the placement jump.
    for (let ui = 0; ui < startUnit; ui++) {
      for (let li = 0; li < courseData[ui].lessons.length; li++) {
        if (getLessonState(ui, li) === 'current') return ui;
      }
    }
    let lastCompletedUnit = placementUnitIndex;
    for (let ui = 0; ui < courseData.length; ui++) {
      for (let li = 0; li < courseData[ui].lessons.length; li++) {
        if (getLessonState(ui, li) === 'completed') {
          lastCompletedUnit = Math.max(lastCompletedUnit, ui);
        }
      }
    }
    return lastCompletedUnit;
  }, [getLessonState, placementUnitIndex]);

  const activeUnitIndex = useMemo(() => findActiveUnitIndex(), [findActiveUnitIndex]);

  // Group units into sections (courses without sectionIndex treat all units as one section)
  const sections = useMemo(() => {
    const hasSections = courseData.some((u) => u.sectionIndex != null);
    if (!hasSections) {
      return [{ sectionIndex: 0, sectionTitle: '', units: courseData.map((u, i) => ({ unit: u, globalIndex: i })) }];
    }
    const groups: { sectionIndex: number; sectionTitle: string; units: { unit: typeof courseData[0]; globalIndex: number }[] }[] = [];
    let current: typeof groups[0] | null = null;
    courseData.forEach((unit, i) => {
      const si = unit.sectionIndex ?? -1;
      if (!current || current.sectionIndex !== si) {
        current = { sectionIndex: si, sectionTitle: unit.sectionTitle ?? unit.title, units: [] };
        groups.push(current);
      }
      current.units.push({ unit, globalIndex: i });
    });
    return groups;
  }, [courseData]);

  const hasSections = sections.length > 1;

  // Determine which section the user is in based on progress
  const activeSectionPos = useMemo(() => {
    if (!hasSections) return 0;
    // findIndex returns -1 when the unit is out of range (e.g. a stale placement
    // index from a longer course) — fall back to the first section, not -1.
    const pos = sections.findIndex((s) => s.units.some((u) => u.globalIndex === activeUnitIndex));
    return pos >= 0 ? pos : 0;
  }, [hasSections, sections, activeUnitIndex]);

  const [viewingSectionPos, setViewingSectionPos] = useState(activeSectionPos);
  useEffect(() => { setViewingSectionPos(activeSectionPos); }, [activeSectionPos]);

  const currentSection = sections[viewingSectionPos] ?? sections[0];
  const nextSection = sections[viewingSectionPos + 1] ?? null;
  const prevSection = viewingSectionPos > 0 ? sections[viewingSectionPos - 1] : null;

  // Find the first "current" (next-to-do) lesson to scroll to.
  // Start from the placement unit so the map scrolls to the right place.
  const currentLessonId = useMemo(() => {
    const startUnit = placementUnitIndex;
    // First check from placement unit onwards for the first uncompleted lesson
    for (let ui = startUnit; ui < courseData.length; ui++) {
      for (let li = 0; li < courseData[ui].lessons.length; li++) {
        if (getLessonState(ui, li) === 'current') {
          return courseData[ui].lessons[li].id;
        }
      }
    }
    // Fallback: check from beginning (user may have gone back to earlier units)
    for (let ui = 0; ui < startUnit; ui++) {
      for (let li = 0; li < courseData[ui].lessons.length; li++) {
        if (getLessonState(ui, li) === 'current') {
          return courseData[ui].lessons[li].id;
        }
      }
    }
    return null;
  }, [getLessonState, placementUnitIndex]);


  // Stable callback for lesson clicks
  const handleLessonClick = useCallback(
    (unitIndex: number, lessonIndex: number, state: 'completed' | 'current' | 'locked', lessonProgress: { attempts?: number } | undefined) => {
      if (isFreeLocked(unitIndex)) {
        // Free-tier paywall
        setJumpModal({ kind: 'free-upgrade', unitIndex });
      } else if (state === 'locked') {
        if (isGuest && !isUnitUnlocked(LIMITS.free.unlockedUnits, unitIndex)) {
          setJumpModal({ kind: 'guest-signup', unitIndex });
        } else {
          // Check if the unit itself has any accessible lessons
          const unitHasAccessible = courseData[unitIndex].lessons.some(
            (_, li) => isLessonUnlocked(unitIndex, li),
          );
          if (unitHasAccessible) {
            // Locked lesson inside the user's active unit → must progress sequentially
            setJumpModal({ kind: 'within-unit', unitIndex, lessonIndex });
          } else {
            // Unit not yet reached → offer placement test
            setJumpModal({ kind: 'placement-test', unitIndex });
          }
        }
      } else {
        // Block lesson start if out of hearts
        if (!hasHearts()) {
          setShowOutOfHearts(true);
          return;
        }
        if (state === 'completed' && lessonProgress) {
          const lesson = courseData[unitIndex].lessons[lessonIndex];
          const maxLevels = lesson.levels ?? 1;
          const isGoldenEligible = maxLevels > 1 && (lessonProgress.attempts ?? 0) >= maxLevels - 1;
          startLesson(unitIndex, lessonIndex, isGoldenEligible);
        } else {
          startLesson(unitIndex, lessonIndex);
        }
      }
    },
    [isFreeLocked, isGuest, courseData, isLessonUnlocked, startLesson, hasHearts]
  );

  // Check for ?unit= query param (navigated from /units page)
  const scrollToUnitParam = searchParams.get('unit');
  const scrollToUnitIndex = scrollToUnitParam != null ? parseInt(scrollToUnitParam, 10) : null;

  // Switch to the correct section when navigating via ?unit= param
  useEffect(() => {
    if (scrollToUnitIndex == null || isNaN(scrollToUnitIndex)) return;
    const targetSectionPos = sections.findIndex((s) =>
      s.units.some((u) => u.globalIndex === scrollToUnitIndex)
    );
    if (targetSectionPos >= 0 && targetSectionPos !== viewingSectionPos) {
      setViewingSectionPos(targetSectionPos);
    }
  }, [scrollToUnitIndex, sections, viewingSectionPos]);

  // Auto-scroll to the target unit (from ?unit= param) or current lesson after mount
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    function tryScroll() {
      if (cancelled) return;
      attempts++;

      // If navigated from /units page, scroll to that specific unit
      if (scrollToUnitIndex != null && !isNaN(scrollToUnitIndex)) {
        const unitEl = unitElsRef.current[scrollToUnitIndex];
        if (unitEl && unitEl.getBoundingClientRect().height > 0) {
          unitEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Clean up the URL param
          router.replace('/', { scroll: false });
          return;
        }
      } else {
        const target = currentLessonRef.current || currentUnitRef.current;
        if (target && target.getBoundingClientRect().height > 0) {
          target.scrollIntoView({ behavior: 'instant', block: 'center' });
          return;
        }
      }

      if (attempts < 10) {
        requestAnimationFrame(tryScroll);
      }
    }

    // Wait for initial render + CSS animations to start
    const timer = setTimeout(tryScroll, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToUnitIndex]);

  // Scroll handler: position header below CourseHeader and track visible unit
  useEffect(() => {
    let lastIndex = 0;
    let lastTop = 0;
    const handleScroll = () => {
      const courseHeader = document.querySelector('header.sticky');
      let topOffset = courseHeader?.getBoundingClientRect().bottom ?? 0;

      // Banners rendered between the header and the map (streak nudge) push the
      // floating unit header down — otherwise the fixed header covers them.
      document.querySelectorAll('[data-top-chrome]').forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.height > 0) topOffset = Math.max(topOffset, box.bottom);
      });

      if (Math.abs(topOffset - lastTop) > 0.5) {
        lastTop = topOffset;
        setHeaderStyle((prev) => ({ ...prev, top: topOffset }));
      }

      // Track visible unit — the last unit whose element top is above the header
      let newIndex = 0;
      for (let i = 0; i < unitElsRef.current.length; i++) {
        const el = unitElsRef.current[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= topOffset) {
          newIndex = i;
        }
      }

      if (newIndex !== lastIndex) {
        lastIndex = newIndex;
        setVisibleUnitIndex(newIndex);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Top chrome mounts lazily and can be dismissed without a scroll event
    const observer = new ResizeObserver(handleScroll);
    document.querySelectorAll('[data-top-chrome]').forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [courseData.length]);

  // Hinged-sign pendulum physics for the floating header
  useEffect(() => {
    const el = floatingRef.current;
    if (!el) return;

    let prevY = window.scrollY;
    let angVel = 0;
    let angle = 0;
    let noise = 0;           // subtle wind wobble
    let noiseVel = 0;
    let rafId = 0;
    let ticking = false;
    let scrolling = false;
    let scrollTimer = 0;

    const STIFFNESS = 0.15;   // snappier spring
    const DAMPING = 0.90;     // settles faster
    const MAX_ANGLE = 18;
    const SCROLL_FACTOR = 0.25;

    // Wind noise params
    const NOISE_STRENGTH = 0.6;
    const NOISE_DAMPING = 0.94;
    const NOISE_STIFFNESS = 0.05;

    const tick = () => {
      // Main pendulum spring
      angVel += -angle * STIFFNESS;
      angVel *= DAMPING;
      angle += angVel;
      angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angle));

      // Wind noise — random micro-gusts while scrolling
      if (scrolling) {
        noiseVel += (Math.random() - 0.5) * NOISE_STRENGTH;
      }
      noiseVel += -noise * NOISE_STIFFNESS;
      noiseVel *= NOISE_DAMPING;
      noise += noiseVel;

      const total = angle + noise;

      if (Math.abs(total) < 0.08 && Math.abs(angVel) < 0.08 && Math.abs(noiseVel) < 0.05 && !scrolling) {
        angle = 0;
        angVel = 0;
        noise = 0;
        noiseVel = 0;
        el.style.transform = '';
        ticking = false;
        return;
      }

      el.style.transform = `perspective(600px) rotateX(${total.toFixed(2)}deg)`;
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - prevY;
      prevY = y;
      scrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => { scrolling = false; }, 120);

      angVel += Math.max(-4, Math.min(4, delta * SCROLL_FACTOR));

      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Compute 1-based display number (per-section) for a global unit index
  const getDisplayNumber = useCallback((globalIndex: number) => {
    for (const section of sections) {
      const localIdx = section.units.findIndex(u => u.globalIndex === globalIndex);
      if (localIdx >= 0) return localIdx + 1;
    }
    return globalIndex + 1;
  }, [sections]);

  // Derive floating header data from visibleUnitIndex
  const floatingUnit = courseData[visibleUnitIndex];
  const floatingTheme = getUnitTheme(visibleUnitIndex);
  const floatingCompleted = floatingUnit?.lessons.filter(
    (l) => progress.completedLessons[l.id]?.passed
  ).length ?? 0;
  const floatingAllGolden = floatingUnit && floatingCompleted === floatingUnit.lessons.length &&
    floatingUnit.lessons.every((l) => progress.completedLessons[l.id]?.golden);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
      style={{
        paddingBottom: 40,
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Content load error toast */}
      {contentLoadError && (
        <div className="sticky top-0 z-50 mx-4 mt-2">
          <ErrorRetry
            title={contentLoadError}
            subtitle="Tap Retry to try loading again."
            onRetry={dismissContentLoadError}
            card
          />
        </div>
      )}

      {/* Always-visible floating unit header — updates as you scroll past units */}
      {floatingUnit && (
        <UnitHeroHeader
          ref={floatingRef}
          unit={floatingUnit}
          unitIndex={visibleUnitIndex}
          displayNumber={getDisplayNumber(visibleUnitIndex)}
          completedInUnit={floatingCompleted}
          totalInUnit={floatingUnit.lessons.length}
          isAllGolden={!!floatingAllGolden}
          theme={floatingTheme}
          hasSections={hasSections}
          sectionIndex={currentSection.sectionIndex}
          positionStyle={headerStyle}
          onBrowseClick={() => router.push('/units')}
        />
      )}

      {/* Compact floating XP-event bar below unit header */}
      <ActiveEventBanner positionStyle={headerStyle} />

      {/* Units container */}
      <div
        className="flex flex-col px-3 sm:px-4 mx-auto"
        style={{ paddingTop: HERO_COMPACT_HEIGHT + 16, paddingBottom: 0, gap: 0, maxWidth: 520 }}
      >
        {currentSection.units.map(({ unit, globalIndex: unitIndex }, localIdx) => {
          const theme = getUnitTheme(unitIndex);
          const completedInUnit = unit.lessons.filter(
            (l) => progress.completedLessons[l.id]?.passed
          ).length;
          const isActive = unitIndex === activeUnitIndex;
          const isGuestLocked = isGuest && !isUnitUnlocked(LIMITS.free.unlockedUnits, unitIndex);
          const isProLocked = isFreeLocked(unitIndex);
          const isUnitLocked = isGuestLocked || isProLocked;
          const isAllGolden = completedInUnit === unit.lessons.length &&
            unit.lessons.every((l) => progress.completedLessons[l.id]?.golden);

          return (
            <motion.div
              key={unit.id}
              ref={(el) => {
                unitElsRef.current[unitIndex] = el;
                if (isActive && currentUnitRef) currentUnitRef.current = el;
              }}
              data-unit-index={unitIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: Math.min(localIdx * 0.1, 0.5), duration: 0.5 }}
            >
              {/* Inline unit label */}
              <div
                style={{
                  marginTop: localIdx > 0 ? 24 : 0,
                  marginBottom: 8,
                  paddingLeft: 4,
                  opacity: isUnitLocked ? 0.45 : 1,
                }}
              >
                <div style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 1.1,
                  color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
                }}>
                  {hasSections ? `Section ${currentSection.sectionIndex}, Unit ${getDisplayNumber(unitIndex)}` : `Unit ${getDisplayNumber(unitIndex)}`}
                </div>
                <div className="truncate" style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: isAllGolden ? GOLD : (isDark ? '#E2E8F0' : '#1A1A1A'),
                  lineHeight: 1.3,
                  marginTop: 2,
                }}>
                  {unit.title}
                </div>
              </div>

              {/* "Jump here" button for placement-test-eligible locked units */}
              {isUnitJumpable(unitIndex) && (
                <JumpHereButton
                  theme={theme}
                  onClick={() => {
                    setJumpModal({ kind: 'placement-test', unitIndex });
                  }}
                />
              )}

              {/* Lesson list */}
              <div
                className="flex flex-col"
                style={{ paddingTop: 4, gap: 6 }}
              >
                {unit.lessons.map((lesson, lessonIndex) => {
                  const state = getLessonState(unitIndex, lessonIndex);
                  const lessonProgress =
                    progress.completedLessons[lesson.id];

                  return (
                    <div
                      key={lesson.id}
                      ref={lesson.id === currentLessonId ? currentLessonRef : undefined}
                      {...(lesson.id === currentLessonId ? { 'data-current-lesson': '' } : {})}
                    >
                      <LessonNode
                        lesson={lesson}
                        unitColor={theme.color}
                        state={state}
                        stars={lessonProgress?.stars}
                        golden={lessonProgress?.golden}
                        needsReview={reviewLessonIds.has(lesson.id)}
                        index={lessonIndex}
                        onClick={() => handleLessonClick(unitIndex, lessonIndex, state, lessonProgress)}
                        theme={theme}
                      />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* "Up Next" section card or Course completion marker */}
        {nextSection ? (() => {
          const nextTheme = getUnitTheme(nextSection.units[0]?.globalIndex ?? 0);
          const nextFirstUnit = nextSection.units[0]?.globalIndex ?? 0;
          const nextIsLocked = !isGuest && !isProUser && !isUnitUnlocked(LIMITS.free.unlockedUnits, nextFirstUnit);
          const nextIsGuestLocked = isGuest && !isUnitUnlocked(LIMITS.free.unlockedUnits, nextFirstUnit);

          return (
            <div
              style={{
                marginTop: 32,
                border: isDark ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.08)',
                borderRadius: 20,
                padding: '28px 20px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
                border: isDark ? '1.5px solid rgba(255,255,255,0.15)' : '1.5px solid rgba(0,0,0,0.1)',
                borderRadius: 8,
                padding: '4px 12px',
                marginBottom: 16,
              }}>
                Up Next
              </div>
              <div className="flex items-center justify-center" style={{ gap: 8, marginBottom: 6 }}>
                {(nextIsLocked || nextIsGuestLocked) && (
                  <Lock style={{ width: 18, height: 18, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }} />
                )}
                <span style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#E0E0E0' : '#1A1A1A' }}>
                  Section {nextSection.sectionIndex}
                </span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', marginBottom: 20 }}>
                {nextSection.sectionTitle}
              </p>
              <button
                className="active:scale-[0.98] transition-transform"
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 800,
                  color: nextTheme.color,
                  background: 'transparent',
                  border: `2px solid ${nextTheme.color}`,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onClick={() => {
                  if (nextIsGuestLocked) {
                    setJumpModal({ kind: 'guest-signup', unitIndex: nextFirstUnit });
                  } else if (nextIsLocked) {
                    setJumpModal({ kind: 'free-upgrade', unitIndex: nextFirstUnit });
                  } else {
                    setViewingSectionPos(viewingSectionPos + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                {nextIsGuestLocked ? 'Sign up to continue' : nextIsLocked ? 'Upgrade to unlock' : 'Jump here?'}
              </button>
            </div>
          );
        })() : (
          <div
            className="flex flex-col items-center"
            style={{ padding: '32px 16px' }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: isDark ? '#3D3200' : '#FFF5D4',
                fontSize: 24,
                marginBottom: 12,
              }}
            >
              🏆
            </div>
            <p style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#E0E0E0' : '#3C3C3C' }}>
              Course Complete!
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#AFAFAF', marginTop: 2 }}>
              You&apos;re ready for your interview
            </p>
          </div>
        )}
      </div>

      {/* Jump / placement-test / sign-up modal */}
      <JumpModals
        jumpModal={jumpModal}
        setJumpModal={setJumpModal}
        courseData={courseData}
        getDisplayNumber={getDisplayNumber}
        startPlacementTest={startPlacementTest}
        debugSkipToUnit={debugSkipToUnit}
        debugSkipToLesson={debugSkipToLesson}
        onUpgrade={() => setShowUpgradeModal(true)}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="Unlock all 10 course units"
      />

      <OutOfHeartsModal
        isOpen={showOutOfHearts}
        onClose={() => setShowOutOfHearts(false)}
      />

      {/* Fixed scroll-to-current button — bottom-right, above mobile nav */}
      <AnimatePresence mode="popLayout">
        {scrollDirection && (
          <ScrollToCurrentButton direction={scrollDirection} targetRef={currentLessonRef} />
        )}
      </AnimatePresence>
    </div>
  );
}
