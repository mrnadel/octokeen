'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProfessionPicker } from '@/components/profession/ProfessionPicker';
import { PROFESSION_ID } from '@/data/professions';

import { slideVariants, slideTransition } from './getStartedAnimation';
import { GetStartedStepHeading } from './GetStartedStepHeading';

interface Props {
  selectedProfession: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
  direction: number;
}


export function GetStartedStep0Profession({ selectedProfession, onSelect, onContinue, direction }: Props) {
  return (
    <motion.div
      key="profession"
      custom={direction}
      variants={slideVariants}
      initial="enter" animate="center" exit="exit"
      transition={slideTransition}
      className="max-w-lg mx-auto w-full"
    >
      <GetStartedStepHeading
        pose="winking"
        mascotSize={100}
        title="What do you want to learn?"
        subtitle="Pick a course to get started"
      />

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
