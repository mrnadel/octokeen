'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLessonColors } from '@/lib/lessonColors';
import { playSound } from '@/lib/sounds';
import { buildRevealAnimation, type RevealTuning } from './shared/reveal-animation';

/** Reveal animation magnitudes for this card. */
const REVEAL_TUNING: RevealTuning = { scalePeak: 1.06, shakeKeyframes: [0, -6, 6, -4, 4, 0], dimOpacity: 0.5, dimScale: 0.97 };

interface TrueFalseQuestionProps {
  correctAnswer: boolean;
  selectedBool: boolean | null;
  answered: boolean;
  localCorrect: boolean | null;
  unitColor: string;
  onSelect: (value: boolean) => void;
}

export function TrueFalseQuestion({
  correctAnswer,
  selectedBool,
  answered,
  localCorrect,
  unitColor,
  onSelect,
}: TrueFalseQuestionProps) {
  const c = useLessonColors();

  return (
    <div className="grid grid-cols-2" style={{ gap: 10 }}>
      {([true, false] as const).map((value, idx) => {
        const isSelected = selectedBool === value;
        const isCorrectOption = value === correctAnswer;

        let bg = c.cardBg;
        let border = `2px solid ${c.border}`;
        let textColor = c.title;
        let shadow = '0 3px 0 #DCDCDC';

        if (answered && localCorrect !== null) {
          if (isCorrectOption) {
            bg = '#D7FFB8';
            border = '2px solid #58CC02';
            textColor = '#58A700';
            shadow = '0 0 12px rgba(88, 204, 2, 0.25)';
          } else if (isSelected && !isCorrectOption) {
            bg = '#FFDFE0';
            border = '2px solid #FF4B4B';
            textColor = '#EA2B2B';
            shadow = 'none';
          } else {
            bg = '#F5F5F5';
            border = '2px solid #EFEFEF';
            textColor = c.muted;
            shadow = 'none';
          }
        } else if (isSelected) {
          bg = c.cardBg;
          border = `2.5px solid ${unitColor}`;
          shadow = `0 3px 0 color-mix(in srgb, ${unitColor} 65%, black)`;
        }

        const revealAnimation = buildRevealAnimation(
          { revealed: answered && localCorrect !== null, isCorrectOption, isSelected },
          REVEAL_TUNING,
        );

        return (
          <motion.button
            key={String(value)}
            onClick={() => {
              if (!answered) {
                playSound('tap');
                onSelect(value);
              }
            }}
            disabled={answered}
            aria-label={`${value ? 'True' : 'False'}${
              answered && localCorrect !== null
                ? isCorrectOption
                  ? ' — correct'
                  : isSelected && !isCorrectOption
                    ? ' — incorrect'
                    : ''
                : ''
            }`}
            initial={{ opacity: 0, y: 14 }}
            animate={revealAnimation}
            transition={
              answered && localCorrect !== null
                ? { type: 'tween', duration: 0.35 }
                : { delay: idx * 0.08, type: 'spring', stiffness: 400, damping: 25 }
            }
            whileTap={
              !answered
                ? { y: 3, boxShadow: '0 0 0 transparent', transition: { duration: 0.06 } }
                : undefined
            }
            className="flex items-center justify-center"
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: bg,
              border,
              cursor: answered ? 'default' : 'pointer',
              fontSize: 16,
              fontWeight: 800,
              color: textColor,
              transition: 'background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease',
              boxShadow: shadow,
              gap: 6,
            }}
          >
            {answered && localCorrect !== null && isCorrectOption && (
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            )}
            {answered && localCorrect !== null && isSelected && !isCorrectOption && (
              <X className="w-3.5 h-3.5" strokeWidth={3} />
            )}
            {value ? 'True' : 'False'}
          </motion.button>
        );
      })}
    </div>
  );
}
