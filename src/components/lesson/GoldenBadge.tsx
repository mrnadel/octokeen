'use client';

import { CrownIcon } from '@/components/course/CrownIcon';

const CROWN_GRADIENT_ID = 'badgeCrownGrad';

const BADGE_STYLE = {
  gap: 4,
  padding: '4px 10px',
  borderRadius: 10,
  color: '#8B6914',
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: 0.3,
  textTransform: 'uppercase',
} as const;

function CrownGradientDef() {
  return (
    <defs>
      <linearGradient id={CROWN_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD54F" />
        <stop offset="50%" stopColor="#FFA000" />
        <stop offset="100%" stopColor="#FF8F00" />
      </linearGradient>
    </defs>
  );
}

/** "Golden" crown badge shown in the lesson top bar for mastered lessons. */
export function GoldenBadge() {
  return (
    <div className="flex-shrink-0 flex items-center golden-badge-shimmer" style={BADGE_STYLE}>
      <CrownIcon size={12} fill={`url(#${CROWN_GRADIENT_ID})`} defs={<CrownGradientDef />} />
      Golden
    </div>
  );
}
