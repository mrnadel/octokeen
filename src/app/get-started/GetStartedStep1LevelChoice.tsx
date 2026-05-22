'use client';

import { motion } from 'framer-motion';
import { getProfession } from '@/data/professions';
import { Mascot } from '@/components/ui/Mascot';

interface Props {
  selectedProfession: string;
  onNewUser: () => void;
  onLevelChoice: (startFraction: number) => void;
  direction: number;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export function GetStartedStep1LevelChoice({ selectedProfession, onNewUser, onLevelChoice, direction }: Props) {
  return (
    <motion.div
      key="know-some"
      custom={direction}
      variants={slideVariants}
      initial="enter" animate="center" exit="exit"
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="max-w-lg mx-auto w-full"
    >
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="flex justify-center mb-3"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
        >
          <div className="relative">
            <div className="absolute inset-0 scale-150 rounded-full bg-primary-400/10 dark:bg-primary-500/10 blur-2xl" />
            <Mascot pose="thinking" size={100} />
          </div>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-1.5">
          Already know some {getProfession(selectedProfession)?.name ?? 'of this'}?
        </h2>
        <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base font-semibold">
          Take a quick test to find your starting level, or begin from scratch.
        </p>
      </motion.div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { emoji: '🌱', label: "I'm new to this", desc: 'Start from the basics', action: () => onNewUser() },
          { emoji: '💡', label: 'I know a little', desc: 'Test me on the early stuff', action: () => onLevelChoice(0) },
          { emoji: '📚', label: 'I know a fair amount', desc: 'Test me on intermediate topics', action: () => onLevelChoice(0.3) },
          { emoji: '🎯', label: 'I know a lot', desc: 'Challenge me with advanced topics', action: () => onLevelChoice(0.6) },
        ].map((opt, i) => (
          <motion.button
            key={opt.label}
            onClick={opt.action}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-2xl border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/30 dark:hover:bg-primary-950/30 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800 text-2xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 transition-colors">
                {opt.emoji}
              </span>
              <div>
                <p className="text-base font-black text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {opt.label}
                </p>
                <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-0.5">
                  {opt.desc}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
