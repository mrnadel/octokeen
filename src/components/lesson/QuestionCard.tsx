'use client';

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { motion } from 'framer-motion';
import type { CourseQuestion } from '@/data/course/types';
import { GlossaryText } from '@/components/ui/GlossaryText';
import { playSound } from '@/lib/sounds';
import { useLessonColors } from '@/lib/lessonColors';
import DiagramDisplay from './DiagramDisplay';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { FillBlankQuestion } from './FillBlankQuestion';

export interface QuestionCardHandle {
  check: () => void;
  hasSelection: boolean;
  selectOption: (index: number) => void;
  selectBool: (value: boolean) => void;
  selectWord: (index: number) => void;
  questionType: string;
  availableWordCount: number;
}

interface QuestionCardProps {
  question: CourseQuestion;
  onAnswer: (correct: boolean, selectedOriginalIndex?: number) => void;
  onSelectionChange: (hasSelection: boolean) => void;
  answered: boolean;
  unitColor: string;
}

const QuestionCard = forwardRef<QuestionCardHandle, QuestionCardProps>(
  function QuestionCard({ question, onAnswer, onSelectionChange, answered, unitColor }, ref) {
    const c = useLessonColors();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
    const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>([]);
    const [localCorrect, setLocalCorrect] = useState<boolean | null>(null);
    const [activeBlankIdx, setActiveBlankIdx] = useState(0);

    // Shuffle MC option display order so correct answer isn't always A
    const shuffledIndices = useMemo(() => {
      if (question.type !== 'multiple-choice' || !question.options) return [];
      const indices = question.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return indices;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.id]);

    // Shuffle word bank for fill-blank
    const shuffledWordBank = useMemo(() => {
      if (question.type !== 'fill-blank' || !question.wordBank) return [];
      const words = [...question.wordBank];
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
      return words;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.id]);

    // Split question text into parts around _____ for fill-blank rendering
    const questionParts = useMemo(() => {
      if (question.type !== 'fill-blank') return [];
      return question.question.split('_____');
    }, [question.type, question.question]);

    const blankCount = useMemo(() => {
      if (question.type !== 'fill-blank') return 0;
      return question.blanks?.length ?? 1;
    }, [question.type, question.blanks]);

    useEffect(() => {
      setSelectedIndex(null);
      setSelectedBool(null);
      setFilledBlanks(new Array(question.blanks?.length ?? 1).fill(null));
      setLocalCorrect(null);
      setActiveBlankIdx(0);
    }, [question.id, question.blanks?.length]);

    const hasSelection = (() => {
      switch (question.type) {
        case 'multiple-choice':
          return selectedIndex !== null;
        case 'true-false':
          return selectedBool !== null;
        case 'fill-blank':
          return filledBlanks.length > 0 && filledBlanks.every((b) => b !== null);
        default:
          return false;
      }
    })();

    useEffect(() => {
      onSelectionChange(hasSelection);
    }, [hasSelection, onSelectionChange]);

    const handleCheck = useCallback(() => {
      if (answered || !hasSelection) return;

      let correct = false;
      switch (question.type) {
        case 'multiple-choice':
          correct = selectedIndex !== null && shuffledIndices[selectedIndex] === question.correctIndex;
          break;
        case 'true-false':
          correct = selectedBool === question.correctAnswer;
          break;
        case 'fill-blank': {
          if (question.blanks) {
            correct = question.blanks.every(
              (b, i) => filledBlanks[i]?.toLowerCase() === b.toLowerCase()
            );
          }
          break;
        }
      }

      // Compute original (pre-shuffle) index for distractor tracking
      let originalIndex: number | undefined;
      if (question.type === 'multiple-choice' && selectedIndex !== null) {
        originalIndex = shuffledIndices[selectedIndex];
      } else if (question.type === 'true-false' && selectedBool !== null) {
        originalIndex = selectedBool ? 0 : 1; // true=0, false=1
      }

      setLocalCorrect(correct);
      playSound(correct ? 'correct' : 'wrong');
      onAnswer(correct, originalIndex);
    }, [answered, hasSelection, question, selectedIndex, selectedBool, filledBlanks, shuffledIndices, onAnswer]);

    const handleWordTap = useCallback((word: string) => {
      if (answered) return;
      playSound('tap');
      let nextActive = 0;
      setFilledBlanks((prev) => {
        const next = [...prev];
        // Prefer first empty blank; if all filled, replace active blank
        const emptyIdx = next.findIndex((b) => b === null);
        const targetIdx = emptyIdx !== -1 ? emptyIdx : activeBlankIdx;
        next[targetIdx] = word;
        // Advance active to next blank (wrapping)
        nextActive = (targetIdx + 1) % next.length;
        return next;
      });
      // React 18+ batches both updates into a single render
      setActiveBlankIdx(nextActive);
    }, [answered, activeBlankIdx]);

    const handleBlankTap = useCallback((blankIdx: number) => {
      if (answered) return;
      setActiveBlankIdx(blankIdx);
      setFilledBlanks((prev) => {
        const next = [...prev];
        next[blankIdx] = null;
        return next;
      });
    }, [answered]);

    // Words already placed in blanks (for hiding from word bank)
    const usedWords = useMemo(() => {
      const used: Record<string, number> = {};
      for (const word of filledBlanks) {
        if (word) used[word] = (used[word] || 0) + 1;
      }
      return used;
    }, [filledBlanks]);

    // Available words in word bank (not yet placed)
    const availableWords = useMemo(() => {
      const remaining = [...shuffledWordBank];
      const usedCopy = { ...usedWords };
      return remaining.map((word) => {
        if (usedCopy[word] && usedCopy[word] > 0) {
          usedCopy[word]--;
          return { word, available: false };
        }
        return { word, available: true };
      });
    }, [shuffledWordBank, usedWords]);

    useImperativeHandle(
      ref,
      () => ({
        check: handleCheck,
        hasSelection,
        selectOption: (index: number) => {
          if (!answered && question.type === 'multiple-choice' && question.options && index < question.options.length) {
            setSelectedIndex(index);
          }
        },
        selectBool: (value: boolean) => {
          if (!answered && question.type === 'true-false') {
            setSelectedBool(value);
          }
        },
        selectWord: (index: number) => {
          if (!answered && question.type === 'fill-blank') {
            const item = availableWords[index];
            if (item) {
              // Allow selecting even if word is "used" — it will replace the active blank
              handleWordTap(item.word);
            }
          }
        },
        questionType: question.type,
        availableWordCount: availableWords.length,
      }),
      [handleCheck, hasSelection, answered, question, availableWords, handleWordTap]
    );

    return (
      <div className="question-card flex flex-col flex-1" style={{ minHeight: '100%' }}>
        {/* Question content - top area */}
        <div className="flex flex-col" style={{ gap: 12 }}>
          {/* Action title */}
          <div style={{ fontSize: 12, fontWeight: 800, color: c.subtitle, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            {question.type === 'multiple-choice' ? 'Choose the correct answer'
              : question.type === 'true-false' ? 'True or false?'
              : 'Fill in the blank'}
          </div>

          {/* Diagram */}
          {question.diagram && <DiagramDisplay html={question.diagram} />}

          {/* Question text */}
          {question.type !== 'fill-blank' && (
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: c.title,
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              <GlossaryText text={question.question} />
            </h2>
          )}

          {/* Hint */}
          {question.hint && !answered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: c.hintBg,
                border: '1.5px solid #FFE4B8',
                fontSize: 13,
                fontWeight: 600,
                color: c.hintColor,
                lineHeight: 1.4,
              }}
            >
              <GlossaryText text={question.hint} />
            </motion.div>
          )}
        </div>

        {/* Answer options - pushed to bottom */}
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>

          {/* Multiple Choice */}
          {question.type === 'multiple-choice' && question.options && (
            <MultipleChoiceQuestion
              options={question.options}
              shuffledIndices={shuffledIndices}
              correctIndex={question.correctIndex!}
              selectedIndex={selectedIndex}
              answered={answered}
              localCorrect={localCorrect}
              unitColor={unitColor}
              onSelect={setSelectedIndex}
            />
          )}

          {/* True / False */}
          {question.type === 'true-false' && (
            <TrueFalseQuestion
              correctAnswer={question.correctAnswer!}
              selectedBool={selectedBool}
              answered={answered}
              localCorrect={localCorrect}
              unitColor={unitColor}
              onSelect={setSelectedBool}
            />
          )}

          {/* Fill in the Blank */}
          {question.type === 'fill-blank' && question.blanks && question.wordBank && (
            <FillBlankQuestion
              questionParts={questionParts}
              blanks={question.blanks}
              blankCount={blankCount}
              filledBlanks={filledBlanks}
              activeBlankIdx={activeBlankIdx}
              availableWords={availableWords}
              answered={answered}
              localCorrect={localCorrect}
              unitColor={unitColor}
              onBlankTap={handleBlankTap}
              onWordTap={handleWordTap}
            />
          )}

        </div>
      </div>
    );
  }
);

export default QuestionCard;
