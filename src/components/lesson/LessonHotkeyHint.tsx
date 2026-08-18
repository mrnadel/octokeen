'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { QuestionType } from '@/data/course/types';
import { useLessonColors } from '@/lib/lessonColors';

const HINT_ENTER = { opacity: 0, y: -4 } as const;
const HINT_SETTLED = { opacity: 1, y: 0 } as const;
const HINT_EXIT = { opacity: 0 } as const;

/** Per-question-type prefix listing the keys that pick an answer. */
const SELECT_HINTS: Partial<Record<QuestionType, string>> = {
  'multiple-choice': 'A–D select · ',
  'true-false': '1/2 or T/F select · ',
  'fill-blank': '1–9 select word · ',
};

export interface LessonHotkeyHintProps {
  show: boolean;
  isTeaching: boolean;
  questionType?: QuestionType;
}

/** Transient keyboard-shortcut hint shown at the top of the question area on pointer devices. */
export function LessonHotkeyHint({ show, isTeaching, questionType }: LessonHotkeyHintProps) {
  const c = useLessonColors();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={HINT_ENTER}
          animate={HINT_SETTLED}
          exit={HINT_EXIT}
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.muted,
            textAlign: 'center',
            marginBottom: 10,
            letterSpacing: 0.3,
            flexShrink: 0,
          }}
        >
          {isTeaching
            ? 'Enter continue · Esc exit'
            : `${(questionType && SELECT_HINTS[questionType]) ?? ''}Enter check · Esc exit`}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
