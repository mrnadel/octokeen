'use client';

import { useEffect, useRef, useState } from 'react';

export interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to stagger this block behind the one above it. */
  delay?: number;
}

/**
 * Scroll-triggered fade-in. The children are whatever the server passed in, so
 * the copy is in the initial HTML even though the reveal is client-driven.
 */
export function AnimateIn({ children, className = '', delay = 0 }: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}
