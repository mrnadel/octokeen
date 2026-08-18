'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getProfession } from '@/data/professions';
import { Mascot } from '@/components/ui/Mascot';
import type { Unit } from '@/data/course/types';

import { slideVariants, slideTransition } from './getStartedAnimation';

interface Props {
  selectedProfession: string;
  placedUnitIndex: number;
  placedUnitName: string;
  meta: Unit[];
  navigating: boolean;
  direction: number;
  onComplete: () => void;
}


export function GetStartedStep4Ready({
  selectedProfession,
  placedUnitIndex,
  placedUnitName,
  meta,
  navigating,
  direction,
  onComplete,
}: Props) {
  return (
    <motion.div
      key="ready"
      custom={direction}
      variants={slideVariants}
      initial="enter" animate="center" exit="exit"
      transition={slideTransition}
      className="text-center max-w-sm mx-auto w-full"
    >
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mb-4 flex justify-center">
        <Mascot pose="celebrating" size={140} />
      </motion.div>

      <motion.h2 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        You&apos;re all set!
      </motion.h2>

      {placedUnitIndex > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500/10 dark:bg-primary-500/20 mb-3">
            <span className="text-lg">{meta[placedUnitIndex]?.icon ?? '🎯'}</span>
            <span className="text-base font-black text-primary-600 dark:text-primary-400">
              Unit {placedUnitIndex + 1}{placedUnitName !== `Unit ${placedUnitIndex + 1}` ? `: ${placedUnitName}` : ''}
            </span>
          </div>
          <p className="text-surface-500 dark:text-surface-400 text-sm font-semibold leading-relaxed">
            You placed into Unit {placedUnitIndex + 1}! We skipped {placedUnitIndex} {placedUnitIndex === 1 ? 'unit' : 'units'} based on your test.
          </p>
        </motion.div>
      ) : (
        <motion.p className="text-surface-500 dark:text-surface-400 text-base mb-6 leading-relaxed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Dive in and master {getProfession(selectedProfession)?.name ?? 'your course'}!
        </motion.p>
      )}

      <motion.button
        onClick={onComplete}
        disabled={navigating}
        className="w-full py-4 rounded-2xl bg-primary-500 text-white font-extrabold text-lg transition-all active:translate-y-[2px] disabled:opacity-70 flex items-center justify-center gap-2"
        style={{ boxShadow: navigating ? 'none' : '0 5px 0 #0F766E' }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.98 }}
      >
        {navigating ? <><Loader2 className="w-5 h-5 animate-spin" />Loading your course...</> : 'START LEARNING'}
      </motion.button>
    </motion.div>
  );
}
