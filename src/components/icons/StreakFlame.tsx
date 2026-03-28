/**
 * Streak flame icon with 4 visual states.
 * Uses the brand flame PNG — displayed everywhere streaks are shown.
 */
import Image from 'next/image';

export type StreakState = 'active' | 'weak' | 'lost' | 'none';

interface StreakFlameProps {
  state?: StreakState;
  size?: number;
  className?: string;
}

export function StreakFlame({ state = 'active', size = 24, className }: StreakFlameProps) {
  if (state === 'none') {
    return (
      <Image
        src="/streak-flame.png"
        alt=""
        width={size}
        height={size}
        className={className}
        draggable={false}
        style={{ opacity: 0.2, filter: 'grayscale(1)' }}
      />
    );
  }

  if (state === 'lost') {
    return (
      <Image
        src="/streak-flame.png"
        alt=""
        width={size}
        height={size}
        className={className}
        draggable={false}
        style={{ opacity: 0.4, filter: 'grayscale(0.6) brightness(1.1)' }}
      />
    );
  }

  if (state === 'weak') {
    return (
      <Image
        src="/streak-flame.png"
        alt=""
        width={size}
        height={size}
        className={className}
        draggable={false}
        style={{ opacity: 0.7, transform: `scale(0.9)` }}
      />
    );
  }

  // Active — full color, full size
  return (
    <Image
      src="/streak-flame.png"
      alt=""
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
}
