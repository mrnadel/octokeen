import { useRef, useEffect } from 'react';

/**
 * Smoothly animates the `--bg-step` CSS custom property on a container element,
 * creating a parallax effect as the lesson progresses through questions.
 *
 * @param containerRef - Ref to the background container element
 * @param stepIndex    - The current step index (question index or answered count)
 */
export function useBackgroundParallax(
  containerRef: React.RefObject<HTMLDivElement | null>,
  stepIndex: number,
) {
  const bgStepAnimRef = useRef<number>(0);
  const bgStepTargetRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Snap to previous target (in case we were mid-animation), then animate to new target
    const from = bgStepTargetRef.current;
    const to = stepIndex;
    bgStepTargetRef.current = to;
    container.style.setProperty('--bg-step', String(from));
    if (from === to) return;
    if (bgStepAnimRef.current) cancelAnimationFrame(bgStepAnimRef.current);
    const duration = 2500;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      container!.style.setProperty('--bg-step', String(from + (to - from) * eased));
      if (t < 1) bgStepAnimRef.current = requestAnimationFrame(tick);
    }
    bgStepAnimRef.current = requestAnimationFrame(tick);
    return () => { if (bgStepAnimRef.current) cancelAnimationFrame(bgStepAnimRef.current); };
  }, [containerRef, stepIndex]);
}
