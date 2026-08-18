'use client';

import { useHeartsStore } from '@/store/useHeartsStore';
import { useEffect, useState } from 'react';
import { HeartIcon } from './HeartIcon';

const HEART_LOST_STYLE = {
  transform: 'scale(1.3)',
  opacity: 0.5,
  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
} as const;

export function HeartDisplay() {
  const current = useHeartsStore((s) => s.current);
  const max = useHeartsStore((s) => s.max);
  const isUnlimited = useHeartsStore((s) => s.isUnlimited);
  const rechargeHearts = useHeartsStore((s) => s.rechargeHearts);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [prevCurrent, setPrevCurrent] = useState(current);

  // Recharge hearts on mount
  useEffect(() => {
    rechargeHearts();
  }, [rechargeHearts]);

  // Detect heart loss for animation
  useEffect(() => {
    if (current < prevCurrent) {
      setAnimatingIndex(current); // Animate the heart that just went empty
      const timer = setTimeout(() => setAnimatingIndex(null), 600);
      setPrevCurrent(current);
      return () => clearTimeout(timer);
    }
    setPrevCurrent(current);
  }, [current, prevCurrent]);

  if (isUnlimited()) {
    return (
      <div className="flex items-center gap-1" aria-label="Unlimited hearts">
        <HeartIcon className="w-5 h-5 text-red-500" />
        <span className="text-xs font-bold text-red-500">&infin;</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" aria-label={`${current} hearts remaining`}>
      <HeartIcon
        className={`w-5 h-5 transition-all duration-300 ${
          current > 0 ? 'text-red-500' : 'text-gray-300'
        }`}
        style={animatingIndex !== null ? HEART_LOST_STYLE : undefined}
      />
      <span className={`text-sm font-bold ${current > 0 ? 'text-red-500' : 'text-gray-300'}`}>
        {current}
      </span>
    </div>
  );
}
