'use client';

import { useEffect, useState } from 'react';

/** Hook: returns 'up' | 'down' | null based on whether targetRef is above/below viewport */
export function useScrollDirection(
  targetRef: React.RefObject<HTMLDivElement | null>,
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>,
) {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    function check() {
      const el = targetRef.current;
      if (!el) { setDirection(null); return; }
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      if (center < 0) setDirection('up');
      else if (center > window.innerHeight) setDirection('down');
      else setDirection(null);
    }

    check();
    const container = scrollContainerRef?.current;
    if (container) {
      container.addEventListener('scroll', check, { passive: true });
    }
    window.addEventListener('scroll', check, { passive: true, capture: true });
    window.addEventListener('resize', check);
    return () => {
      if (container) {
        container.removeEventListener('scroll', check);
      }
      window.removeEventListener('scroll', check, { capture: true });
      window.removeEventListener('resize', check);
    };
  }, [targetRef, scrollContainerRef]);

  return direction;
}
