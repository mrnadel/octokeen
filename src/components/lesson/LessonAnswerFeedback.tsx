'use client';

import { motion } from 'framer-motion';
import type { CourseQuestion } from '@/data/course/types';
import type { ContentFeedbackType } from '@/data/types';
import { CORRECT, INCORRECT } from './shared/answer-feedback';
import { getCorrectAnswerDisplay } from './shared/correct-answer';
import FlagButton from '@/components/feedback/FlagButton';
import { GameButton } from '@/components/ui/GameButton';
import { GlossaryText } from '@/components/ui/GlossaryText';
import { AudioButton } from '@/components/ui/AudioButton';

const PANEL_ENTER = { y: 30, opacity: 0 } as const;
const PANEL_SETTLED = { y: 0, opacity: 1 } as const;
const PANEL_SPRING = { type: 'spring', stiffness: 300, damping: 25 } as const;
const REVEAL_FROM = { opacity: 0, y: 4 } as const;
const DISTRACTOR_REVEAL = { delay: 0.15, duration: 0.25 } as const;
const EXPLANATION_REVEAL = { delay: 0.35, duration: 0.25 } as const;

export interface LessonAnswerFeedbackProps {
  question: CourseQuestion;
  correct: boolean;
  /** Original index of the option the user picked, for distractor-specific copy. */
  selectedIndex?: number;
  isLastQuestion: boolean;
  onContinue: () => void;
  continueRef: React.Ref<HTMLButtonElement>;
  flagContentType: ContentFeedbackType;
  /** Lesson id for pre-generated narration audio; undefined in practice mode. */
  lessonId?: string;
  /** ISO country code used to pick a localized explanation variant. */
  userCountry: string | null;
}

/** Post-answer panel: correct/incorrect banner, explanations, flag button and continue CTA. */
export function LessonAnswerFeedback({
  question,
  correct,
  selectedIndex,
  isLastQuestion,
  onContinue,
  continueRef,
  flagContentType,
  lessonId,
  userCountry,
}: LessonAnswerFeedbackProps) {
  const tint = correct ? CORRECT : INCORRECT;
  const distractor = selectedIndex === undefined ? undefined : question.distractorExplanations?.[selectedIndex];
  const explanation = (userCountry && question.variants?.[userCountry]) || question.explanation;

  return (
    <motion.div
      key="feedback"
      initial={PANEL_ENTER}
      animate={PANEL_SETTLED}
      transition={PANEL_SPRING}
      style={{
        padding: '14px 20px',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        background: tint.bg,
        borderTop: `2px solid ${tint.border}`,
      }}
    >
      <div style={{ marginBottom: 12 }} role="status" aria-live="assertive">
        <p style={{ fontSize: 17, fontWeight: 800, color: tint.text, margin: 0 }}>
          {correct ? 'Correct!' : 'Incorrect'}
        </p>

        {!correct && (
          <p style={{ fontSize: 14, fontWeight: 700, color: INCORRECT.text, margin: '2px 0 0' }}>
            Answer: <GlossaryText text={getCorrectAnswerDisplay(question)} />
          </p>
        )}

        {!correct && distractor && (
          <motion.p
            initial={REVEAL_FROM}
            animate={{ opacity: 0.85, y: 0 }}
            transition={DISTRACTOR_REVEAL}
            style={{ fontSize: 13, fontWeight: 600, color: INCORRECT.text, margin: '6px 0 0', lineHeight: 1.4 }}
          >
            <GlossaryText text={distractor} />
          </motion.p>
        )}

        {question.explanation && (
          <motion.div
            initial={!correct && distractor ? REVEAL_FROM : undefined}
            animate={{ opacity: 0.75, y: 0 }}
            transition={!correct && distractor ? EXPLANATION_REVEAL : undefined}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 2, margin: '4px 0 0' }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: tint.text,
                opacity: 0.75,
                margin: 0,
                lineHeight: 1.4,
                flex: 1,
              }}
            >
              <GlossaryText text={explanation} />
            </p>
            <AudioButton
              lessonId={lessonId}
              cardId={question.id}
              suffix="exp"
              text={question.explanation}
              color={tint.text}
              size={16}
            />
          </motion.div>
        )}

        <FlagButton contentType={flagContentType} contentId={question.id} hasGraphic={!!question.diagram} />
      </div>

      <GameButton
        ref={continueRef}
        data-testid="continue-button"
        onClick={onContinue}
        variant={correct ? 'green' : 'red'}
      >
        {isLastQuestion ? 'Finish' : 'Continue'}
      </GameButton>
    </motion.div>
  );
}
