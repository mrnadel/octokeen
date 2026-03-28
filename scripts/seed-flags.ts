import { db } from '../src/lib/db';
import { featureFlags } from '../src/lib/db/schema';
import { FLAG_DEFINITIONS } from '../src/lib/feature-flags';
import { sql } from 'drizzle-orm';

async function seedFlags() {
  console.log('Seeding feature flags...');

  // Create table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS feature_flags (
      key text PRIMARY KEY NOT NULL,
      enabled boolean DEFAULT true NOT NULL,
      description text DEFAULT '' NOT NULL,
      category text DEFAULT 'general' NOT NULL,
      updated_at timestamp DEFAULT now()
    )
  `);

  // Upsert all flag definitions (don't overwrite existing enabled values)
  for (const def of FLAG_DEFINITIONS) {
    await db
      .insert(featureFlags)
      .values({
        key: def.key,
        enabled: def.enabled,
        description: def.description,
        category: def.category,
      })
      .onConflictDoUpdate({
        target: featureFlags.key,
        set: {
          description: def.description,
          category: def.category,
        },
      });
  }

  const rows = await db.select().from(featureFlags);
  console.log(`Seeded ${rows.length} feature flags:`);
  for (const row of rows) {
    console.log(`  ${row.enabled ? '✓' : '✗'} ${row.key}`);
  }

  process.exit(0);
}

seedFlags().catch((e) => {
  console.error('Failed to seed flags:', e);
  process.exit(1);
});
