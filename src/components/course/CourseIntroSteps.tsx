'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import {
  COUNTRY_OPTIONS,
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  COMMITMENT_OPTIONS,
  type CountryCode,
  type ExperienceLevel,
  type PlacementChoice,
  type GoalChoice,
  type CommitmentChoice,
} from '@/data/course-intro-options';
import { SignalBars } from './SignalBars';

// ── Step: Country Selection (personal-finance only) ──────────
// Grid of country cards with flag + label

export function StepCountry({
  selected,
  onSelect,
  accent,
}: {
  selected: CountryCode | null;
  onSelect: (v: CountryCode) => void;
  accent: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {COUNTRY_OPTIONS.map((opt) => {
        const active = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all"
            style={{
              backgroundColor: active ? `color-mix(in srgb, ${accent} 6%, white)` : 'white',
              border: active ? `2px solid ${accent}` : '2px solid #E2E8F0',
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-2xl">{opt.flag}</span>
            <span className="text-xs font-bold text-surface-700 leading-tight">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Step: Experience Level ───────────────────────────────────
// Cards with signal bars, title + subtitle, colored left border on active

export function StepExperience({
  selected,
  onSelect,
  accent,
}: {
  selected: ExperienceLevel | null;
  onSelect: (v: ExperienceLevel) => void;
  accent: string;
}) {
  return (
    <div className="space-y-2">
      {EXPERIENCE_OPTIONS.map((opt) => {
        const active = selected === opt.level;
        return (
          <motion.button
            key={opt.level}
            onClick={() => onSelect(opt.level)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
            style={{
              backgroundColor: active ? `color-mix(in srgb, ${accent} 6%, white)` : 'white',
              border: active ? `2px solid ${accent}` : '2px solid #E2E8F0',
              borderLeftWidth: active ? '4px' : '2px',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <SignalBars count={opt.bars} color={active ? accent : '#CBD5E1'} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-surface-800">{opt.label}</p>
              <p className="text-xs text-surface-400">{opt.sub}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Step: Placement Choice ───────────────────────────────────
// Larger cards with emoji icon box, title + subtitle

export function StepPlacement({
  selected,
  onSelect,
  experience,
  accent,
}: {
  selected: PlacementChoice | null;
  onSelect: (v: PlacementChoice) => void;
  experience: ExperienceLevel;
  accent: string;
}) {
  const options: { value: PlacementChoice; icon: string; title: string; subtitle: string }[] = [
    { value: 'scratch', icon: '📖', title: 'Start from scratch', subtitle: 'Begin with the fundamentals' },
    { value: 'test', icon: '🧭', title: 'Find my level', subtitle: 'Quick placement test to skip ahead' },
  ];

  if (experience >= 3) {
    options.push({ value: 'advanced', icon: '🚀', title: 'Jump to advanced', subtitle: 'Skip straight to the later units' });
  }

  return (
    <div className="space-y-2.5">
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all"
            style={{
              backgroundColor: active ? `color-mix(in srgb, ${accent} 6%, white)` : 'white',
              border: active ? `2px solid ${accent}` : '2px solid #E2E8F0',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: active ? `color-mix(in srgb, ${accent} 12%, white)` : '#F1F5F9' }}
            >
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-surface-800">{opt.title}</p>
              <p className="text-xs text-surface-400 mt-0.5">{opt.subtitle}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Step: Goal ─────────────────────────────────────────────
// Horizontal cards with emoji + text, 2-column grid

export function StepGoal({
  selected,
  onSelect,
  accent,
}: {
  selected: GoalChoice | null;
  onSelect: (v: GoalChoice) => void;
  accent: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {GOAL_OPTIONS.map((opt) => {
        const active = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all"
            style={{
              backgroundColor: active ? `color-mix(in srgb, ${accent} 6%, white)` : 'white',
              border: active ? `2px solid ${accent}` : '2px solid #E2E8F0',
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-xs font-bold text-surface-700 leading-tight">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Step: Daily Commitment ────────────────────────────────────
// Horizontal row of square-ish cards

export function StepCommitment({
  selected,
  onSelect,
  accent,
}: {
  selected: CommitmentChoice | null;
  onSelect: (v: CommitmentChoice) => void;
  accent: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {COMMITMENT_OPTIONS.map((opt) => {
        const active = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl text-center transition-all"
            style={{
              backgroundColor: active ? `color-mix(in srgb, ${accent} 6%, white)` : 'white',
              border: active ? `2px solid ${accent}` : '2px solid #E2E8F0',
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-sm font-extrabold text-surface-800">{opt.label}</span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: active ? `color-mix(in srgb, ${accent} 15%, white)` : '#F1F5F9',
                color: active ? accent : '#94A3B8',
              }}
            >
              {opt.tag}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Step: Launch ─────────────────────────────────────────────
// Summary card with stats, accent-colored header

export function StepLaunch({
  professionName,
  commitment,
  placement,
  accent,
}: {
  professionName: string;
  commitment: CommitmentChoice;
  placement: PlacementChoice;
  accent: string;
}) {
  return (
    <div>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
        className="text-center mb-5"
      >
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, white)` }}
        >
          <Rocket className="w-8 h-8" style={{ color: accent }} />
        </div>
      </motion.div>

      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <div className="px-5 py-4 text-center" style={{ backgroundColor: `color-mix(in srgb, ${accent} 8%, white)` }}>
          <h3 className="text-lg font-extrabold text-surface-900">Ready to go!</h3>
          <p className="text-xs text-surface-500 mt-1">
            {placement === 'test' ? "We'll find your level first." : "Starting from the beginning."}
          </p>
        </div>
        <div className="px-5 py-4 flex divide-x divide-surface-200">
          <div className="flex-1 text-center">
            <p className="text-xl font-extrabold text-surface-900">{commitment}</p>
            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">min/day</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xl font-extrabold text-surface-900">{professionName.split(' ')[0]}</p>
            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">course</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xl font-extrabold text-surface-900">
              {placement === 'scratch' ? '1' : placement === 'advanced' ? '6+' : '?'}
            </p>
            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">start unit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
