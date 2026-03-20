'use client';

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { CourseQuestion } from '@/data/course/types';

export interface QuestionCardHandle {
  check: () => void;
  hasSelection: boolean;
}

interface QuestionCardProps {
  question: CourseQuestion;
  onAnswer: (correct: boolean) => void;
  onSelectionChange: (hasSelection: boolean) => void;
  answered: boolean;
  unitColor: string;
}

const QuestionCard = forwardRef<QuestionCardHandle, QuestionCardProps>(
  function QuestionCard({ question, onAnswer, onSelectionChange, answered, unitColor }, ref) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
    const [textValue, setTextValue] = useState('');
    const [localCorrect, setLocalCorrect] = useState<boolean | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset local state when the question changes
    useEffect(() => {
      setSelectedIndex(null);
      setSelectedBool(null);
      setTextValue('');
      setLocalCorrect(null);
    }, [question.id]);

    // Compute hasSelection
    const hasSelection = (() => {
      switch (question.type) {
        case 'multiple-choice':
          return selectedIndex !== null;
        case 'true-false':
          return selectedBool !== null;
        case 'fill-blank':
          return textValue.trim().length > 0;
        default:
          return false;
      }
    })();

    // Notify parent when selection state changes
    useEffect(() => {
      onSelectionChange(hasSelection);
    }, [hasSelection, onSelectionChange]);

    const handleCheck = useCallback(() => {
      if (answered || !hasSelection) return;

      let correct = false;

      switch (question.type) {
        case 'multiple-choice':
          correct = selectedIndex === question.correctIndex;
          break;
        case 'true-false':
          correct = selectedBool === question.correctAnswer;
          break;
        case 'fill-blank': {
          const trimmed = textValue.trim().toLowerCase();
          correct =
            question.acceptedAnswers?.some(
              (a) => a.toLowerCase() === trimmed
            ) ?? false;
          break;
        }
      }

      setLocalCorrect(correct);
      onAnswer(correct);
    }, [answered, hasSelection, question, selectedIndex, selectedBool, textValue, onAnswer]);

    // Expose check and hasSelection to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        check: handleCheck,
        hasSelection,
      }),
      [handleCheck, hasSelection]
    );

    const getCorrectAnswerDisplay = (): string => {
      switch (question.type) {
        case 'multiple-choice':
          return question.options?.[question.correctIndex ?? 0] ?? '';
        case 'true-false':
          return question.correctAnswer ? 'True' : 'False';
        case 'fill-blank':
          return question.acceptedAnswers?.[0] ?? '';
        default:
          return '';
      }
    };

    // Multiple-choice option styling
    const getOptionStyle = (index: number) => {
      const isSelected = selectedIndex === index;
      const isCorrectOption = index === question.correctIndex;

      if (answered && localCorrect !== null) {
        if (isCorrectOption) {
          return 'bg-green-50 border-green-500 text-green-900';
        }
        if (isSelected && !isCorrectOption) {
          return 'bg-red-50 border-red-500 text-red-900';
        }
        return 'bg-white border-gray-200 text-gray-400';
      }

      if (isSelected) {
        return 'bg-white border-2 shadow-sm text-gray-900';
      }

      return 'bg-white border-gray-200 text-gray-700 active:scale-[0.98]';
    };

    // True/False button styling
    const getTFStyle = (value: boolean) => {
      const isSelected = selectedBool === value;
      const isCorrectOption = value === question.correctAnswer;

      if (answered && localCorrect !== null) {
        if (isCorrectOption) {
          return 'bg-green-50 border-green-500 text-green-900';
        }
        if (isSelected && !isCorrectOption) {
          return 'bg-red-50 border-red-500 text-red-900';
        }
        return 'bg-white border-gray-200 text-gray-400';
      }

      if (isSelected) {
        return 'bg-white border-2 shadow-sm text-gray-900';
      }

      return 'bg-white border-gray-200 text-gray-700 active:scale-[0.98]';
    };

    return (
      <div className="flex flex-col gap-6">
        {/* Question text */}
        <motion.h2
          className="text-lg font-semibold text-gray-900 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {question.question}
        </motion.h2>

        {/* Hint (shown before answering) */}
        {question.hint && !answered && (
          <motion.p
            className="text-sm text-gray-500 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Hint: {question.hint}
          </motion.p>
        )}

        {/* Answer inputs by type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* ── Multiple Choice ── */}
          {question.type === 'multiple-choice' && question.options && (
            <div className="flex flex-col gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !answered && setSelectedIndex(index)}
                  disabled={answered}
                  className={`
                    w-full text-left rounded-xl border py-3 px-4 text-base
                    transition-all duration-150 min-h-[44px]
                    ${getOptionStyle(index)}
                  `}
                  style={
                    selectedIndex === index && !answered
                      ? { borderColor: unitColor }
                      : undefined
                  }
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`
                        flex-shrink-0 w-7 h-7 rounded-full border-2
                        flex items-center justify-center
                        text-sm font-semibold
                        ${
                          answered && localCorrect !== null
                            ? index === question.correctIndex
                              ? 'border-green-500 bg-green-500 text-white'
                              : selectedIndex === index
                                ? 'border-red-500 bg-red-500 text-white'
                                : 'border-gray-300 text-gray-400'
                            : selectedIndex === index
                              ? 'text-white'
                              : 'border-gray-300 text-gray-500'
                        }
                      `}
                      style={
                        selectedIndex === index && !answered
                          ? { borderColor: unitColor, backgroundColor: unitColor }
                          : undefined
                      }
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* ── True / False ── */}
          {question.type === 'true-false' && (
            <div className="grid grid-cols-2 gap-3">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  onClick={() => !answered && setSelectedBool(value)}
                  disabled={answered}
                  className={`
                    rounded-xl border py-4 px-6 text-center text-lg font-semibold
                    transition-all duration-150 min-h-[56px]
                    ${getTFStyle(value)}
                  `}
                  style={
                    selectedBool === value && !answered
                      ? { borderColor: unitColor }
                      : undefined
                  }
                >
                  {value ? 'True' : 'False'}
                </button>
              ))}
            </div>
          )}

          {/* ── Fill in the Blank ── */}
          {question.type === 'fill-blank' && (
            <div>
              <input
                ref={inputRef}
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && hasSelection && !answered) {
                    handleCheck();
                  }
                }}
                disabled={answered}
                placeholder="Type your answer..."
                className={`
                  w-full rounded-xl border-2 py-3 px-4 text-lg
                  outline-none transition-all duration-150 min-h-[52px]
                  ${
                    answered
                      ? localCorrect
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-red-500 bg-red-50 text-red-900'
                      : 'border-gray-300 focus:border-gray-400 bg-white text-gray-900'
                  }
                `}
                style={
                  !answered && textValue.trim().length > 0
                    ? { borderColor: unitColor }
                    : undefined
                }
              />
              {answered && localCorrect === false && (
                <motion.p
                  className="mt-2 text-sm text-red-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Correct answer: {getCorrectAnswerDisplay()}
                </motion.p>
              )}
            </div>
          )}
        </motion.div>

        {/* Feedback card */}
        <AnimatePresence>
          {answered && localCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`
                rounded-xl border-l-4 p-4
                ${localCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                {localCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-800">Not quite</span>
                  </>
                )}
              </div>

              {!localCorrect && question.type !== 'fill-blank' && (
                <p className="text-sm text-red-700 font-medium mb-2">
                  The correct answer was: {getCorrectAnswerDisplay()}
                </p>
              )}

              <p
                className={`text-sm leading-relaxed ${
                  localCorrect ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default QuestionCard;
