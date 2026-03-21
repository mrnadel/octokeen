'use client';

import { motion } from 'framer-motion';
import type { Quest } from '@/data/engagement-types';

interface Props {
  quest: Quest;
  onClaim: (questId: string) => void;
}

export function QuestCard({ quest, onClaim }: Props) {
  const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
  const isComplete = quest.completed;
  const isClaimed = quest.claimed;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
      style={{ minHeight: 72 }}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-xl"
        style={{ background: isComplete ? '#DCFCE7' : '#F0F7FF' }}
      >
        {quest.icon}
      </div>

      {/* Center: title + description + progress bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-bold text-gray-800 truncate">{quest.title}</span>
        </div>
        <p className="text-xs text-gray-500 mb-1.5 truncate">{quest.description}</p>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: isComplete ? '#10B981' : '#3B82F6',
              }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-400 flex-shrink-0">
            {quest.progress}/{quest.target}
          </span>
        </div>
      </div>

      {/* Right: reward badge or claim button or checkmark */}
      <div className="flex-shrink-0 flex items-center">
        {isClaimed ? (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100">
            <span className="text-emerald-600 text-base">✓</span>
          </div>
        ) : isComplete ? (
          <motion.button
            onClick={() => onClaim(quest.definitionId)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: '#10B981', border: 'none', cursor: 'pointer' }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            whileTap={{ scale: 0.95 }}
          >
            Claim
          </motion.button>
        ) : (
          <div
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: '#FEF3C7', color: '#92400E' }}
          >
            <span>💎</span>
            <span>{quest.reward.gems}</span>
          </div>
        )}
      </div>
    </div>
  );
}
