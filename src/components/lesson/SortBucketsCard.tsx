'use client';

import { useState, useCallback, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { CourseQuestion } from '@/data/course/types';
import type { QuestionCardHandle } from './QuestionCard';

interface SortBucketsCardProps {
  question: CourseQuestion;
  onAnswer: (correct: boolean) => void;
  onSelectionChange: (hasSelection: boolean) => void;
  answered: boolean;
  unitColor: string;
}

const SortBucketsCard = forwardRef<QuestionCardHandle, SortBucketsCardProps>(
  function SortBucketsCard({ question, onAnswer, onSelectionChange, answered, unitColor }, ref) {
    const items = question.options ?? [];
    const bucketLabels = question.buckets ?? ['A', 'B'];
    const correctBuckets = question.correctBuckets ?? [];

    // Shuffle items for display
    const shuffledOrder = useMemo(() => {
      const indices = items.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return indices;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.id]);

    // assignments[originalIdx] = bucketIdx or -1 (unsorted, still in pool)
    const [assignments, setAssignments] = useState<number[]>(() => items.map(() => -1));
    const [results, setResults] = useState<boolean[] | null>(null);

    useEffect(() => {
      setAssignments(items.map(() => -1));
      setResults(null);
    }, [question.id, items.length]);

    const allSorted = assignments.every((a) => a !== -1);
    const unsortedIndices = shuffledOrder.filter((i) => assignments[i] === -1);

    useEffect(() => {
      onSelectionChange(allSorted);
    }, [allSorted, onSelectionChange]);

    const handleItemToBucket = useCallback((originalIdx: number, bucketIdx: number) => {
      if (answered) return;
      setAssignments((prev) => {
        const next = [...prev];
        next[originalIdx] = bucketIdx;
        return next;
      });
    }, [answered]);

    const handleReturnToPool = useCallback((originalIdx: number) => {
      if (answered) return;
      setAssignments((prev) => {
        const next = [...prev];
        next[originalIdx] = -1;
        return next;
      });
    }, [answered]);

    const handleCheck = useCallback(() => {
      if (!allSorted || answered) return;
      const itemResults = assignments.map((a, i) => a === correctBuckets[i]);
      const allCorrect = itemResults.every(Boolean);
      setResults(itemResults);
      onAnswer(allCorrect);
    }, [allSorted, answered, assignments, correctBuckets, onAnswer]);

    useImperativeHandle(ref, () => ({
      check: handleCheck,
      hasSelection: allSorted,
      selectOption: (index: number) => {
        // Keyboard: 1/2 assigns first unsorted item to bucket 0/1
        if (!answered && index < bucketLabels.length && unsortedIndices.length > 0) {
          handleItemToBucket(unsortedIndices[0], index);
        }
      },
      selectBool: () => {},
      selectWord: () => {},
      questionType: 'sort-buckets',
      availableWordCount: 0,
    }), [handleCheck, allSorted, answered, bucketLabels.length, unsortedIndices, handleItemToBucket]);

    return (
      <div className="flex flex-col flex-1" style={{ minHeight: '100%' }}>
        {/* Question */}
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#3C3C3C', lineHeight: 1.35, margin: '0 0 12px' }}>
          {question.question}
        </h2>

        {/* Unsorted items pool */}
        {unsortedIndices.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#AFAFAF', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tap an item, then tap a category
            </div>
            <div className="flex flex-wrap" style={{ gap: 8 }}>
              <AnimatePresence>
                {unsortedIndices.map((originalIdx) => (
                  <UnsortedItem
                    key={items[originalIdx]}
                    label={items[originalIdx]}
                    unitColor={unitColor}
                    bucketLabels={bucketLabels}
                    onAssign={(bucketIdx) => handleItemToBucket(originalIdx, bucketIdx)}
                    disabled={answered}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Two buckets side by side */}
        <div className="grid grid-cols-2" style={{ gap: 10, flex: 1 }}>
          {bucketLabels.map((label, bIdx) => {
            const bucketItemIndices = shuffledOrder.filter((i) => assignments[i] === bIdx);

            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 16,
                  border: `2px solid ${unitColor}30`,
                  background: `${unitColor}06`,
                  padding: '10px 10px',
                  minHeight: 100,
                }}
              >
                {/* Bucket label */}
                <span style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: unitColor,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  {label}
                </span>

                {/* Items in this bucket */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <AnimatePresence>
                    {bucketItemIndices.map((originalIdx) => {
                      const isCorrect = results ? results[originalIdx] : null;
                      return (
                        <motion.button
                          key={items[originalIdx]}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => handleReturnToPool(originalIdx)}
                          disabled={answered}
                          whileTap={!answered ? { scale: 0.93 } : undefined}
                          style={{
                            padding: '8px 10px',
                            borderRadius: 10,
                            fontSize: 13,
                            fontWeight: 700,
                            textAlign: 'center',
                            cursor: answered ? 'default' : 'pointer',
                            background: isCorrect === null ? 'white'
                              : isCorrect ? '#D7FFB8' : '#FFDFE0',
                            border: isCorrect === null ? '1.5px solid #E5E5E5'
                              : isCorrect ? '1.5px solid #58CC02' : '1.5px solid #FF4B4B',
                            color: isCorrect === null ? '#3C3C3C'
                              : isCorrect ? '#58A700' : '#EA2B2B',
                          }}
                        >
                          {items[originalIdx]} {isCorrect === true ? '✓' : isCorrect === false ? '✗' : ''}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                  {bucketItemIndices.length === 0 && !answered && (
                    <div style={{
                      padding: '12px',
                      borderRadius: 10,
                      border: '1.5px dashed #D5D5D5',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#CFCFCF',
                      textAlign: 'center',
                    }}>
                      Drop items here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Counter */}
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, fontWeight: 700, color: '#CFCFCF' }}>
          {items.length - unsortedIndices.length}/{items.length} sorted
        </div>
      </div>
    );
  }
);

/** Individual unsorted item with a tap-to-pick-bucket interaction */
function UnsortedItem({
  label,
  unitColor,
  bucketLabels,
  onAssign,
  disabled,
}: {
  label: string;
  unitColor: string;
  bucketLabels: string[];
  onAssign: (bucketIdx: number) => void;
  disabled: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{ position: 'relative' }}
    >
      <motion.button
        onClick={() => !disabled && setExpanded((v) => !v)}
        disabled={disabled}
        whileTap={!disabled ? { scale: 0.93 } : undefined}
        style={{
          padding: '9px 16px',
          borderRadius: 12,
          background: expanded ? `${unitColor}12` : 'white',
          border: expanded ? `2.5px solid ${unitColor}` : '2px solid #E5E5E5',
          fontSize: 14,
          fontWeight: 700,
          color: '#3C3C3C',
          cursor: disabled ? 'default' : 'pointer',
          boxShadow: expanded ? 'none' : '0 2px 0 #E5E5E5',
        }}
      >
        {label}
      </motion.button>

      {/* Bucket picker dropdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 4,
              zIndex: 20,
              display: 'flex',
              gap: 6,
              background: 'white',
              padding: 6,
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '1px solid #E5E5E5',
            }}
          >
            {bucketLabels.map((bLabel, bIdx) => (
              <button
                key={bLabel}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                  onAssign(bIdx);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: unitColor,
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {bLabel}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SortBucketsCard;
