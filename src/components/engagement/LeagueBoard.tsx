'use client';

import { useState } from 'react';
import { useLeague } from '@/store/useEngagementStore';
import { useStore } from '@/store/useStore';
import { leagueTiers } from '@/data/league';
import { getUserRank, getTierConfig } from '@/lib/league-simulator';
import { CompetitorAvatar } from './CompetitorAvatar';
import { CompetitorPreview } from './CompetitorPreview';

export function LeagueBoard() {
  const league = useLeague();
  const displayName = useStore((s) => s.progress.displayName);
  const [previewUserId, setPreviewUserId] = useState<string | null>(null);

  const tier = leagueTiers.find((t) => t.tier === league.currentTier) ?? leagueTiers[0];
  const tierConfig = getTierConfig(league.currentTier);

  const userEntry: {
    id: string;
    name: string;
    avatarInitial: string;
    countryFlag: string;
    weeklyXp: number;
    fakeUserId?: string;
  } = {
    id: 'user',
    name: displayName ?? 'You',
    avatarInitial: (displayName ?? 'Y')[0].toUpperCase(),
    countryFlag: '🇮🇱',
    weeklyXp: league.weeklyXp,
  };

  // Build full sorted list
  const allEntries = [
    ...league.competitors.map((c) => ({
      id: c.id,
      name: c.name,
      avatarInitial: c.avatarInitial,
      countryFlag: c.countryFlag,
      weeklyXp: c.weeklyXp,
      fakeUserId: c.fakeUserId,
    })),
    userEntry,
  ].sort((a, b) => b.weeklyXp - a.weeklyXp);

  const userRank = getUserRank(league.weeklyXp, league.competitors);
  const promoteCount = tierConfig.promoteCount;
  const demoteCount = tierConfig.demoteCount;
  const totalCount = allEntries.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Board header */}
      <div
        className="px-4 py-4 flex items-center gap-3 border-b border-gray-100"
        style={{ background: `${tier.color}14` }}
      >
        <span className="text-3xl">{tier.icon}</span>
        <div>
          <h2 className="text-lg font-extrabold text-gray-800">{tier.name} League</h2>
          <p className="text-xs text-gray-500">
            Your rank: #{userRank} of {totalCount} &middot; Week XP: {league.weeklyXp}
          </p>
        </div>
      </div>

      {/* Legend */}
      {(promoteCount > 0 || demoteCount > 0) && (
        <div className="flex gap-4 px-4 py-2 border-b border-gray-50 bg-gray-50">
          {promoteCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span className="text-xs text-gray-500">Promotion zone (top {promoteCount})</span>
            </div>
          )}
          {demoteCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-400" />
              <span className="text-xs text-gray-500">Demotion zone (bottom {demoteCount})</span>
            </div>
          )}
        </div>
      )}

      {/* Scrollable leaderboard */}
      <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
        {allEntries.map((entry, idx) => {
          const rank = idx + 1;
          const isUser = entry.id === 'user';
          const inPromoteZone = promoteCount > 0 && rank <= promoteCount;
          const inDemoteZone = demoteCount > 0 && rank > totalCount - demoteCount;

          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0 ${
                !isUser ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors' : ''
              }`}
              onClick={() => {
                if (!isUser && entry.fakeUserId) {
                  setPreviewUserId(entry.fakeUserId);
                }
              }}
              style={{
                background: isUser ? '#EEF2FF' : 'transparent',
                borderLeft: inPromoteZone
                  ? '3px solid #34D399'
                  : inDemoteZone
                    ? '3px solid #F87171'
                    : '3px solid transparent',
              }}
            >
              {/* Rank */}
              <span
                className="text-sm font-bold w-6 text-center flex-shrink-0"
                style={{
                  color:
                    rank === 1
                      ? '#F59E0B'
                      : rank === 2
                        ? '#9CA3AF'
                        : rank === 3
                          ? '#CD7F32'
                          : '#D1D5DB',
                }}
              >
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
              </span>

              {/* Avatar */}
              <CompetitorAvatar
                fakeUserId={entry.fakeUserId}
                avatarInitial={entry.avatarInitial}
                isUser={isUser}
                size={32}
              />

              {/* Name + flag */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm font-semibold truncate block"
                  style={{ color: isUser ? '#4F46E5' : '#374151' }}
                >
                  {isUser ? `${entry.name} (You)` : entry.name}
                </span>
              </div>

              {/* Country flag */}
              <span className="text-base flex-shrink-0">{entry.countryFlag}</span>

              {/* XP */}
              <span className="text-sm font-bold text-gray-600 flex-shrink-0 min-w-[60px] text-right">
                {entry.weeklyXp} XP
              </span>
            </div>
          );
        })}
      </div>

      <CompetitorPreview
        fakeUserId={previewUserId}
        isOpen={previewUserId !== null}
        onClose={() => setPreviewUserId(null)}
      />
    </div>
  );
}
