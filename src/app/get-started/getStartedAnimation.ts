const SLIDE_DISTANCE = 60;

/** Horizontal slide shared by every get-started step, direction-aware. */
export const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE, opacity: 0 }),
};

/** Timing for {@link slideVariants}. */
export const slideTransition = { duration: 0.2, ease: 'easeInOut' } as const;
