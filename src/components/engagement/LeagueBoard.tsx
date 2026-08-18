'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLeague } from '@/store/useEngagementStore';
import { useStore } from '@/store/useStore';
import { leagueTiers } from '@/data/league';
import { getUserRank, getTierConfig } from '@/lib/league-simulator';
import { CompetitorAvatar } from './CompetitorAvatar';
import { LeagueImage } from '@/components/icons/LeagueImage';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import {
  LeaderboardCard,
  LEADERBOARD_CARD_CLASS,
  LEADERBOARD_HEADER_CLASS,
} from '@/components/ui/LeaderboardCard';
import { useIsDark } from '@/store/useThemeStore';
import { useSession } from 'next-auth/react';

// Skeleton shown while waiting for client hydration — avoids a flash from
// localStorage rehydration without blocking the whole render with a spinner.
function LeagueBoardSkeleton() {
  return (
    <div className={`${LEADERBOARD_CARD_CLASS} animate-pulse`}>
      <div className={LEADERBOARD_HEADER_CLASS}>
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-surface-700 flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-surface-700 rounded w-32" />
          <div className="h-3 bg-gray-100 dark:bg-surface-800 rounded w-48" />
        </div>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-50 dark:border-surface-800 last:border-0">
          <div className="w-6 h-4 bg-gray-100 dark:bg-surface-800 rounded" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-surface-700 flex-shrink-0" />
          <div className="flex-1 h-3 bg-gray-100 dark:bg-surface-800 rounded" />
          <div className="w-14 h-3 bg-gray-100 dark:bg-surface-800 rounded" />
        </div>
      ))}
    </div>
  );
}

export function LeagueBoard() {
  const league = useLeague();
  const { data: session } = useSession();
  const storeDisplayName = useStore((s) => s.progress.displayName);
  const displayName = session?.user?.name || storeDisplayName || 'You';
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isDark = useIsDark();
  const userRowRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setMounted(true); }, []);

  const tier = leagueTiers.find((t) => t.tier === league.currentTier) ?? leagueTiers[0];
  const tierConfig = getTierConfig(league.currentTier);

  // Header tint is derived from the tier colour, so it can't live in a class.
  const headerStyle = useMemo(
    () => ({ background: `${tier.color}${isDark ? '20' : '14'}` }),
    [tier.color, isDark],
  );

  // Memoize the sorted leaderboard entries to avoid re-sorting on every render
  const allEntries = useMemo(() => {
    const userEntry = {
      id: 'user',
      name: displayName ?? 'You',
      avatarInitial: (displayName ?? 'Y')[0].toUpperCase(),
      weeklyXp: league.weeklyXp,
      fakeUserId: undefined as string | undefined,
      realUserId: undefined as string | undefined,
      frameStyle: undefined as string | undefined,
    };
    return [
      ...league.competitors.map((c) => ({
        id: c.id,
        name: c.name,
        avatarInitial: c.avatarInitial,
        weeklyXp: c.weeklyXp,
        fakeUserId: c.fakeUserId,
        realUserId: c.realUserId,
        frameStyle: c.frameStyle,
      })),
      userEntry,
    ].sort((a, b) => b.weeklyXp - a.weeklyXp);
  }, [league.competitors, league.weeklyXp, displayName]);

  // Scroll user's row into view after mount if they're not near the top.
  // Only fires once (mounted transitions false -> true) to avoid jarring re-scrolls.
  useEffect(() => {
    if (!mounted) return;
    const userRankAfterMount = allEntries.findIndex((e) => e.id === 'user') + 1;
    if (userRankAfterMount > 5 && userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Avoid hydration mismatch — league data comes from localStorage
  if (!mounted) return <LeagueBoardSkeleton />;

  const userRank = getUserRank(league.weeklyXp, league.competitors);
  const promoteCount = tierConfig.promoteCount;
  const demoteCount = tierConfig.demoteCount;
  const totalCount = allEntries.length;

  return (
    <LeaderboardCard
      icon={<LeagueImage tier={tier} size={48} />}
      title={`${tier.name} League`}
      subtitle={`Your rank: #${userRank} of ${totalCount} · Week XP: ${league.weeklyXp}`}
      headerStyle={headerStyle}
    >
      {allEntries.map((entry, idx) => {
          const rank = idx + 1;
          const isUser = entry.id === 'user';
          const inPromoteZone = promoteCount > 0 && rank <= promoteCount;
          const inDemoteZone = demoteCount > 0 && rank > totalCount - demoteCount;
          const isTop3 = rank <= 3;

          const rowBg = isUser
            ? (isDark ? 'rgba(59, 130, 246, 0.12)' : '#EFF6FF')
            : inPromoteZone
              ? (isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)')
              : inDemoteZone
                ? (isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)')
                : 'transparent';

          return (
            <div key={entry.id} ref={isUser ? userRowRef : undefined}>
            <LeaderboardRow
              rank={rank}
              name={entry.name}
              xp={entry.weeklyXp}
              isUser={isUser}
              bgColor={rowBg}
              onClick={
                !isUser
                  ? entry.realUserId
                    ? () => router.push(`/user/${entry.realUserId}`)
                    : entry.fakeUserId
                      ? () => router.push(`/user/competitor/${entry.fakeUserId}`)
                      : undefined
                  : undefined
              }
              avatar={
                <CompetitorAvatar
                  fakeUserId={entry.fakeUserId}
                  avatarInitial={entry.avatarInitial}
                  isUser={isUser}
                  size={isTop3 ? 36 : 32}
                  frameStyle={entry.frameStyle}
                />
              }
              trailing={
                <>
                  {inPromoteZone && !isUser && (
                    <span className="text-emerald-500 text-xs leading-none">{'\u2191'}</span>
                  )}
                  {inDemoteZone && !isUser && (
                    <span className="text-red-400 text-xs leading-none">{'\u2193'}</span>
                  )}
                </>
              }
            />
            </div>
          );
        })}
    </LeaderboardCard>
  );
}
