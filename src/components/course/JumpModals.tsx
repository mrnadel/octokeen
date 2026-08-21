'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUnitTheme } from '@/lib/unitThemes';
import type { Unit } from '@/data/course/types';

export type JumpModalType =
  | { kind: 'within-unit'; unitIndex: number; lessonIndex: number }
  | { kind: 'placement-test'; unitIndex: number }
  | { kind: 'guest-signup'; unitIndex: number }
  | { kind: 'free-upgrade'; unitIndex: number };

interface JumpModalsProps {
  jumpModal: JumpModalType | null;
  setJumpModal: (modal: JumpModalType | null) => void;
  courseData: Unit[];
  getDisplayNumber: (globalIndex: number) => number;
  startPlacementTest: (unitIndex: number) => void;
  debugSkipToUnit: (unitIndex: number) => void;
  debugSkipToLesson: (unitIndex: number, lessonIndex: number) => void;
  onUpgrade: () => void;
}

export function JumpModals({
  jumpModal,
  setJumpModal,
  courseData,
  getDisplayNumber,
  startPlacementTest,
  debugSkipToUnit,
  debugSkipToLesson,
  onUpgrade,
}: JumpModalsProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {jumpModal &&
        (() => {
          const unit = courseData[jumpModal.unitIndex];
          const theme = getUnitTheme(jumpModal.unitIndex);
          return (
            <motion.div
              key="jump-overlay"
              className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setJumpModal(null)}
            >
              <div className="absolute inset-0 bg-black/40" />
              <motion.div
                className="relative w-full sm:w-auto bg-white sm:mx-4 overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-label="Unit action"
                style={{
                  maxWidth: 480,
                  maxHeight: 'calc(100vh - 48px)',
                  borderRadius: 24,
                  padding: '20px 20px 32px',
                }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring' as const, damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Unit badge */}
                <div className="flex items-center" style={{ gap: 12, marginBottom: 12 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      backgroundColor: theme.bg,
                      color: theme.dark,
                      fontSize: 20,
                    }}
                  >
                    {unit.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate" style={{ fontSize: 12, fontWeight: 700, color: '#AFAFAF' }}>
                      Unit {getDisplayNumber(jumpModal.unitIndex)}
                    </p>
                    <p className="truncate" style={{ fontSize: 16, fontWeight: 800, color: '#3C3C3C' }}>
                      {unit.title}
                    </p>
                  </div>
                </div>

                {/* ─── Within-unit lock ─── */}
                {jumpModal.kind === 'within-unit' && (
                  <>
                    <p style={{ fontSize: 14, color: '#AFAFAF', fontWeight: 600, marginBottom: 20 }}>
                      Complete the previous lessons in this unit to unlock the next one.
                    </p>
                    <button
                      className="w-full active:scale-[0.98] transition-transform"
                      style={{
                        padding: '16px 0',
                        borderRadius: 16,
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        background: theme.color,
                        boxShadow: `0 4px 0 ${theme.dark}`,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setJumpModal(null)}
                    >
                      Got it
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                      <button
                        className="w-full active:scale-[0.98] transition-transform"
                        style={{
                          marginTop: 8,
                          padding: '12px 0',
                          borderRadius: 16,
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: '#EF4444',
                          border: '2px dashed #B91C1C',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          debugSkipToLesson(jumpModal.unitIndex, jumpModal.lessonIndex);
                          setJumpModal(null);
                        }}
                      >
                        DEBUG: Skip to Lesson
                      </button>
                    )}
                  </>
                )}

                {/* ─── Placement test offer ─── */}
                {jumpModal.kind === 'placement-test' && (
                  <>
                    <p style={{ fontSize: 14, color: '#AFAFAF', fontWeight: 600, marginBottom: 6 }}>
                      Take a placement test to jump to this unit. You&apos;ll answer questions from the units in between.
                    </p>
                    <p style={{ fontSize: 13, color: '#CFCFCF', fontWeight: 600, marginBottom: 20 }}>
                      You need ~75% accuracy to pass.
                    </p>
                    <div className="flex" style={{ gap: 12 }}>
                      <button
                        className="flex-1 active:scale-[0.98] transition-transform"
                        style={{
                          padding: '16px 0',
                          borderRadius: 16,
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#AFAFAF',
                          background: '#F5F5F5',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => setJumpModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 active:scale-[0.98] transition-transform"
                        style={{
                          padding: '16px 0',
                          borderRadius: 16,
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: theme.color,
                          boxShadow: `0 4px 0 ${theme.dark}`,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          startPlacementTest(jumpModal.unitIndex);
                          setJumpModal(null);
                        }}
                      >
                        Start Test
                      </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                      <button
                        className="w-full active:scale-[0.98] transition-transform"
                        style={{
                          marginTop: 8,
                          padding: '12px 0',
                          borderRadius: 16,
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: '#EF4444',
                          border: '2px dashed #B91C1C',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          debugSkipToUnit(jumpModal.unitIndex);
                          setJumpModal(null);
                        }}
                      >
                        DEBUG: Skip to Unit
                      </button>
                    )}
                  </>
                )}

                {/* ─── Guest sign-up ─── */}
                {jumpModal.kind === 'guest-signup' && (
                  <>
                    <p style={{ fontSize: 14, color: '#AFAFAF', fontWeight: 600, marginBottom: 20 }}>
                      Create a free account to unlock all units and save your progress across devices!
                    </p>
                    <div className="flex" style={{ gap: 12 }}>
                      <button
                        className="flex-1 active:scale-[0.98] transition-transform"
                        style={{
                          padding: '16px 0',
                          borderRadius: 16,
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#AFAFAF',
                          background: '#F5F5F5',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => setJumpModal(null)}
                      >
                        Maybe later
                      </button>
                      <button
                        className="flex-1 active:scale-[0.98] transition-transform"
                        style={{
                          padding: '16px 0',
                          borderRadius: 16,
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: '#0D9488',
                          boxShadow: '0 4px 0 #0F766E',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setJumpModal(null);
                          router.push('/register');
                        }}
                      >
                        Sign Up Free
                      </button>
                    </div>
                  </>
                )}

                {/* ─── Free-tier upgrade ─── */}
                {jumpModal.kind === 'free-upgrade' && (
                  <>
                    <p style={{ fontSize: 14, color: '#AFAFAF', fontWeight: 600, marginBottom: 20 }}>
                      This unit requires a Pro subscription. Upgrade to unlock every unit of every course.
                    </p>
                    <div className="flex" style={{ gap: 12 }}>
                      <button
                        className="flex-1 active:scale-[0.98] transition-transform"
                        style={{
                          padding: '16px 0',
                          borderRadius: 16,
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#AFAFAF',
                          background: '#F5F5F5',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => setJumpModal(null)}
                      >
                        Maybe later
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center active:scale-[0.98] transition-transform"
                        style={{
                          gap: 6,
                          padding: '16px 0',
                          borderRadius: 16,
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: theme.color,
                          boxShadow: `0 4px 0 ${theme.dark}`,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setJumpModal(null);
                          onUpgrade();
                        }}
                      >
                        <Sparkles style={{ width: 16, height: 16 }} />
                        Upgrade to Pro
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
    </AnimatePresence>
  );
}
