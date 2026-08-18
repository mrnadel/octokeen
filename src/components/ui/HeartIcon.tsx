import type { CSSProperties } from 'react';

/**
 * The heart glyph, defined once. Every heart in the product renders from this
 * path — do not paste the `d` attribute anywhere else.
 */
const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

interface HeartIconProps {
  /** Explicit px size. When omitted the icon sizes from `className`. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function HeartIcon({ size, className, style }: HeartIconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
    >
      <path d={HEART_PATH} />
    </svg>
  );
}
