'use client';

import type { CSSProperties, ReactNode } from 'react';

interface SpeechBubbleProps {
  children: ReactNode;
  /** Side the tail sits on — points back at the character. */
  side?: 'left' | 'right';
  background: string;
  border: string;
  /** Distance from the top of the bubble to the tail's centre. */
  tailOffset?: number;
  style?: CSSProperties;
}

const BORDER_WIDTH = 2;
const TAIL_LENGTH = 12;
const TAIL_HALF = 9;

/**
 * Duolingo-style speech bubble: rounded rect with a triangular tail that points
 * sideways at the speaker. The tail is two stacked triangles — the outer one in
 * the border colour, the inner one in the fill — so the outline reads as one
 * continuous stroke around the bubble.
 */
export function SpeechBubble({
  children,
  side = 'left',
  background,
  border,
  tailOffset = 30,
  style,
}: SpeechBubbleProps) {
  const pointsLeft = side === 'left';
  const edge = pointsLeft ? 'left' : 'right';

  const outerTail: CSSProperties = {
    position: 'absolute',
    [edge]: -TAIL_LENGTH,
    top: tailOffset - TAIL_HALF,
    width: 0,
    height: 0,
    borderTop: `${TAIL_HALF}px solid transparent`,
    borderBottom: `${TAIL_HALF}px solid transparent`,
    [pointsLeft ? 'borderRight' : 'borderLeft']: `${TAIL_LENGTH}px solid ${border}`,
  };

  const innerTail: CSSProperties = {
    position: 'absolute',
    [edge]: -TAIL_LENGTH + BORDER_WIDTH + 1,
    top: tailOffset - (TAIL_HALF - BORDER_WIDTH),
    width: 0,
    height: 0,
    borderTop: `${TAIL_HALF - BORDER_WIDTH}px solid transparent`,
    borderBottom: `${TAIL_HALF - BORDER_WIDTH}px solid transparent`,
    [pointsLeft ? 'borderRight' : 'borderLeft']: `${TAIL_LENGTH - BORDER_WIDTH}px solid ${background}`,
  };

  return (
    <div
      style={{
        position: 'relative',
        background,
        border: `${BORDER_WIDTH}px solid ${border}`,
        borderRadius: 16,
        padding: '12px 16px',
        ...style,
      }}
    >
      <span aria-hidden style={outerTail} />
      <span aria-hidden style={innerTail} />
      {children}
    </div>
  );
}
