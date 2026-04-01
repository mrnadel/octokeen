'use client';

import { CURRENCY } from '@/data/currency';

interface CurrencyIconProps {
  size?: number;
  className?: string;
}

/** Inline currency icon for use in text, buttons, and labels */
export function CurrencyIcon({ size = 20, className }: CurrencyIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={CURRENCY.icon}
      alt={CURRENCY.name}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}
