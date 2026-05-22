import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';
import {
  MAX_HEARTS,
  HEART_REGEN_INTERVAL_MS,
  BASE_XP,
  INCORRECT_ANSWER_XP_RATE,
  SPEED_BONUS,
  CONFIDENCE_BONUS,
  STAR_THRESHOLDS,
  SESSION_SIZE,
  MASTERY_VOLUME_CAP,
  ADAPTIVE_ROLLING_WINDOW,
  ADAPTIVE_STRUGGLING_THRESHOLD,
  ADAPTIVE_CRUISING_THRESHOLD,
  ADAPTIVE_CRUISING_XP_BONUS,
  ADAPTIVE_MIN_ANSWERS,
} from '../src/lib/game-config';

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('Missing POSTGRES_URL in .env.local');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

type GameConfigRow = typeof schema.gameConfig.$inferInsert;

const rows: GameConfigRow[] = [
  // ── Hearts ──────────────────────────────────────────────────
  {
    category: 'hearts',
    key: 'MAX_HEARTS',
    value: MAX_HEARTS,
    description: 'Maximum number of hearts a player can have.',
    minValue: 1,
    maxValue: 10,
  },
  {
    category: 'hearts',
    key: 'HEART_REGEN_INTERVAL_MS',
    value: HEART_REGEN_INTERVAL_MS,
    description: 'Milliseconds between each heart regeneration tick.',
    minValue: 3_600_000,
    maxValue: 86_400_000,
  },

  // ── XP ──────────────────────────────────────────────────────
  {
    category: 'xp',
    key: 'BASE_XP_BEGINNER',
    value: BASE_XP.beginner,
    description: 'Base XP awarded for a correct answer on a beginner question.',
    minValue: 1,
    maxValue: 500,
  },
  {
    category: 'xp',
    key: 'BASE_XP_INTERMEDIATE',
    value: BASE_XP.intermediate,
    description: 'Base XP awarded for a correct answer on an intermediate question.',
    minValue: 1,
    maxValue: 500,
  },
  {
    category: 'xp',
    key: 'BASE_XP_ADVANCED',
    value: BASE_XP.advanced,
    description: 'Base XP awarded for a correct answer on an advanced question.',
    minValue: 1,
    maxValue: 500,
  },
  {
    category: 'xp',
    key: 'INCORRECT_ANSWER_XP_RATE',
    value: INCORRECT_ANSWER_XP_RATE,
    description: 'Fraction of base XP awarded for an incorrect answer (0 to 1).',
    minValue: 0,
    maxValue: 1,
  },
  {
    category: 'xp',
    key: 'SPEED_BONUS_FAST_THRESHOLD_S',
    value: SPEED_BONUS.FAST_THRESHOLD_S,
    description: 'Seconds threshold for the fast speed bonus to apply.',
    minValue: 1,
    maxValue: 60,
  },
  {
    category: 'xp',
    key: 'SPEED_BONUS_FAST_MULTIPLIER',
    value: SPEED_BONUS.FAST_MULTIPLIER,
    description: 'XP multiplier applied when answering faster than FAST_THRESHOLD_S.',
    minValue: 1,
    maxValue: 3,
  },
  {
    category: 'xp',
    key: 'SPEED_BONUS_MEDIUM_THRESHOLD_S',
    value: SPEED_BONUS.MEDIUM_THRESHOLD_S,
    description: 'Seconds threshold for the medium speed bonus to apply.',
    minValue: 1,
    maxValue: 120,
  },
  {
    category: 'xp',
    key: 'SPEED_BONUS_MEDIUM_MULTIPLIER',
    value: SPEED_BONUS.MEDIUM_MULTIPLIER,
    description: 'XP multiplier applied when answering faster than MEDIUM_THRESHOLD_S.',
    minValue: 1,
    maxValue: 3,
  },
  {
    category: 'xp',
    key: 'CONFIDENCE_BONUS_CORRECT_CONFIDENT',
    value: CONFIDENCE_BONUS.CORRECT_CONFIDENT,
    description: 'XP multiplier when player is confident (>=4) and answers correctly.',
    minValue: 1,
    maxValue: 3,
  },
  {
    category: 'xp',
    key: 'CONFIDENCE_BONUS_CORRECT_SURPRISED',
    value: CONFIDENCE_BONUS.CORRECT_SURPRISED,
    description: 'XP multiplier when player is surprised (<=2) and answers correctly.',
    minValue: 1,
    maxValue: 3,
  },

  // ── Stars ────────────────────────────────────────────────────
  {
    category: 'stars',
    key: 'STAR_THRESHOLDS_THREE_STARS',
    value: STAR_THRESHOLDS.THREE_STARS,
    description: 'Minimum score percentage required to earn three stars.',
    minValue: 1,
    maxValue: 100,
  },
  {
    category: 'stars',
    key: 'STAR_THRESHOLDS_TWO_STARS',
    value: STAR_THRESHOLDS.TWO_STARS,
    description: 'Minimum score percentage required to earn two stars.',
    minValue: 1,
    maxValue: 100,
  },

  // ── Sessions ─────────────────────────────────────────────────
  {
    category: 'sessions',
    key: 'SESSION_SIZE',
    value: SESSION_SIZE,
    description: 'Number of questions per practice session.',
    minValue: 3,
    maxValue: 30,
  },

  // ── Mastery ──────────────────────────────────────────────────
  {
    category: 'mastery',
    key: 'MASTERY_VOLUME_CAP',
    value: MASTERY_VOLUME_CAP,
    description: 'Volume of attempts that caps the mastery formula.',
    minValue: 5,
    maxValue: 100,
  },

  // ── Adaptive Difficulty ───────────────────────────────────────
  {
    category: 'adaptive',
    key: 'ADAPTIVE_ROLLING_WINDOW',
    value: ADAPTIVE_ROLLING_WINDOW,
    description: 'Number of recent answers considered for rolling accuracy.',
    minValue: 3,
    maxValue: 20,
  },
  {
    category: 'adaptive',
    key: 'ADAPTIVE_STRUGGLING_THRESHOLD',
    value: ADAPTIVE_STRUGGLING_THRESHOLD,
    description: 'Rolling accuracy at or below this value triggers struggling mode.',
    minValue: 0,
    maxValue: 1,
  },
  {
    category: 'adaptive',
    key: 'ADAPTIVE_CRUISING_THRESHOLD',
    value: ADAPTIVE_CRUISING_THRESHOLD,
    description: 'Rolling accuracy at or above this value triggers cruising mode.',
    minValue: 0,
    maxValue: 1,
  },
  {
    category: 'adaptive',
    key: 'ADAPTIVE_CRUISING_XP_BONUS',
    value: ADAPTIVE_CRUISING_XP_BONUS,
    description: 'XP multiplier bonus per correct answer during cruising mode.',
    minValue: 1,
    maxValue: 5,
  },
  {
    category: 'adaptive',
    key: 'ADAPTIVE_MIN_ANSWERS',
    value: ADAPTIVE_MIN_ANSWERS,
    description: 'Minimum answers before adaptive difficulty mode activates.',
    minValue: 1,
    maxValue: 20,
  },
];

async function main() {
  console.log('=== Seeding game_config table ===\n');

  try {
    const result = await db
      .insert(schema.gameConfig)
      .values(rows)
      .onConflictDoUpdate({
        target: [schema.gameConfig.category, schema.gameConfig.key],
        set: {
          value: sql.raw(`excluded."value"`),
          description: sql.raw(`excluded."description"`),
          minValue: sql.raw(`excluded."min_value"`),
          maxValue: sql.raw(`excluded."max_value"`),
        },
      })
      .returning({ id: schema.gameConfig.id });

    console.log(`Upserted ${result.length} row(s) into game_config.\n`);
    console.log('Categories seeded:');
    const categories = [...new Set(rows.map((r) => r.category))];
    for (const cat of categories) {
      const count = rows.filter((r) => r.category === cat).length;
      console.log(`  ${cat}: ${count} key(s)`);
    }
    console.log('\n=== game_config seed complete ===');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
