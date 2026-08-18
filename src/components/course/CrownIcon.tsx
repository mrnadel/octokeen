import type { ReactNode } from 'react';

/**
 * The crown glyph, defined once. Both the golden-lesson node and the in-lesson
 * "Golden" badge render from these paths — do not paste the `d` attributes elsewhere.
 */
const CROWN_BAND_PATH = 'M5 16h14l-2-8-3.5 4L12 6l-1.5 6L7 8l-2 8z';
const CROWN_BASE_PATH = 'M5 16h14v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z';

interface CrownIconProps {
  size: number;
  /** Any valid SVG paint: a literal color, or `url(#gradientId)`. */
  fill: string;
  /** Rendered before the crown — use for `<defs>` such as a gradient. */
  defs?: ReactNode;
  /** Rendered over the crown, e.g. the gem circles on a golden lesson node. */
  children?: ReactNode;
}

export function CrownIcon({ size, fill, defs, children }: CrownIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {defs}
      <path d={CROWN_BAND_PATH} fill={fill} />
      <path d={CROWN_BASE_PATH} fill={fill} />
      {children}
    </svg>
  );
}
