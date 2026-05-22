'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProfessionPicker } from '@/components/profession/ProfessionPicker';
import { PROFESSION_ID } from '@/data/professions';
import { Mascot } from '@/components/ui/Mascot';

interface Props {
  selectedProfession: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
  direction: number;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export function GetStartedStep0Profession({ selectedProfession, onSelect, onContinue, direction }: Props) {
  return (
    <motion.div
      key="profession"
      custom={direction}
      variants={slideVariants}
      initial="enter" animate="center" exit="exit"
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="max-w-lg mx-auto w-full"
    >
      {/* Mascot + heading */}
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
            <Mascot pose="winking" size={100} />
          </div>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-1.5">
          What do you want to learn?
        </h2>
        <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base font-semibold">
          Pick a course to get started
        </p>
      </motion.div>

      <ProfessionPicker
        selectedId={selectedProfession}
        onSelect={onSelect}
        filterOut={[PROFESSION_ID.MECHANICAL_ENGINEERING]}
      />

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={onContinue}
          disabled={!selectedProfession}
          className={cn(
            'w-full py-3.5 rounded-2xl font-extrabold text-base transition-all active:translate-y-[2px]',
            selectedProfession ? 'bg-primary-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed'
          )}
          style={{ boxShadow: selectedProfession ? '0 5px 0 #0F766E' : 'none' }}
        >
          CONTINUE
        </button>
      </motion.div>

      <p className="text-center text-surface-500 dark:text-surface-400 text-sm font-semibold mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-500 font-bold">Log in</Link>
      </p>
    </motion.div>
  );
}
