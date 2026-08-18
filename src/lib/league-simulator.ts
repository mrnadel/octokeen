// ============================================================
// League Simulator — Pure Logic (no React, no store imports)
// ============================================================

import { LeagueCompetitor, LeagueTier } from '@/data/engagement-types';
import { fnv1a } from '@/lib/hash';
import {
  leagueTiers,
  competitorNames,
  competitorFlags,
  COMPETITORS_PER_LEAGUE,
} from '@/data/league';

// --------------- PRNG ---------------

/**
 * Mulberry32 seeded PRNG. Returns a function that produces 0–1 values.
 */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/** Hash a string to a numeric seed using FNV-1a. */
export const hashSeed = fnv1a;

/** Days in a league week. */
export const DAYS_PER_WEEK = 7;

const MS_PER_DAY = 86_400_000;

/** Fisher-Yates shuffle driven by a seeded RNG. Returns a new array. */
export function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// --------------- Tier Config ---------------

export function getTierConfig(tier: 1 | 2 | 3 | 4 | 5): LeagueTier {
  const config = leagueTiers.find((t) => t.tier === tier);
  if (!config) throw new Error(`Unknown league tier: ${tier}`);
  return config;
}

/**
 * Midpoint of a tier's weekly XP range — the anchor every competitor-XP
 * simulation scales from. Single source for client sim, server bot population
 * and fake-user weekly progression.
 */
export function getTierMidpointXp(tierConfig: LeagueTier): number {
  return (tierConfig.xpRange.min + tierConfig.xpRange.max) / 2;
}

// --------------- Competitor Generation ---------------

type ActivityBucket = 'light' | 'moderate' | 'active';

export interface BucketConfig {
  rateMultiplier: number;
  varianceMultiplier: number;
}

const BUCKET_CONFIGS: Record<ActivityBucket, BucketConfig> = {
  light:    { rateMultiplier: 0.4, varianceMultiplier: 0.5 },
  moderate: { rateMultiplier: 1.0, varianceMultiplier: 0.3 },
  active:   { rateMultiplier: 1.8, varianceMultiplier: 0.4 },
};

// Distribution: 20% light, 40% moderate, 40% active (of 29 competitors)
function getBucket(index: number, total: number): ActivityBucket {
  const ratio = index / total;
  if (ratio < 0.20) return 'light';
  if (ratio < 0.60) return 'moderate';
  return 'active';
}

/**
 * Activity profile for competitor `index` of `total`.
 * Single source of truth for the client simulator and the server-side
 * league-matching bot population.
 */
export function getActivityBucketConfig(index: number, total: number): BucketConfig {
  return BUCKET_CONFIGS[getBucket(index, total)];
}

/**
 * Generate 29 simulated competitors for the given week and tier.
 * The user is the 30th slot (not included here).
 */
export function generateCompetitors(
  weekStartDate: string,
  tier: 1 | 2 | 3 | 4 | 5,
): LeagueCompetitor[] {
  const tierConfig = getTierConfig(tier);
  const baseSeed = hashSeed(`${weekStartDate}-${tier}`);
  const rng = seededRandom(baseSeed);

  const count = COMPETITORS_PER_LEAGUE - 1; // 29 competitors
  const competitors: LeagueCompetitor[] = [];

  // Pre-shuffle name and flag pools using the seeded RNG
  const namePool = seededShuffle(competitorNames, rng);
  const flagPool = seededShuffle(competitorFlags, rng);

  // Base daily rate so a 7-day week lands near midpoint
  const baseDailyRate = getTierMidpointXp(tierConfig) / DAYS_PER_WEEK;

  for (let i = 0; i < count; i++) {
    const { rateMultiplier, varianceMultiplier } = getActivityBucketConfig(i, count);

    const dailyXpRate = baseDailyRate * rateMultiplier * (0.8 + rng() * 0.4);
    const variance = dailyXpRate * varianceMultiplier;

    const name = namePool[i % namePool.length];
    const flag = flagPool[i % flagPool.length];

    competitors.push({
      id: `bot-${weekStartDate}-${tier}-${i}`,
      name,
      avatarInitial: name.charAt(0).toUpperCase(),
      countryFlag: flag,
      weeklyXp: 0, // computed by simulateCompetitorXp
      dailyXpRate,
      variance,
    });
  }

  return competitors;
}

// --------------- XP Simulation ---------------

/**
 * Deterministically compute each competitor's weeklyXp for all elapsed days
 * since weekStartDate (max 7 days). Uses a seeded PRNG per competitor+day.
 * 10% chance to skip a day entirely.
 */
export function simulateCompetitorXp(
  competitors: LeagueCompetitor[],
  weekStartDate: string,
): LeagueCompetitor[] {
  const now = new Date();
  const weekStart = new Date(weekStartDate + 'T00:00:00Z');
  const msElapsed = now.getTime() - weekStart.getTime();
  const daysElapsed = Math.min(DAYS_PER_WEEK, Math.max(0, Math.floor(msElapsed / MS_PER_DAY)));

  return competitors.map((competitor) => {
    let weeklyXp = 0;

    for (let day = 0; day < daysElapsed; day++) {
      const daySeed = hashSeed(`${competitor.id}-day${day}`);
      const rng = seededRandom(daySeed);

      // 10% chance to skip the day
      if (rng() < 0.1) continue;

      // Daily XP = rate ± variance (gaussian approximation via Box-Muller)
      const u1 = rng();
      const u2 = rng();
      const normal = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
      const dayXp = Math.max(0, Math.round(competitor.dailyXpRate + normal * competitor.variance));
      weeklyXp += dayXp;
    }

    return { ...competitor, weeklyXp };
  });
}

// --------------- Rank Calculation ---------------

/**
 * Return the user's 1-based rank given their XP and the competitor list.
 * Higher XP = better rank.
 */
export function getUserRank(
  userXp: number,
  competitors: LeagueCompetitor[],
): number {
  const higherCount = competitors.filter((c) => c.weeklyXp > userXp).length;
  return higherCount + 1;
}

// --------------- Week Result ---------------

export function getWeekResult(
  rank: number,
  currentTier: 1 | 2 | 3 | 4 | 5,
): { promoted: boolean; demoted: boolean; newTier: 1 | 2 | 3 | 4 | 5 } {
  const tierConfig = getTierConfig(currentTier);

  const promoted = rank <= tierConfig.promoteCount && currentTier < 5;
  const demoted =
    rank > COMPETITORS_PER_LEAGUE - tierConfig.demoteCount &&
    tierConfig.demoteCount > 0 &&
    currentTier > 1;

  let newTier: 1 | 2 | 3 | 4 | 5 = currentTier;
  if (promoted) {
    newTier = (currentTier + 1) as 1 | 2 | 3 | 4 | 5;
  } else if (demoted) {
    newTier = (currentTier - 1) as 1 | 2 | 3 | 4 | 5;
  }

  return { promoted, demoted, newTier };
}
