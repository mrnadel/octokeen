/**
 * League server-response mapping.
 *
 * `/api/league` returns a mixed roster of real users and simulated bots.
 * This module is the single place that shape is translated into
 * `LeagueCompetitor` objects for `useEngagementStore`.
 */

import type { LeagueCompetitor, LeagueState } from '@/data/engagement-types';

type LeagueTierId = LeagueState['currentTier'];

interface LeagueMemberResponse {
  isReal?: boolean;
  userId?: string;
  id?: string;
  fakeUserId?: string;
  displayName?: string;
  avatarInitial?: string;
  countryFlag?: string;
  weeklyXp?: number;
  dailyXpRate?: number;
  variance?: number;
  frameStyle?: string;
}

export interface LeagueResponse {
  members?: LeagueMemberResponse[];
  requestingUserId?: string;
  tier?: number;
}

const MIN_TIER = 1;
const MAX_TIER = 5;

/**
 * Map the API roster to competitors, excluding the requesting user's own row.
 * Returns null when the response carries no roster.
 */
export function mapLeagueCompetitors(data: LeagueResponse | null): LeagueCompetitor[] | null {
  if (!data?.members) return null;
  const requestingUserId = data.requestingUserId;

  return data.members
    .filter((m) => !(m.isReal && m.userId === requestingUserId))
    .map((m) => ({
      id: (m.isReal ? m.userId : (m.fakeUserId || m.id)) ?? '',
      name: m.displayName ?? '',
      avatarInitial: m.avatarInitial ?? '',
      countryFlag: m.countryFlag || '',
      weeklyXp: m.weeklyXp ?? 0,
      dailyXpRate: m.dailyXpRate ?? 0,
      variance: m.variance ?? 0,
      fakeUserId: m.isReal ? undefined : m.fakeUserId,
      frameStyle: m.frameStyle,
      realUserId: m.isReal ? m.userId : undefined,
    }));
}

/** Narrow the server tier to a valid league tier, or undefined when out of range. */
export function toLeagueTier(tier: number | undefined): LeagueTierId | undefined {
  if (tier === undefined || tier < MIN_TIER || tier > MAX_TIER) return undefined;
  return tier as LeagueTierId;
}
