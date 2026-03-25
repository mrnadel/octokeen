import type { ReactNode } from 'react';
import { CoinIcon } from './CoinIcon';

/**
 * Matches money values in text:
 * 1. Dollar-prefixed: $500, $1,200, $50/month
 * 2. Temporal-suffixed: 5,000/month, 50/year, 3/day (any number)
 * 3. Comma-formatted: 1,500, 45,000, 3,500-4,000
 * 4. Standalone 3+ digit numbers: 500, 936, 1800
 * Each supports ranges (X-Y) and temporal suffixes (/month, /year, etc).
 * Excludes: percentages (50%), multipliers (3x), time periods (3 months).
 */
const MONEY_RE = /(?<![.\d/])(?:\$\d[\d,]*(?:\.\d{1,2})?(?:\/(?:month|year|day|week|paycheck))?|\d[\d,]*(?:\.\d{1,2})?(?:-\d[\d,]*(?:\.\d{1,2})?)?\/(?:month|year|day|week|paycheck)|\d{1,3}(?:,\d{3})+(?:-\d{1,3}(?:,\d{3})+)?(?:\/(?:month|year|day|week|paycheck))?|\d{3,}(?:-\d{3,})?(?:\/(?:month|year|day|week|paycheck))?)(?![%xX\d])/g;

export function MoneyText({ text }: { text: string }): ReactNode {
  if (!text) return null;

  const re = new RegExp(MONEY_RE.source, MONEY_RE.flags);
  const matches = [...text.matchAll(re)];

  if (matches.length === 0) return <>{text}</>;

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    const idx = match.index!;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }
    parts.push(
      <span key={idx} style={{ whiteSpace: 'nowrap' }}>
        {match[0]}
        <CoinIcon />
      </span>
    );
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
