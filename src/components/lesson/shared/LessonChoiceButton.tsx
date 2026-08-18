'use client';

import { useLessonColors } from '@/lib/lessonColors';

export interface LessonChoiceButtonProps {
  label: string;
  onClick: () => void;
  /** Accent applied to the border on hover. */
  unitColor: string;
  /** Accent tint applied to the background on hover. */
  hoverBg: string;
}

/**
 * Left-aligned branching-choice button used by the conversation and timeline
 * lesson types.
 */
export function LessonChoiceButton({ label, onClick, unitColor, hoverBg }: LessonChoiceButtonProps) {
  const c = useLessonColors();

  return (
    <button
      onClick={onClick}
      className="transition-transform active:scale-[0.98]"
      style={{
        padding: '13px 16px',
        borderRadius: 14,
        fontSize: 14,
        fontWeight: 700,
        textAlign: 'left',
        background: c.cardBg,
        color: c.title,
        border: `2px solid ${c.border}`,
        boxShadow: `0 3px 0 ${c.border}`,
        cursor: 'pointer',
        lineHeight: 1.4,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = unitColor;
        e.currentTarget.style.background = hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.background = c.cardBg;
      }}
    >
      {label}
    </button>
  );
}
