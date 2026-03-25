'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCourseStore } from '@/store/useCourseStore';
import { useBackHandler } from '@/hooks/useBackHandler';

export default function PlacementTestResult() {
  const result = useCourseStore((s) => s.placementTestResult);
  const dismiss = useCourseStore((s) => s.dismissPlacementResult);

  useBackHandler(!!result, dismiss);

  // Enter / Space dismisses
  useEffect(() => {
    if (!result) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismiss();
      }
    };
    const timer = setTimeout(() => window.addEventListener('keydown', handle), 500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handle);
    };
  }, [result, dismiss]);

  if (!result) return null;

  const passed = result.passed;

  return (
    <motion.div
      key="placement-result"
      className="fixed inset-0 z-[70] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        className="relative w-full mx-4 bg-white overflow-hidden"
        style={{ maxWidth: 420, borderRadius: 28, padding: '32px 24px' }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Icon */}
        <div className="flex justify-center" style={{ marginBottom: 16 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              background: passed ? '#D7FFB8' : '#FFE5E5',
              fontSize: 36,
            }}
          >
            {passed ? '🎉' : '📚'}
          </div>
        </div>

        {/* Title */}
        <p
          className="text-center"
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: passed ? '#58A700' : '#EA2B2B',
            marginBottom: 4,
          }}
        >
          {passed ? 'Placement Test Passed!' : 'Not quite yet'}
        </p>

        {/* Subtitle */}
        <p
          className="text-center"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#AFAFAF',
            marginBottom: 20,
          }}
        >
          {passed
            ? `You unlocked ${result.targetUnitTitle}`
            : `You needed fewer than ${result.maxMistakes} mistakes`}
        </p>

        {/* Stats */}
        {result.totalQuestions > 0 && (
          <div
            className="flex justify-center"
            style={{ gap: 24, marginBottom: 24 }}
          >
            <Stat
              label="Correct"
              value={`${result.correctAnswers}/${result.totalQuestions}`}
              color={passed ? '#58A700' : '#3C3C3C'}
            />
            <Stat
              label="Mistakes"
              value={`${result.mistakes}`}
              color={result.mistakes >= result.maxMistakes ? '#EA2B2B' : '#3C3C3C'}
            />
            <Stat
              label="Units"
              value={`${result.unitsSkipped}`}
              color="#3C3C3C"
            />
          </div>
        )}

        {/* Failure hint */}
        {!passed && (
          <p
            className="text-center"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#CFCFCF',
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            Complete the units in order to strengthen your knowledge, then try
            again.
          </p>
        )}

        {/* Action button */}
        <button
          onClick={dismiss}
          className="w-full transition-transform active:scale-[0.98]"
          style={{
            padding: '16px 0',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            color: '#FFFFFF',
            background: passed ? '#58CC02' : '#FF4B4B',
            boxShadow: passed ? '0 4px 0 #46A302' : '0 4px 0 #CC2D2D',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {passed ? 'Continue' : 'Got it'}
        </button>
      </motion.div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <p style={{ fontSize: 22, fontWeight: 800, color }}>{value}</p>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#CFCFCF', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </p>
    </div>
  );
}
