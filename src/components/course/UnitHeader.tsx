'use client';

import type { Unit } from '@/data/course/types';

interface UnitHeaderProps {
  unit: Unit;
  unitIndex: number;
  completedInUnit: number;
  totalInUnit: number;
}

export function UnitHeader({ unit, unitIndex, completedInUnit, totalInUnit }: UnitHeaderProps) {
  const progressPercent = totalInUnit > 0 ? (completedInUnit / totalInUnit) * 100 : 0;
  const circumference = 2 * Math.PI * 16; // radius = 16
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      className="mx-4 my-6 rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${unit.color}12, ${unit.color}08)`,
        borderLeft: `4px solid ${unit.color}`,
        border: `1px solid ${unit.color}20`,
        borderLeftWidth: 4,
        borderLeftColor: unit.color,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-4">
        {/* Left: Icon + unit number */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{
            width: 48,
            height: 48,
            backgroundColor: `${unit.color}18`,
            fontSize: '1.5rem',
          }}
        >
          {unit.icon}
        </div>

        {/* Center: Title + description */}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-0.5"
            style={{ color: unit.color }}
          >
            Unit {unitIndex + 1}
          </p>
          <h2 className="text-sm font-bold text-surface-900 leading-snug truncate">
            {unit.title}
          </h2>
          <p className="text-xs text-surface-500 leading-snug mt-0.5 line-clamp-1">
            {unit.description}
          </p>
        </div>

        {/* Right: Circular progress */}
        <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
          <div className="relative" style={{ width: 40, height: 40 }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              className="transform -rotate-90"
              aria-hidden="true"
            >
              {/* Background circle */}
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              {/* Progress arc */}
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke={unit.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
              />
            </svg>
            {/* Center text */}
            <div
              className="absolute inset-0 flex items-center justify-center text-xs font-bold"
              style={{ color: unit.color }}
            >
              {completedInUnit}/{totalInUnit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
