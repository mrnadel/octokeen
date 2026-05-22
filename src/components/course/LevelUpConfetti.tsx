'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export function LevelUpConfetti() {
  const particles = useMemo(() => {
    const colors = ['#A855F7', '#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#F97316'];
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.3,
      size: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 60,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 16 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: p.size > 6 ? 1 : '50%',
            background: p.color,
            rotate: p.rotation,
          }}
          initial={{ y: 0, x: 0, opacity: 1, scale: 0 }}
          animate={{
            y: [0, -80 - Math.random() * 60, 120],
            x: [0, p.drift],
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0.5],
            rotate: p.rotation + 360 + Math.random() * 360,
          }}
          transition={{
            duration: 1.6,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
