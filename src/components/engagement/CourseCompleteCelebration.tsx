'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourseStore } from '@/store/useCourseStore';
import { getUnitTheme } from '@/lib/unitThemes';
import { useBackHandler } from '@/hooks/useBackHandler';
import { GameButton } from '@/components/ui/GameButton';
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { MascotWithGlow } from '@/components/ui/MascotWithGlow';

interface Props {
  onDismiss: () => void;
}

export function CourseCompleteCelebration({ onDismiss }: Props) {
  const [canDismiss, setCanDismiss] = useState(false);
  const courseData = useCourseStore((s) => s.courseData);

  useEffect(() => {
    const t = setTimeout(() => setCanDismiss(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useBackHandler(true, () => { if (canDismiss) onDismiss(); });

  const handleDismiss = useCallback(() => {
    if (canDismiss) onDismiss();
  }, [canDismiss, onDismiss]);

  // Unit color dots
  const unitColors = Array.from({ length: 10 }, (_, i) => ({
    color: getUnitTheme(i).color,
    title: courseData[i]?.title ?? `Unit ${i + 1}`,
  }));

  return (
    <AnimatePresence>
      <motion.div
        key="course-complete"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex flex-col"
        style={{ background: '#5B4FCF' }}
      >
        <FloatingParticles color="rgba(255,255,255,0.06)" intensity="celebration" />

        {/* Content — upper area */}
        <div className="flex-1 flex flex-col items-center sm:flex-initial relative z-[1] px-6 pt-[10vh] sm:pt-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-extrabold tracking-[3px] uppercase text-white/50 mb-2"
          >
            Course Complete
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[28px] font-black text-white mb-1"
          >
            The full machine.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-white/50 font-semibold mb-6"
          >
            Every system you mastered.
          </motion.p>

          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
            className="mb-6"
          >
            <MascotWithGlow pose="celebrating" size={180} />
          </motion.div>

          {/* Unit color dots */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-1.5 mb-2"
          >
            {unitColors.map((u, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full"
                style={{ background: u.color }}
              />
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs text-white/40 font-semibold"
          >
            10 units completed
          </motion.p>
        </div>

        {/* Footer — pinned bottom */}
        <div className="shrink-0 px-6 pb-8 sm:pb-6 relative z-[1]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: canDismiss ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <GameButton variant="gold" onClick={handleDismiss}>
              CONTINUE
            </GameButton>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
