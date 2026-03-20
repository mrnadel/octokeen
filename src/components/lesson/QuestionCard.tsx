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
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
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
          return 'bg-green-50 border-green-400 text-green-900 shadow-sm shadow-green-100';
        }
        if (isSelected && !isCorrectOption) {
          return 'bg-red-50 border-red-400 text-red-900 shadow-sm shadow-red-100';
        }
        return 'bg-gray-50 border-gray-200 text-gray-400';
      }

      if (isSelected) {
        return 'bg-white border-2 shadow-md text-gray-900';
      }

      return 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 active:scale-[0.98]';
    };

    // True/False button styling
    const getTFStyle = (value: boolean) => {
      const isSelected = selectedBool === value;
      const isCorrectOption = value === question.correctAnswer;

      if (answered && localCorrect !== null) {
        if (isCorrectOption) {
          return 'bg-green-50 border-green-400 text-green-900 shadow-sm';
        }
        if (isSelected && !isCorrectOption) {
          return 'bg-red-50 border-red-400 text-red-900 shadow-sm';
        }
        return 'bg-gray-50 border-gray-200 text-gray-400';
      }

      if (isSelected) {
        return 'bg-white border-2 shadow-md text-gray-900';
      }

      return 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 active:scale-[0.97]';
    };

    return (
      <div className="flex flex-col gap-5">
        {/* Diagram (if present) */}
        {question.diagram && (
          <motion.div
            className="w-full rounded-2xl bg-white border border-gray-200 p-3 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            dangerouslySetInnerHTML={{ __html: question.diagram }}
          />
        )}

        {/* Question text */}
        <motion.h2
          className="text-lg font-bold text-gray-900 leading-snug"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {question.question}
        </motion.h2>

        {/* Hint (shown before answering) */}
        {question.hint && !answered && (
          <motion.div
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium">{question.hint}</p>
          </motion.div>
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
                <motion.button
                  key={index}
                  onClick={() => !answered && setSelectedIndex(index)}
                  disabled={answered}
                  whileTap={!answered ? { scale: 0.97 } : undefined}
                  className={`
                    w-full text-left rounded-2xl border-2 py-4 px-5 text-base
                    transition-all duration-200 min-h-[56px]
                    ${getOptionStyle(index)}
                  `}
                  style={
                    selectedIndex === index && !answered
                      ? { borderColor: unitColor, boxShadow: `0 4px 14px ${unitColor}25` }
                      : undefined
                  }
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`
                        flex-shrink-0 w-9 h-9 rounded-xl border-2
                        flex items-center justify-center
                        text-sm font-bold transition-all
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
                      {answered && localCorrect !== null ? (
                        index === question.correctIndex ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : selectedIndex === index ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className="font-medium">{option}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          {/* ── True / False ── */}
          {question.type === 'true-false' && (
            <div className="grid grid-cols-2 gap-4">
              {[true, false].map((value) => (
                <motion.button
                  key={String(value)}
                  onClick={() => !answered && setSelectedBool(value)}
                  disabled={answered}
                  whileTap={!answered ? { scale: 0.95 } : undefined}
                  className={`
                    rounded-2xl border-2 py-6 px-6 text-center font-bold text-xl
                    transition-all duration-200 min-h-[80px]
                    ${getTFStyle(value)}
                  `}
                  style={
                    selectedBool === value && !answered
                      ? { borderColor: unitColor, boxShadow: `0 4px 14px ${unitColor}25` }
                      : undefined
                  }
                >
                  <span className="text-3xl block mb-1">{value ? '✅' : '❌'}</span>
                  {value ? 'True' : 'False'}
                </motion.button>
              ))}
            </div>
          )}

          {/* ── Fill in the Blank ── */}
          {question.type === 'fill-blank' && (
            <div>
              <div className="relative">
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
                    w-full rounded-2xl border-2 py-4 px-5 text-lg font-medium
                    outline-none transition-all duration-200 min-h-[60px]
                    ${
                      answered
                        ? localCorrect
                          ? 'border-green-400 bg-green-50 text-green-900'
                          : 'border-red-400 bg-red-50 text-red-900'
                        : 'border-gray-300 focus:border-gray-400 bg-white text-gray-900 placeholder:text-gray-400'
                    }
                  `}
                  style={
                    !answered && textValue.trim().length > 0
                      ? { borderColor: unitColor, boxShadow: `0 4px 14px ${unitColor}20` }
                      : undefined
                  }
                />
                {!answered && textValue.trim().length > 0 && (
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${unitColor}15`, color: unitColor }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    Enter ↵
                  </motion.div>
                )}
              </div>
              {answered && localCorrect === false && (
                <motion.div
                  className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-base">💡</span>
                  <p className="text-sm text-red-700 font-semibold">
                    Correct answer: <span className="underline decoration-2">{getCorrectAnswerDisplay()}</span>
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Feedback card */}
        <AnimatePresence>
          {answered && localCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={`
                rounded-2xl p-5 border-2
                ${localCorrect
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                  : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                {localCorrect ? (
                  <>
                    <motion.span
                      className="text-2xl"
                      initial={{ rotate: -20, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.1 }}
                    >
                      🎉
                    </motion.span>
                    <span className="font-extrabold text-lg text-green-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <motion.span
                      className="text-2xl"
                      initial={{ rotate: 20, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.1 }}
                    >
                      🤔
                    </motion.span>
                    <span className="font-extrabold text-lg text-red-800">Not quite</span>
                  </>
                )}
              </div>

              {!localCorrect && question.type !== 'fill-blank' && (
                <motion.div
                  className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-sm text-gray-800 font-semibold">
                    {getCorrectAnswerDisplay()}
                  </p>
                </motion.div>
              )}

              <motion.p
                className={`text-sm leading-relaxed font-medium ${
                  localCorrect ? 'text-green-800/80' : 'text-red-800/80'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {question.explanation}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default QuestionCard;
