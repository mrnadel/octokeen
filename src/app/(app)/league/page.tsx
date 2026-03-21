'use client';

import { LeagueBoard } from '@/components/engagement/LeagueBoard';
import { LeaguePromotion } from '@/components/engagement/LeaguePromotion';

export default function LeaguePage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <LeagueBoard />
      <LeaguePromotion />
    </div>
  );
}
