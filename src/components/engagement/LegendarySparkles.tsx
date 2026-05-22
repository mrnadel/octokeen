'use client';

import { motion } from 'framer-motion';

interface LegendarySparklesProps {
  isDark: boolean;
}

export function LegendarySparkles({ isDark }: LegendarySparklesProps) {
  const color = isDark ? 'rgba(254,243,199,0.6)' : 'rgba(120,53,15,0.25)';
  const sparkles = [
    { left: '88%', top: '10%', delay: 0, size: 10 },
    { left: '78%', top: '75%', delay: 1.2, size: 8 },
    { left: '18%', top: '8%', delay: 0.6, size: 7 },
    { left: '93%', top: '48%', delay: 1.8, size: 9 },
    { left: '50%', top: '5%', delay: 0.3, size: 6 },
  ];

  return (
    <>
      {sparkles.map((s, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ left: s.left, top: s.top, fontSize: s.size, color, lineHeight: 1 }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.7, 1.1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>
      ))}
    </>
  );
}
