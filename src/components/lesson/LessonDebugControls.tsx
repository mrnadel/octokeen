'use client';

import { useState } from 'react';
import { useCourseStore } from '@/store/useCourseStore';
import type { ActiveLesson } from '@/data/course/types';
import { useLessonColors } from '@/lib/lessonColors';

const SQUARE_BUTTON = {
  width: 28,
  height: 28,
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const STEP_BG = '#EDE9FE';
const STEP_BORDER = '#C4B5FD';
const FINISH_BG = '#D1FAE5';
const FINISH_BORDER = '#6EE7B7';

/** Preset outcomes for the "skip lesson" debug menu — label plus correct-answer count. */
const SKIP_PRESETS = [
  { label: '✅ Pass (90%)', correct: 9 },
  { label: '⚠️ Pass (70%)', correct: 7 },
  { label: '❌ Fail (40%)', correct: 4 },
  { label: '💎 Flawless', correct: 10 },
] as const;

export interface LessonDebugControlsProps {
  activeLesson: ActiveLesson | null;
  /** Present in practice/session mode — replaces the lesson skip menu with a single skip button. */
  adapterComplete?: () => void;
  submitAnswer: (questionId: string, correct: boolean) => void;
  completeLesson: () => void;
}

/**
 * Development-only lesson navigation: step back/forward through questions and
 * skip to a preset result. Renders nothing outside development.
 */
export function LessonDebugControls({
  activeLesson,
  adapterComplete,
  submitAnswer,
  completeLesson,
}: LessonDebugControlsProps) {
  const c = useLessonColors();
  const [showMenu, setShowMenu] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  const isAtEnd = !!activeLesson && activeLesson.currentQuestionIndex >= activeLesson.sessionQuestionIds.length - 1;

  const stepTo = (index: number) => {
    if (!activeLesson) return;
    useCourseStore.setState({ activeLesson: { ...activeLesson, currentQuestionIndex: index } });
  };

  const applyPreset = (correct: number) => {
    if (!activeLesson) return;
    const ids = activeLesson.sessionQuestionIds;
    const correctCount = Math.min(correct, ids.length);
    for (let i = activeLesson.answers.length; i < ids.length; i++) {
      submitAnswer(ids[i], i < correctCount);
    }
    setShowMenu(false);
    setTimeout(completeLesson, 10);
  };

  return (
    <>
      {activeLesson && (
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => stepTo(activeLesson.currentQuestionIndex - 1)}
            disabled={activeLesson.currentQuestionIndex <= 0}
            title="Previous question"
            className="flex-shrink-0 transition-transform active:scale-90 disabled:opacity-30"
            style={{
              ...SQUARE_BUTTON,
              background: STEP_BG,
              border: `1px solid ${STEP_BORDER}`,
              cursor: activeLesson.currentQuestionIndex > 0 ? 'pointer' : 'default',
            }}
          >
            ◀
          </button>
          <button
            onClick={() => {
              if (isAtEnd) {
                adapterComplete ? adapterComplete() : completeLesson();
                return;
              }
              stepTo(activeLesson.currentQuestionIndex + 1);
            }}
            title={isAtEnd ? 'Finish lesson' : 'Next question'}
            className="flex-shrink-0 transition-transform active:scale-90"
            style={{
              ...SQUARE_BUTTON,
              background: isAtEnd ? FINISH_BG : STEP_BG,
              border: `1px solid ${isAtEnd ? FINISH_BORDER : STEP_BORDER}`,
              cursor: 'pointer',
            }}
          >
            {isAtEnd ? '✓' : '▶'}
          </button>
        </div>
      )}

      {adapterComplete ? (
        <button
          onClick={adapterComplete}
          title="Debug: skip session"
          className="flex-shrink-0 transition-transform active:scale-90"
          style={{ ...SQUARE_BUTTON, background: c.dangerBg, border: '1px solid #FECACA', cursor: 'pointer' }}
        >
          ⏭
        </button>
      ) : (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu((v) => !v)}
            title="Debug: skip lesson"
            className="flex-shrink-0 transition-transform active:scale-90"
            style={{ ...SQUARE_BUTTON, background: c.dangerBg, border: '1px solid #FECACA', cursor: 'pointer' }}
          >
            ⏭
          </button>
          {showMenu && activeLesson && (
            <div
              style={{
                position: 'absolute',
                top: 34,
                right: 0,
                background: c.disclaimerBg,
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                border: `1px solid ${c.disclaimerBorder}`,
                padding: 4,
                zIndex: 100,
                minWidth: 150,
              }}
            >
              {SKIP_PRESETS.map(({ label, correct }) => (
                <button
                  key={label}
                  onClick={() => applyPreset(correct)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F3F4F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
