'use client';

import { Users } from 'lucide-react';
import useSWR from 'swr';
import InviteShare from '@/components/friends/InviteShare';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { EmptyState } from '@/components/ui/EmptyState';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import { LeaderboardCard } from '@/components/ui/LeaderboardCard';
import { UserAvatar } from '@/components/ui/UserAvatar';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Request failed: ${r.status}`);
    return r.json();
  });

const FRIENDS_ICON = <span className="text-3xl">👥</span>;

interface LeaderboardEntry {
  id: string;
  displayName: string;
  image: string | null;
  weeklyXp: number;
  isUser: boolean;
}

export function FriendLeaderboard() {
  const { data, error, isLoading, mutate } = useSWR('/api/friends/weekly-xp', fetcher);
  const leaderboard: LeaderboardEntry[] = data?.leaderboard ?? [];

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return <ErrorRetry title="Failed to load leaderboard" onRetry={() => mutate()} />;
  }

  if (leaderboard.length <= 1) {
    return (
      <EmptyState
        icon={
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary-500" />
          </div>
        }
        title="No friends yet"
        subtitle="Invite friends to see how you stack up!"
        action={<InviteShare />}
      />
    );
  }

  return (
    <LeaderboardCard
      icon={FRIENDS_ICON}
      title="Friends Leaderboard"
      subtitle="Weekly XP ranking"
      headerClassName="bg-primary-50/50 dark:bg-primary-900/20"
    >
      {leaderboard.map((entry, idx) => {
        const rank = idx + 1;
        const isTop3 = rank <= 3;
        return (
          <LeaderboardRow
            key={entry.id}
            rank={rank}
            name={entry.displayName}
            xp={entry.weeklyXp}
            isUser={entry.isUser}
            avatar={
              <UserAvatar
                image={entry.image}
                name={entry.displayName}
                size={isTop3 ? 36 : 32}
                bgColor={entry.isUser ? '#C7D2FE' : '#DBEAFE'}
              />
            }
          />
        );
      })}
    </LeaderboardCard>
  );
}
