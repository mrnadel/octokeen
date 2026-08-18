'use client';

import { motion } from 'framer-motion';
import { getProfession } from '@/data/professions';

import { slideVariants, slideTransition } from './getStartedAnimation';
import { GetStartedStepHeading } from './GetStartedStepHeading';

interface Props {
  selectedProfession: string;
  onNewUser: () => void;
  onLevelChoice: (startFraction: number) => void;
  direction: number;
}


export function GetStartedStep1LevelChoice({ selectedProfession, onNewUser, onLevelChoice, direction }: Props) {
  return (
    <motion.div
      key="know-some"
      custom={direction}
      variants={slideVariants}
      initial="enter" animate="center" exit="exit"
      transition={slideTransition}
      className="max-w-lg mx-auto w-full"
    >
      <GetStartedStepHeading
        pose="thinking"
        mascotSize={100}
        title={`Already know some ${getProfession(selectedProfession)?.name ?? 'of this'}?`}
        subtitle="Take a quick test to find your starting level, or begin from scratch."
      />

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
