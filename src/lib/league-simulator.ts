// ============================================================
// League Simulator — Pure Logic (no React, no store imports)
// ============================================================

import { LeagueCompetitor, LeagueTier } from '@/data/engagement-types';
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

/**
 * Hash a string to a numeric seed using FNV-1a.
 */
export function hashSeed(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash;
}

// --------------- Tier Config ---------------

export function getTierConfig(tier: 1 | 2 | 3 | 4 | 5): LeagueTier {
  const config = leagueTiers.find((t) => t.tier === tier);
  if (!config) throw new Error(`Unknown league tier: ${tier}`);
  return config;
}

// --------------- Competitor Generation ---------------

type ActivityBucket = 'light' | 'moderate' | 'active';

interface BucketConfig {
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
  const namePool = [...competitorNames];
  const flagPool = [...competitorFlags];
  for (let i = namePool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [namePool[i], namePool[j]] = [namePool[j], namePool[i]];
  }
  for (let i = flagPool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [flagPool[i], flagPool[j]] = [flagPool[j], flagPool[i]];
  }

  const { min: xpMin, max: xpMax } = tierConfig.xpRange;
  const midpointXp = (xpMin + xpMax) / 2;
  // Base daily rate so a 7-day week lands near midpoint
  const baseDailyRate = midpointXp / 7;

  for (let i = 0; i < count; i++) {
    const bucket = getBucket(i, count);
    const { rateMultiplier, varianceMultiplier } = BUCKET_CONFIGS[bucket];

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
  const daysElapsed = Math.min(7, Math.max(0, Math.floor(msElapsed / 86400000)));

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
