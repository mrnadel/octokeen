'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLessonColors } from '@/lib/lessonColors';
import { playSound } from '@/lib/sounds';
import { buildRevealAnimation, type RevealTuning } from './shared/reveal-animation';

/** Reveal animation magnitudes for this card. */
const REVEAL_TUNING: RevealTuning = { scalePeak: 1.04, shakeKeyframes: [0, -8, 8, -5, 5, 0], dimOpacity: 0.5, dimScale: 0.98 };

interface MultipleChoiceQuestionProps {
  options: string[];
  shuffledIndices: number[];
  correctIndex: number;
  selectedIndex: number | null;
  answered: boolean;
  localCorrect: boolean | null;
  unitColor: string;
  onSelect: (displayIndex: number) => void;
}

export function MultipleChoiceQuestion({
  options,
  shuffledIndices,
  correctIndex,
  selectedIndex,
  answered,
  localCorrect,
  unitColor,
  onSelect,
}: MultipleChoiceQuestionProps) {
  const c = useLessonColors();

  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {shuffledIndices.map((originalIndex, displayIndex) => {
        const option = options[originalIndex];
        const isSelected = selectedIndex === displayIndex;
        const isCorrectOption = originalIndex === correctIndex;

        let bg = c.cardBg;
        let border = `2px solid ${c.border}`;
        let textColor = c.title;
        let badgeBg = c.emptyBg;
        let badgeColor = c.subtitle;
        let shadow = '0 3px 0 #DCDCDC';

        if (answered && localCorrect !== null) {
          if (isCorrectOption) {
            bg = '#D7FFB8';
            border = '2px solid #58CC02';
            textColor = '#58A700';
            badgeBg = '#58CC02';
            badgeColor = 'white';
            shadow = '0 0 12px rgba(88, 204, 2, 0.25)';
          } else if (isSelected && !isCorrectOption) {
            bg = '#FFDFE0';
            border = '2px solid #FF4B4B';
            textColor = '#EA2B2B';
            badgeBg = '#FF4B4B';
            badgeColor = 'white';
            shadow = 'none';
          } else {
            bg = '#F5F5F5';
            border = '2px solid #EFEFEF';
            textColor = c.muted;
            badgeBg = '#E5E5E5';
            badgeColor = c.muted;
            shadow = 'none';
          }
        } else if (isSelected) {
          bg = c.cardBg;
          border = `2px solid ${unitColor}`;
          badgeBg = unitColor;
          badgeColor = 'white';
          shadow = `0 3px 0 color-mix(in srgb, ${unitColor} 65%, black), inset 0 0 0 1px ${unitColor}`;
        }

        const revealAnimation = buildRevealAnimation(
          { revealed: answered && localCorrect !== null, isCorrectOption, isSelected },
          REVEAL_TUNING,
        );

        return (
          <motion.button
            key={originalIndex}
            onClick={() => {
              if (!answered) {
                playSound('tap');
                onSelect(displayIndex);
              }
            }}
            disabled={answered}
            aria-label={`Option ${String.fromCharCode(65 + displayIndex)}: ${option}${
              answered && localCorrect !== null
                ? isCorrectOption
                  ? ' — correct'
                  : isSelected && !isCorrectOption
                    ? ' — incorrect'
                    : ''
                : ''
            }`}
            initial={{ opacity: 0, y: 16 }}
            animate={revealAnimation}
            transition={
              answered && localCorrect !== null
                ? { duration: 0.35 }
                : { delay: displayIndex * 0.06, type: 'spring', stiffness: 400, damping: 25 }
            }
            whileTap={
              !answered
                ? { y: 3, boxShadow: '0 0 0 transparent', transition: { duration: 0.06 } }
                : undefined
            }
            className="w-full text-left flex items-center"
            style={{
              padding: '10px 14px',
              borderRadius: 14,
              background: bg,
              border,
              gap: 12,
              cursor: answered ? 'default' : 'pointer',
              transition: 'background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease',
              boxShadow: shadow,
            }}
          >
            <motion.span
              className="flex-shrink-0 flex items-center justify-center"
              animate={isSelected && !answered ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: badgeBg,
                color: badgeColor,
                fontSize: 12,
                fontWeight: 800,
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              {answered && localCorrect !== null && isCorrectOption ? (
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              ) : answered && localCorrect !== null && isSelected && !isCorrectOption ? (
                <X className="w-3.5 h-3.5" strokeWidth={3} />
              ) : (
                String.fromCharCode(65 + displayIndex)
              )}
            </motion.span>
            <span
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.3,
                transition: 'color 0.2s ease',
              }}
            >
              {option}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
