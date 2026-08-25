'use client';

import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { CourseQuestion } from '@/data/course/types';
import { Mascot, type MascotPose } from '@/components/ui/Mascot';
import { CharacterAvatar, getCharacterPoses } from '@/components/ui/CharacterAvatar';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { getTeachingColors } from '@/lib/teachingColors';
import { useIsDark } from '@/store/useThemeStore';
import { getCountry } from '@/lib/country';
import EngagingText from './EngagingText';
import { AudioButton } from '@/components/ui/AudioButton';

const DiagramDisplay = memo(function DiagramDisplay({ html, cardBg, border }: { html: string; cardBg: string; border: string }) {
  const sanitised = html
    .replace(/(<svg[^>]*)\sheight="auto"/gi, '$1')
    .replace(/(<svg[^>]*)\swidth="auto"/gi, '$1');
  return (
    <div
      className="w-full flex items-center justify-center overflow-hidden"
      style={{
        borderRadius: 14,
        background: cardBg,
        border: `2px solid ${border}`,
        padding: 10,
        maxWidth: 400,
        margin: '0 auto',
      }}
      dangerouslySetInnerHTML={{ __html: sanitised }}
    />
  );
});

const TEACHING_POSES: MascotPose[] = [
  'excited', 'thinking', 'proud', 'winking', 'laughing', 'neutral', 'explorer',
];
const SPACE_POSES: MascotPose[] = [
  'space-astronaut', 'space-flag', 'space-ufo', 'space-moon',
  'excited', 'thinking', 'explorer',
];

/** Stable per-card hash so a card always picks the same pose and stage side. */
function hashId(questionId: string): number {
  let hash = 0;
  for (let i = 0; i < questionId.length; i++) {
    hash = ((hash << 5) - hash + questionId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getPoseForQuestion(questionId: string, useSpacePoses: boolean): MascotPose {
  const poses = useSpacePoses ? SPACE_POSES : TEACHING_POSES;
  return poses[hashId(questionId) % poses.length];
}

/**
 * Pick one of the character's own poses so consecutive teaching cards do not
 * show the same standing portrait. Returns null when the character has no
 * pose sheet, which falls the avatar back to its default art.
 */
function getCharacterPoseForQuestion(characterId: string, questionId: string): string | null {
  const keys = getCharacterPoses(characterId);
  if (keys.length === 0) return null;
  const key = keys[hashId(questionId + ':pose') % keys.length];
  return key.slice(characterId.length + 1);
}

/**
 * Split an explanation into a short one-liner (first sentence)
 * and the remaining detail text (rest).
 */
export function splitExplanation(text: string | undefined): [string, string] {
  if (!text) return ['', ''];
  const match = text.match(/[.!?](?:\s|$)/);
  if (!match || match.index === undefined) return [text, ''];
  const end = match.index + 1;
  const first = text.slice(0, end).trim();
  const rest = text.slice(end).trim();
  return [first, rest];
}

interface TeachingCardProps {
  question: CourseQuestion;
  unitColor: string;
  onGotIt: () => void;
  hasBackground?: boolean;
  bgTheme?: 'dark' | 'light' | null;
  characterId?: string | null;
  characterName?: string | null;
  lessonId?: string;
}

export default function TeachingCard({ question, unitColor, onGotIt, hasBackground, bgTheme, characterId, characterName, lessonId }: TeachingCardProps) {
  const isDark = useIsDark();
  const tc = getTeachingColors({
    isDark,
    hasBackground: !!hasBackground,
    bgTheme: bgTheme ?? null,
  });

  // Strip leading emoji from title
  const titleMatch = question.question.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*/u);
  const title = titleMatch ? question.question.slice(titleMatch[0].length) : question.question;

  const pose = useMemo(() => getPoseForQuestion(question.id, !!hasBackground), [question.id, hasBackground]);
  const characterPose = useMemo(
    () => (characterId ? getCharacterPoseForQuestion(characterId, question.id) : null),
    [characterId, question.id],
  );

  // Alternate which side of the stage the character stands on so a run of
  // teaching cards does not read as the same static frame every time.
  const facing: 'left' | 'right' = hashId(question.id + ':side') % 2 === 0 ? 'left' : 'right';

  const reducedMotion = useReducedMotion();

  // Resolve localized explanation variant. Read after mount: the country is
  // detected client-side, so it is not available during SSR.
  const [country, setCountry] = useState<string | null>(null);
  useEffect(() => {
    setCountry(getCountry());
  }, []);
  const displayExplanation = (country && question.variants?.[country]) || question.explanation;

  // Split explanation into one-liner + expandable detail
  const [oneLiner, detailText] = useMemo(() => splitExplanation(displayExplanation), [displayExplanation]);
  const hasExpandContent = detailText.length > 0 || !!question.hint;

  // The character teaches the lesson: the bubble always carries the card's own
  // teaching sentence. Canned character quips used to hijack it, which meant
  // every lesson opened with the same filler line and pushed the real text out
  // of the bubble. Character quips now live only in celebration/result moments.
  const bubbleText = oneLiner;

  // Expand state
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = useCallback(() => setExpanded(prev => !prev), []);

  // Glass styles
  const glassProps = tc.isGlass
    ? { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } as const
    : {};

  return (
    <div className="flex flex-col flex-1" style={{ minHeight: '100%' }}>
      {/* Stage — big character on a ground line, talking through a speech bubble */}
      <div
        className="flex flex-col flex-1 justify-center text-left"
        style={{ padding: '16px 20px 12px', gap: 14, maxWidth: 520, margin: '0 auto', width: '100%' }}
      >
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: tc.title,
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {title}
        </motion.h2>

        {/* Character + bubble */}
        <div
          style={{
            display: 'flex',
            flexDirection: facing === 'left' ? 'row' : 'row-reverse',
            alignItems: 'flex-end',
            gap: 12,
          }}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.05 }}
            style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              className="teaching-stage-character"
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            >
              {characterId ? (
                <CharacterAvatar characterId={characterId} pose={characterPose} size={160} priority />
              ) : (
                <Mascot pose={pose} size={140} priority />
              )}
            </div>
          </motion.div>

          {bubbleText && (
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, x: facing === 'left' ? -12 : 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26, delay: 0.28 }}
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                paddingBottom: 14,
                transformOrigin: facing === 'left' ? 'left bottom' : 'right bottom',
              }}
            >
              {(characterName || question.explanation) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '0 6px',
                    flexDirection: facing === 'left' ? 'row' : 'row-reverse',
                  }}
                >
                  {characterId && characterName && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: tc.accentSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {characterName}
                    </span>
                  )}
                  {question.explanation && (
                    <AudioButton lessonId={lessonId} cardId={question.id} text={question.explanation} color={tc.accentSoft} size={18} />
                  )}
                </div>
              )}
              <SpeechBubble
                side={facing === 'left' ? 'left' : 'right'}
                background={tc.expandCardBg}
                border={tc.expandCardBorder}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: tc.title,
                  lineHeight: 1.45,
                  ...glassProps,
                }}
              >
                <EngagingText text={oneLiner} accentColor={tc.accent} />
              </SpeechBubble>
            </motion.div>
          )}
        </div>

        {/* Ground line the character stands on */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          style={{ height: 2, background: tc.border, borderRadius: 2, transformOrigin: 'left center', marginTop: -6 }}
        />

        {/* Diagram if present */}
        {question.diagram && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="w-full"
          >
            <DiagramDisplay html={question.diagram} cardBg={tc.expandCardBg} border={tc.expandCardBorder} />
          </motion.div>
        )}
      </div>

      {/* Expand trigger + content */}
      {hasExpandContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ maxWidth: 520, margin: '0 auto', width: '100%' }}
        >
          <button
            onClick={toggleExpand}
            aria-expanded={expanded}
            aria-label={expanded ? 'Show less detail' : 'Tell me more — expand for detail'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 20px',
              width: '100%',
              cursor: 'pointer',
              color: tc.accentSoft,
              fontSize: 13,
              fontWeight: 700,
              background: 'none',
              border: 'none',
            }}
          >
            Tell me more
            <span
              style={{
                fontSize: 10,
                display: 'inline-block',
                transition: 'transform 0.3s',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              &#9660;
            </span>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden', padding: '0 20px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
                  {/* Detail text */}
                  {detailText && (
                    <div
                      style={{
                        background: tc.expandCardBg,
                        border: `1.5px solid ${tc.expandCardBorder}`,
                        borderRadius: 14,
                        padding: '12px 16px',
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: tc.body,
                        lineHeight: 1.5,
                        textAlign: 'left',
                        ...glassProps,
                      }}
                    >
                      <EngagingText text={detailText} accentColor={tc.accent} />
                    </div>
                  )}

                  {/* Hint */}
                  {question.hint && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 14px',
                        background: tc.hintBg,
                        border: `1.5px solid ${tc.hintBorder}`,
                        borderRadius: 10,
                      }}
                    >
                      <Mascot pose="thinking" size={28} className="flex-shrink-0" />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: tc.hintText, lineHeight: 1.4 }}>
                        <EngagingText text={question.hint} accentColor={tc.accent} />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Got it button */}
      <div style={{ margin: 'auto auto 0', padding: '16px 20px 28px', maxWidth: 520, width: '100%' }}>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          onClick={onGotIt}
          aria-label="Got it — continue to next card"
          whileTap={{ y: 4, boxShadow: '0 0 0 transparent', transition: { duration: 0.06 } }}
          className="w-full"
          style={{
            padding: '15px 0',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            background: tc.isGlass ? tc.accentSoft : unitColor,
            color: '#FFFFFF',
            boxShadow: tc.isGlass
              ? `0 4px 0 color-mix(in srgb, ${tc.accentSoft} 70%, black), 0 0 20px ${tc.accentSoft}40`
              : `0 4px 0 color-mix(in srgb, ${unitColor} 70%, black)`,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Got it!
        </motion.button>
      </div>
    </div>
  );
}
