import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { featureFlags } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { isAdminUserId } from '@/lib/auth-utils';
import { FLAG_DEFINITIONS } from '@/lib/feature-flags';
import { jsonOk, jsonError } from '@/lib/api-helpers';

const patchFlagSchema = z.object({
  key: z.string().min(1),
  enabled: z.boolean(),
});

// Cache headers: CDN caches for 5 min. Admin PATCH busts on next request.
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
};

/** Merge DB overrides over the compiled-in flag defaults. */
function mergeFlags(overrides: Map<string, { enabled: boolean }>): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  for (const def of FLAG_DEFINITIONS) {
    flags[def.key] = overrides.get(def.key)?.enabled ?? def.enabled;
  }
  return flags;
}

/** GET: return all flags (public, no auth needed) */
export async function GET(): Promise<NextResponse> {
  try {
    const rows = await db.select().from(featureFlags);
    const flags = mergeFlags(new Map(rows.map((r) => [r.key, r])));
    return NextResponse.json({ flags }, { headers: CACHE_HEADERS });
  } catch {
    // If DB is unavailable, return defaults
    return NextResponse.json({ flags: mergeFlags(new Map()) }, { headers: CACHE_HEADERS });
  }
}

/** PATCH: toggle a flag (admin only) */
export async function PATCH(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!isAdminUserId(session?.user?.id)) {
    return jsonError('Unauthorized', 403);
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return jsonError('Invalid JSON', 400);
  }

  const parsed = patchFlagSchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonError('Invalid body: need { key: string, enabled: boolean }', 400);
  }
  const { key, enabled } = parsed.data;

  // Validate key exists in definitions
  const definition = FLAG_DEFINITIONS.find((f) => f.key === key);
  if (!definition) {
    return jsonError(`Unknown flag: ${key}`, 400);
  }

  // Upsert: insert or update
  await db
    .insert(featureFlags)
    .values({
      key,
      enabled,
      description: definition.description,
      category: definition.category,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({ target: featureFlags.key, set: { enabled, updatedAt: new Date() } });

  return jsonOk({ key, enabled });
}
