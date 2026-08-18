'use client';

import type { ReactNode } from 'react';

export interface LessonTypeButtonProps {
  children: ReactNode;
  onClick: () => void;
  /** Fill color of the button. */
  background: string;
  /** Color of the 4px bottom shadow that gives the button its depth. */
  shadowColor: string;
  /** Label color. Defaults to white. */
  color?: string;
  disabled?: boolean;
}

/**
 * Full-width uppercase CTA at the bottom of the non-standard lesson type views.
 * Colors are supplied by the caller so each view keeps its own accent/feedback tint.
 */
export function LessonTypeButton({
  children,
  onClick,
  background,
  shadowColor,
  color = '#FFFFFF',
  disabled,
}: LessonTypeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full transition-transform active:scale-[0.98]"
      style={{
        padding: '14px 0',
        borderRadius: 16,
        fontSize: 15,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        background,
        color,
        boxShadow: `0 4px 0 ${shadowColor}`,
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}
