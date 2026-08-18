// ============================================================
// Profile field updates — helpers for PATCH /api/user/profile
// ============================================================

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { jsonOk, jsonError } from '@/lib/api-helpers';

const MAX_IMAGE_BYTES = 100 * 1024; // 100 KB max stored size (base64 data URL)
const BYTES_PER_KB = 1024;
const ALLOWED_MIME_PREFIXES = ['data:image/jpeg', 'data:image/png', 'data:image/webp'];
const COUNTRY_CODE_PATTERN = /^[A-Z]{2,3}$/;

/** Apply a partial update to the user row. */
async function patchUser(userId: string, values: Partial<typeof users.$inferInsert>): Promise<void> {
  await db
    .update(users)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function updateDisplayName(userId: string, displayName: string): Promise<NextResponse> {
  await patchUser(userId, { displayName, name: displayName });
  return jsonOk({ ok: true });
}

export async function updateCountry(userId: string, country: string | null): Promise<NextResponse> {
  if (country !== null && !COUNTRY_CODE_PATTERN.test(country)) {
    return jsonError('Country must be a valid code (e.g. US, IL, GB, INT)', 400);
  }
  await patchUser(userId, { country });
  return jsonOk({ ok: true });
}

export async function updateProfilePublic(userId: string, profilePublic: boolean): Promise<NextResponse> {
  await patchUser(userId, { profilePublic });
  return jsonOk({ ok: true });
}

export async function updateImage(userId: string, image: string | null): Promise<NextResponse> {
  if (image === null) {
    await patchUser(userId, { image: null });
    return jsonOk({ ok: true, image: null });
  }

  if (!ALLOWED_MIME_PREFIXES.some((prefix) => image.startsWith(prefix))) {
    return jsonError('Only JPEG, PNG, or WebP images are allowed', 400);
  }

  const byteSize = Buffer.byteLength(image, 'utf-8');
  if (byteSize > MAX_IMAGE_BYTES) {
    return jsonError(
      `Image too large (${Math.round(byteSize / BYTES_PER_KB)}KB). Max is ${MAX_IMAGE_BYTES / BYTES_PER_KB}KB after compression.`,
      400,
    );
  }

  await patchUser(userId, { image });
  return jsonOk({ ok: true, image });
}
