'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { LeagueBoard } from '@/components/engagement/LeagueBoard';
import { LeaguePromotion } from '@/components/engagement/LeaguePromotion';
import { FriendLeaderboard } from '@/components/engagement/FriendLeaderboard';

function getWeekDateRange(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return `${fmt(monday)} – ${fmt(sunday)}`;
}

export default function LeaguePage() {
  const weekRange = useMemo(() => getWeekDateRange(), []);
  const [tab, setTab] = useState<'league' | 'friends'>('league');

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 bg-white px-4 sm:px-5 py-3"
        style={{ borderBottom: '2px solid #E5E5E5' }}
      >
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Link
            href="/"
            className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-[10px] transition-transform active:scale-90 lg:hidden"
            style={{ background: '#F0F0F0' }}
          >
            <ChevronLeft style={{ width: 20, height: 20, color: '#777' }} />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold" style={{ color: '#3C3C3C', lineHeight: 1.2 }}>
              Leaderboard
            </h1>
            <p className="text-xs font-semibold mt-px" style={{ color: '#AFAFAF' }}>
              {weekRange}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 sm:px-5 pt-4 max-w-2xl mx-auto">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('league')}
            className={`flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-bold transition-colors ${
              tab === 'league'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
            }`}
          >
            League
          </button>
          <button
            onClick={() => setTab('friends')}
            className={`flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-bold transition-colors ${
              tab === 'friends'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-8 max-w-2xl mx-auto">
        {tab === 'league' ? (
          <>
            <LeagueBoard />
            <LeaguePromotion />
          </>
        ) : (
          <FriendLeaderboard />
        )}
      </div>
    </div>
  );
}
