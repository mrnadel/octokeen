'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { CourseQuestion } from '@/data/course/types';
import { MoneyText } from '@/components/ui/MoneyText';

const DiagramDisplay = memo(function DiagramDisplay({ html }: { html: string }) {
  const sanitised = html
    .replace(/(<svg[^>]*)\sheight="auto"/gi, '$1')
    .replace(/(<svg[^>]*)\swidth="auto"/gi, '$1');
  return (
    <div
      className="w-full flex items-center justify-center overflow-hidden"
      style={{
        borderRadius: 14,
        background: 'white',
        border: '2px solid #E5E5E5',
        padding: 10,
        maxWidth: 400,
        margin: '0 auto',
      }}
      dangerouslySetInnerHTML={{ __html: sanitised }}
    />
  );
});

interface TeachingCardProps {
  question: CourseQuestion;
  unitColor: string;
  onGotIt: () => void;
}

export default function TeachingCard({ question, unitColor, onGotIt }: TeachingCardProps) {
  // Extract emoji from beginning of question title if present
  const titleMatch = question.question.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*/u);
  const emoji = titleMatch ? titleMatch[1] : null;
  const title = emoji ? question.question.slice(titleMatch![0].length) : question.question;

  return (
    <div className="flex flex-col flex-1" style={{ minHeight: '100%' }}>
      <div className="flex flex-col items-center" style={{ gap: 16, paddingTop: 8 }}>
        {/* Big emoji */}
        {emoji && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            style={{ fontSize: 56, lineHeight: 1 }}
          >
            {emoji}
          </motion.div>
        )}

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#3C3C3C',
            textAlign: 'center',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {title}
        </motion.h2>

        {/* Diagram if present */}
        {question.diagram && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <DiagramDisplay html={question.diagram} />
          </motion.div>
        )}

        {/* Main teaching content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#6B6B6B',
            lineHeight: 1.6,
            textAlign: 'center',
            maxWidth: 440,
          }}
        >
          <MoneyText text={question.explanation} />
        </motion.div>

        {/* Key points (reuse options array) */}
        {question.options && question.options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              maxWidth: 440,
              margin: '0 auto',
            }}
          >
            {question.options.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: `${unitColor}10`,
                  border: `1.5px solid ${unitColor}25`,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: unitColor,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#4A4A4A', lineHeight: 1.4 }}>
                  <MoneyText text={point} />
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Example callout */}
        {question.hint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              width: '100%',
              maxWidth: 440,
              padding: '14px 16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #FFF9E8, #FFF3D0)',
              border: '1.5px solid #FFE4B8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#B56E00', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Real Talk
              </span>
            </div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: '#8B6914', lineHeight: 1.5, margin: 0 }}>
              <MoneyText text={question.hint} />
            </p>
          </motion.div>
        )}
      </div>

      {/* Got it button - pushed to bottom */}
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onGotIt}
          whileTap={{ scale: 0.98 }}
          className="w-full"
          style={{
            padding: '15px 0',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            background: unitColor,
            color: '#FFFFFF',
            boxShadow: `0 4px 0 color-mix(in srgb, ${unitColor} 70%, black)`,
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
