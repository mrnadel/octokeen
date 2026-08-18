'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LessonTypeProps } from '@/data/course/types';
import type { QuestionCardHandle } from '@/components/lesson/QuestionCard';
import { QuestionRenderer } from '@/components/lesson/shared/QuestionRenderer';
import { LessonTypeFooter } from '@/components/lesson/shared/LessonTypeFooter';
import { LessonTypeButton } from '@/components/lesson/shared/LessonTypeButton';
import { CORRECT, INCORRECT } from '@/components/lesson/shared/answer-feedback';
import { GlossaryText } from '@/components/ui/GlossaryText';
import { useLessonColors } from '@/lib/lessonColors';

/** Bottom shadow for the Check button while no answer is selected. */
const DISABLED_SHADOW = '#CCCCCC';

export default function CaseStudyView({
  lesson,
  unitColor,
  theme,
  onAnswer,
  onProgress,
  onComplete,
  checkHearts,
}: LessonTypeProps) {
  const c = useLessonColors();
  const sections = lesson.caseStudySections ?? [];

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [checkpointAnswered, setCheckpointAnswered] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const questionRef = useRef<QuestionCardHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    onProgress(0, sections.length);
    return () => { initRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top when section changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSectionIndex]);

  const currentSection = sections[currentSectionIndex];
  const hasCheckpoint = !!currentSection?.checkpoint;
  const isLastSection = currentSectionIndex >= sections.length - 1;

  const handleCheckpointAnswer = useCallback(
    (correct: boolean) => {
      if (!currentSection?.checkpoint) return;
      onAnswer(currentSection.checkpoint.id, correct);
      setCheckpointAnswered(true);
      setLastAnswerCorrect(correct);
    },
    [currentSection, onAnswer],
  );

  const handleCheck = useCallback(() => {
    questionRef.current?.check();
  }, []);

  const handleContinue = useCallback(() => {
    if (isLastSection) {
      onProgress(sections.length, sections.length);
      onComplete();
      return;
    }

    if (!checkHearts()) return;

    setCurrentSectionIndex((prev) => prev + 1);
    setCheckpointAnswered(false);
    setHasSelection(false);
    setLastAnswerCorrect(null);
    onProgress(currentSectionIndex + 1, sections.length);
  }, [isLastSection, currentSectionIndex, sections.length, onProgress, onComplete, checkHearts]);

  if (!currentSection) return null;

  const showContinue = hasCheckpoint ? checkpointAnswered : true;
  const showCheck = hasCheckpoint && !checkpointAnswered;
  const feedbackTint = lastAnswerCorrect === null ? null : lastAnswerCorrect ? CORRECT : INCORRECT;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Scrollable content area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Section indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {sections.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: i <= currentSectionIndex ? unitColor : c.border,
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Case study title */}
        {currentSectionIndex === 0 && lesson.caseStudyTitle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20 }}>📋</span>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: c.title, margin: 0 }}>
              {lesson.caseStudyTitle}
            </h2>
          </div>
        )}

        {/* Section content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Narrative text */}
            <div
              style={{
                background: c.cardBg,
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: `1px solid ${c.emptyBg}`,
                marginBottom: hasCheckpoint ? 16 : 0,
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: c.title,
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: 'pre-line',
                }}
              >
                <GlossaryText text={currentSection.content} />
              </p>
            </div>

            {/* Checkpoint question */}
            {hasCheckpoint && currentSection.checkpoint && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: checkpointAnswered
                        ? lastAnswerCorrect
                          ? '#58CC02'
                          : '#FF4B4B'
                        : unitColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 10, color: '#FFF', fontWeight: 800 }}>?</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.subtitle, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Checkpoint
                  </span>
                </div>
                <QuestionRenderer
                  question={currentSection.checkpoint}
                  unitColor={unitColor}
                  onAnswer={handleCheckpointAnswer}
                  answered={checkpointAnswered}
                  onSelectionChange={setHasSelection}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      {showCheck ? (
        <LessonTypeFooter>
          <LessonTypeButton
            onClick={handleCheck}
            disabled={!hasSelection}
            background={hasSelection ? unitColor : c.border}
            color={hasSelection ? '#FFFFFF' : c.subtitle}
            shadowColor={hasSelection ? theme.dark : DISABLED_SHADOW}
          >
            Check
          </LessonTypeButton>
        </LessonTypeFooter>
      ) : showContinue ? (
        <LessonTypeFooter
          animated
          borderColor={feedbackTint?.border}
          background={feedbackTint?.bg}
        >
          {lastAnswerCorrect !== null && currentSection.checkpoint && (
            <div style={{ marginBottom: 10 }}>
              <p style={{
                fontSize: 15,
                fontWeight: 800,
                color: lastAnswerCorrect ? CORRECT.text : INCORRECT.text,
                margin: '0 0 2px',
              }}>
                {lastAnswerCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {currentSection.checkpoint.explanation && (
                <p style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: lastAnswerCorrect ? CORRECT.text : INCORRECT.text,
                  opacity: 0.75,
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  <GlossaryText text={currentSection.checkpoint.explanation} />
                </p>
              )}
            </div>
          )}
          <LessonTypeButton
            onClick={handleContinue}
            background={feedbackTint?.border ?? unitColor}
            shadowColor={feedbackTint?.shadow ?? theme.dark}
          >
            {isLastSection ? 'Finish' : 'Continue Reading'}
          </LessonTypeButton>
        </LessonTypeFooter>
      ) : null}
    </div>
  );
}
