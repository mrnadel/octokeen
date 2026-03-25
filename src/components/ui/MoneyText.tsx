import type { ReactNode } from 'react';
import { CoinIcon } from './CoinIcon';

/**
 * Matches money values in text. Two capture groups:
 *   (1) the number part (where the coin goes after)
 *   (2) optional temporal suffix like /month, /year (rendered after the coin)
 *
 * Patterns: $500, 5,000/month, 1,500, 500, 3,500-4,000/year
 * Excludes: percentages (50%), multipliers (3x), time periods (3 months).
 */
const MONEY_RE = /(?<![.\d/])(\$?\d[\d,]*(?:\.\d{1,2})?(?:-\d[\d,]*(?:\.\d{1,2})?)?)(\/(?:month|year|day|week|paycheck))?(?![%xX\d])/g;

function isMoneyMatch(numPart: string, suffix: string | undefined, textAfter: string): boolean {
  // Always money if has $ prefix
  if (numPart.startsWith('$')) return true;
  // Always money if has temporal suffix
  if (suffix) return true;
  // Comma-formatted numbers are always money (1,500 etc)
  if (numPart.includes(',')) return true;
  // Standalone 3+ digit numbers (ignore commas for counting)
  const digits = numPart.replace(/[,.-]/g, '');
  if (digits.length >= 3) {
    // Exclude if followed by time words
    if (/^\s*(?:months?|days?|hours?|years?|minutes?|times?|people|percent)\b/i.test(textAfter)) return false;
    return true;
  }
  return false;
}

export function MoneyText({ text }: { text: string }): ReactNode {
  if (!text) return null;

  const re = new RegExp(MONEY_RE.source, MONEY_RE.flags);
  const matches = [...text.matchAll(re)];

  if (matches.length === 0) return <>{text}</>;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let hasAny = false;

  for (const match of matches) {
    const idx = match.index!;
    const fullMatch = match[0];
    const numPart = match[1];   // the number (where coin attaches)
    const suffix = match[2];     // optional /month, /year etc
    const textAfter = text.slice(idx + fullMatch.length);

    if (!isMoneyMatch(numPart, suffix, textAfter)) continue;

    hasAny = true;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }
    parts.push(
      <span key={idx} style={{ whiteSpace: 'nowrap' }}>
        {numPart}<CoinIcon />{suffix || ''}
      </span>
    );
    lastIndex = idx + fullMatch.length;
  }

  if (!hasAny) return <>{text}</>;

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
