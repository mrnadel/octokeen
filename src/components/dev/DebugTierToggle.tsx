'use client';

import { useState } from 'react';
import { useSubscriptionStore } from '@/hooks/useSubscription';
import type { SubscriptionTier } from '@/lib/subscription';

const TIERS: { value: SubscriptionTier | null; label: string }[] = [
  { value: null, label: 'Real' },
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
];

export function DebugTierToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { debugTierOverride, setDebugTierOverride } = useSubscriptionStore();

  if (process.env.NODE_ENV !== 'development') return null;

  const currentLabel = TIERS.find((t) => t.value === debugTierOverride)?.label ?? 'Real';
  const isOverriding = debugTierOverride !== null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[160px]">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Test as
          </p>
          {TIERS.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => {
                setDebugTierOverride(value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                debugTierOverride === value
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
              {value === null && (
                <span className="text-[10px] text-gray-400 ml-1">(no override)</span>
              )}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold shadow-lg transition-colors ${
          isOverriding
            ? 'bg-amber-500 text-white hover:bg-amber-600'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <span className="text-sm">&#x1F527;</span>
        {isOverriding ? currentLabel.toUpperCase() : 'DEV'}
      </button>
    </div>
  );
}
