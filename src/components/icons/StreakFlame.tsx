/**
 * Streak flame icon with 4 visual states.
 * Based on the brand flame design — used everywhere streaks are shown.
 */
export type StreakState = 'active' | 'weak' | 'lost' | 'none';

interface StreakFlameProps {
  state?: StreakState;
  size?: number;
  className?: string;
}

export function StreakFlame({ state = 'active', size = 24, className }: StreakFlameProps) {
  const id = `sf-${state}-${size}`;

  if (state === 'none') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <path
          d="M16 4C16 4 10 10 10 17C10 20.3 11.5 23.1 14 24.8C14 24.8 13 22 14.5 19C15.5 17 16 15.5 16 15.5C16 15.5 16.5 17 17.5 19C19 22 18 24.8 18 24.8C20.5 23.1 22 20.3 22 17C22 10 16 4 16 4Z"
          stroke="#C8C8C8"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  if (state === 'lost') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 36" fill="none" className={className}>
        <defs>
          <linearGradient id={`${id}-g`} x1="16" y1="6" x2="16" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5C78A" />
            <stop offset="1" stopColor="#F0B070" />
          </linearGradient>
        </defs>
        {/* Smoke blob */}
        <ellipse cx="15" cy="5" rx="3.5" ry="2.5" fill="#C8C8C8" opacity="0.55" />
        <ellipse cx="17.5" cy="3.5" rx="2.5" ry="2" fill="#D4D4D4" opacity="0.4" />
        {/* Faded flame */}
        <path
          d="M16 8C16 8 10 14 10 20C10 23.3 11.5 25.8 14 27.5C14 27.5 13 24.5 14.5 22C15.5 20 16 18.5 16 18.5C16 18.5 16.5 20 17.5 22C19 24.5 18 27.5 18 27.5C20.5 25.8 22 23.3 22 20C22 14 16 8 16 8Z"
          fill={`url(#${id}-g)`}
          opacity="0.55"
        />
        {/* Inner core */}
        <path
          d="M16 17C16 17 14 19 14 21.5C14 23 14.8 24 16 24.5C16 24.5 15.5 23.5 16 22.5C16.5 21.5 17 20.5 17 20.5C17 20.5 17.5 21.5 18 22.5C18.5 23.5 18 24.5 18 24.5C19.2 24 20 23 20 21.5C20 19 16 17 16 17Z"
          fill="#F5D4A0"
          opacity="0.5"
        />
      </svg>
    );
  }

  // Active and Weak share the same flame, just different in sparkles and scale
  const flameScale = state === 'weak' ? 0.88 : 1;
  const vb = state === 'weak' ? '2 2 28 28' : '0 0 32 32';

  return (
    <svg width={size} height={size} viewBox={vb} fill="none" className={className}>
      <defs>
        <linearGradient id={`${id}-outer`} x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9F1C" />
          <stop offset="0.55" stopColor="#F57C00" />
          <stop offset="1" stopColor="#E65100" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="16" y1="16" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFEB3B" />
          <stop offset="1" stopColor="#FFC107" />
        </linearGradient>
      </defs>

      {/* Main flame */}
      <path
        d="M16 4C16 4 10 10 10 17C10 20.3 11.5 23.1 14 24.8C14 24.8 13 22 14.5 19C15.5 17 16 15.5 16 15.5C16 15.5 16.5 17 17.5 19C19 22 18 24.8 18 24.8C20.5 23.1 22 20.3 22 17C22 10 16 4 16 4Z"
        fill={`url(#${id}-outer)`}
      />

      {/* Inner bright core */}
      <path
        d="M16 15C16 15 13.5 18 13.5 20.5C13.5 22.2 14.5 23.5 16 24C16 24 15.3 22.5 16 21C16.5 20 17 19 17 19C17 19 17.5 20 18 21C18.7 22.5 18 24 18 24C19.5 23.5 20.5 22.2 20.5 20.5C20.5 18 16 15 16 15Z"
        fill={`url(#${id}-inner)`}
      />

      {/* Sparkles (active only) */}
      {state === 'active' && (
        <>
          <path d="M22.5 7L23.2 8.8L25 9.5L23.2 10.2L22.5 12L21.8 10.2L20 9.5L21.8 8.8Z" fill="#FFB74D" />
          <path d="M25 4L25.5 5.2L26.7 5.7L25.5 6.2L25 7.4L24.5 6.2L23.3 5.7L24.5 5.2Z" fill="#FFD54F" />
        </>
      )}
    </svg>
  );
}
