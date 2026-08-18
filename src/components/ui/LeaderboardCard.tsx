'use client';

import type { CSSProperties, ReactNode } from 'react';

/** Outer surface shared by every leaderboard-style board (and its skeleton). */
export const LEADERBOARD_CARD_CLASS =
  'bg-white dark:bg-surface-900 rounded-2xl border border-gray-100 dark:border-surface-700 shadow-sm overflow-hidden';

/** Header strip shared by every leaderboard-style board (and its skeleton). */
export const LEADERBOARD_HEADER_CLASS =
  'px-4 py-4 flex items-center gap-3 border-b border-gray-100 dark:border-surface-700';

interface LeaderboardCardProps {
  /** Leading visual — emoji span, league image, avatar, etc. */
  icon: ReactNode;
  title: string;
  subtitle: ReactNode;
  /** Extra classes appended to the header strip (e.g. a tinted background). */
  headerClassName?: string;
  /** Inline header styles, for tints that must be computed at runtime. */
  headerStyle?: CSSProperties;
  /** The rows — typically a list of <LeaderboardRow>. */
  children: ReactNode;
}

export function LeaderboardCard({
  icon,
  title,
  subtitle,
  headerClassName = '',
  headerStyle,
  children,
}: LeaderboardCardProps) {
  return (
    <div className={LEADERBOARD_CARD_CLASS}>
      <div
        className={`${LEADERBOARD_HEADER_CLASS}${headerClassName ? ` ${headerClassName}` : ''}`}
        style={headerStyle}
      >
        {icon}
        <div>
          <h2 className="text-lg font-extrabold text-gray-800 dark:text-surface-50">{title}</h2>
          <p className="text-xs text-gray-500 dark:text-surface-400">{subtitle}</p>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
