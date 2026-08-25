import React from 'react';
import { C, NUNITO } from '../theme';

/**
 * Text styled to read like TikTok's own text tool rather than like a designed
 * lower-third: white, heavy, with a translucent black highlight hugging each
 * line. Native-looking overlays are part of why creator-style creative beats
 * studio creative here, so the ad's own copy should not announce itself as
 * agency work.
 *
 * Lines are rendered individually so each highlight wraps its own line, which
 * is what TikTok's editor does and what viewers are used to seeing.
 */
export const NativeText: React.FC<{
  lines: string[];
  size?: number;
  align?: 'center' | 'left';
  highlight?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({
  lines,
  size = 58,
  align = 'center',
  highlight = 'rgba(0,0,0,0.72)',
  color = C.white,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      gap: 4,
      fontFamily: NUNITO,
      ...style,
    }}
  >
    {lines.map((line, i) => (
      <span
        key={i}
        style={{
          background: highlight,
          color,
          fontSize: size,
          fontWeight: 900,
          lineHeight: 1.24,
          letterSpacing: '-0.01em',
          padding: '4px 16px',
          borderRadius: 8,
          textAlign: align,
        }}
      >
        {line}
      </span>
    ))}
  </div>
);
