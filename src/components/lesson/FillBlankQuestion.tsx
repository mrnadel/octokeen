'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { GlossaryText } from '@/components/ui/GlossaryText';
import { useLessonColors } from '@/lib/lessonColors';
import { playSound } from '@/lib/sounds';
import type { CSSProperties } from 'react';

interface AvailableWord {
  word: string;
  available: boolean;
}

interface FillBlankQuestionProps {
  questionParts: string[];
  blanks: string[];
  blankCount: number;
  filledBlanks: (string | null)[];
  activeBlankIdx: number;
  availableWords: AvailableWord[];
  answered: boolean;
  localCorrect: boolean | null;
  unitColor: string;
  onBlankTap: (blankIdx: number) => void;
  onWordTap: (word: string) => void;
}

export function FillBlankQuestion({
  questionParts,
  blanks,
  blankCount,
  filledBlanks,
  activeBlankIdx,
  availableWords,
  answered,
  localCorrect,
  unitColor,
  onBlankTap,
  onWordTap,
}: FillBlankQuestionProps) {
  const c = useLessonColors();

  function getBlankStyle(i: number): CSSProperties {
    const base: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 80,
      height: 34,
      padding: '2px 14px',
      borderRadius: 10,
      margin: '0 4px',
      verticalAlign: 'middle',
      fontSize: 15,
      fontWeight: 800,
      gap: 4,
      cursor: answered ? 'default' : filledBlanks[i] ? 'pointer' : 'default',
      transition: 'background 0.2s ease, border 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
    };

    if (answered && localCorrect !== null) {
      const isCorrect = filledBlanks[i]?.toLowerCase() === blanks[i]?.toLowerCase();
      return {
        ...base,
        background: isCorrect ? '#D7FFB8' : '#FFDFE0',
        border: isCorrect ? '2px solid #58CC02' : '2px solid #FF4B4B',
        color: isCorrect ? '#58A700' : '#EA2B2B',
      };
    }

    if (filledBlanks[i]) {
      const isActive = i === activeBlankIdx && blankCount > 1;
      return {
        ...base,
        background: c.cardBg,
        border: `2.5px solid ${unitColor}`,
        color: c.title,
        boxShadow: isActive ? `0 0 0 3px ${unitColor}33` : `0 0 0 3px ${unitColor}20`,
      };
    }

    return {
      ...base,
      background: i === activeBlankIdx ? c.emptyActiveBg : c.emptyBg,
      border: i === activeBlankIdx ? `2px dashed ${unitColor}` : `2px dashed ${c.muted}`,
      color: c.muted,
    };
  }

  return (
    <>
      {/* Inline blanks inside question text */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: c.title,
          lineHeight: 2,
          margin: 0,
        }}
      >
        {questionParts.map((part, i) => (
          <span key={i}>
            <GlossaryText text={part} />
            {i < blankCount && (
              <motion.button
                onClick={() => onBlankTap(i)}
                disabled={answered}
                aria-label={`Blank ${i + 1}${filledBlanks[i] ? `: ${filledBlanks[i]}` : ': empty'}${
                  answered && localCorrect !== null
                    ? filledBlanks[i]?.toLowerCase() === blanks[i]?.toLowerCase()
                      ? ' — correct'
                      : ' — incorrect'
                    : ''
                }`}
                whileTap={!answered && filledBlanks[i] ? { scale: 0.92 } : undefined}
                animate={
                  answered && localCorrect !== null
                    ? filledBlanks[i]?.toLowerCase() === blanks[i]?.toLowerCase()
                      ? { scale: [1, 1.1, 1] }
                      : { x: [0, -5, 5, -3, 3, 0] }
                    : filledBlanks[i]
                      ? { scale: [0.9, 1.05, 1] }
                      : {}
                }
                transition={{ duration: 0.3 }}
                style={getBlankStyle(i)}
              >
                {filledBlanks[i] || ' '}
                {answered &&
                  localCorrect !== null &&
                  filledBlanks[i]?.toLowerCase() === blanks[i]?.toLowerCase() && (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  )}
                {answered &&
                  localCorrect !== null &&
                  filledBlanks[i]?.toLowerCase() !== blanks[i]?.toLowerCase() && (
                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                  )}
              </motion.button>
            )}
          </span>
        ))}
      </div>

      {/* Word bank */}
      <div
        className="flex flex-wrap"
        style={{ gap: 8, justifyContent: 'center', marginTop: 'auto', paddingTop: 20 }}
      >
        <AnimatePresence>
          {availableWords.map(({ word, available }, i) => (
            <motion.button
              key={`${word}-${i}`}
              onClick={() => {
                if (available) onWordTap(word);
              }}
              disabled={answered || !available}
              aria-label={`Word: ${word}${available ? '' : ' — already used'}`}
              whileTap={
                !answered && available
                  ? { y: 2, boxShadow: '0 0 0 transparent', transition: { duration: 0.06 } }
                  : undefined
              }
              layout
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{
                opacity: available ? 1 : 0.3,
                scale: available ? 1 : 0.92,
                y: 0,
              }}
              transition={{
                delay: i * 0.04,
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: answered ? 'default' : available ? 'pointer' : 'default',
                transition:
                  'background 0.15s ease, border 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                background: available ? c.cardBg : '#F5F5F5',
                border: available ? `2px solid ${c.border}` : '2px solid #EFEFEF',
                color: available ? c.title : c.muted,
                boxShadow: available ? '0 2px 0 #E0E0E0' : 'none',
              }}
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
