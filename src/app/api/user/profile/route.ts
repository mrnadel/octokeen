import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, accounts } from '@/lib/db/schema';
import { getAuthUserId } from '@/lib/auth-utils';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const patchProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  country: z.string().nullable().optional(),
  profilePublic: z.boolean().optional(),
  image: z.string().nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'No valid fields to update' }
);

// ─── Limits ──────────────────────────────────────────────────
const MAX_IMAGE_BYTES = 100 * 1024; // 100 KB max stored size (base64 data URL)
const ALLOWED_MIME_PREFIXES = ['data:image/jpeg', 'data:image/png', 'data:image/webp'];

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [user] = await db
    .select({ hasPasswordHash: isNotNull(users.passwordHash), country: users.country, profilePublic: users.profilePublic, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Check if user has a credentials (email/password) account vs OAuth-only
  const oauthAccounts = await db
    .select({ provider: accounts.provider })
    .from(accounts)
    .where(eq(accounts.userId, userId));

  const isOAuthOnly = oauthAccounts.length > 0 && !user?.hasPasswordHash;

  return NextResponse.json({
    hasPassword: !isOAuthOnly && !!user?.hasPasswordHash,
    country: user?.country ?? null,
    profilePublic: user?.profilePublic ?? true,
    emailVerified: user?.emailVerified ? true : false,
  });
}

export async function PATCH(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`user-profile:${userId}`, RATE_LIMITS.api);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000).toString() },
    });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parseResult = patchProfileSchema.safeParse(rawBody);
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const body = parseResult.data;

  // ── Handle display name update ──
  if (body.displayName !== undefined) {
    const displayName = body.displayName;
    if (typeof displayName !== 'string') {
      return NextResponse.json(
        { error: 'Display name must be a string' },
        { status: 400 }
      );
    }
    if (!displayName || displayName.length < 2 || displayName.length > 50) {
      return NextResponse.json(
        { error: 'Display name must be 2-50 characters' },
        { status: 400 }
      );
    }
    await db
      .update(users)
      .set({ displayName, name: displayName, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return NextResponse.json({ ok: true });
  }

  // ── Handle country update ──
  if (body.country !== undefined) {
    const country = body.country as string | null;
    if (country !== null && (typeof country !== 'string' || !/^[A-Z]{2,3}$/.test(country))) {
      return NextResponse.json(
        { error: 'Country must be a valid code (e.g. US, IL, GB, INT)' },
        { status: 400 }
      );
    }
    await db
      .update(users)
      .set({ country, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return NextResponse.json({ ok: true });
  }

  // ── Handle profilePublic update ──
  if (body.profilePublic !== undefined) {
    const profilePublic = body.profilePublic === true;
    await db
      .update(users)
      .set({ profilePublic, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return NextResponse.json({ ok: true });
  }

  // ── Handle profile image update ──
  if (body.image !== undefined) {
    const { image } = body;

    // Allow clearing the image
    if (image === null) {
      await db
        .update(users)
        .set({ image: null, updatedAt: new Date() })
        .where(eq(users.id, userId));
      return NextResponse.json({ ok: true, image: null });
    }

    // Validate it's a data URL with allowed MIME type
    if (typeof image !== 'string') {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    const hasValidPrefix = ALLOWED_MIME_PREFIXES.some((p) => image.startsWith(p));
    if (!hasValidPrefix) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, or WebP images are allowed' },
        { status: 400 }
      );
    }

    // Check size (the full data URL string length in bytes)
    const byteSize = Buffer.byteLength(image, 'utf-8');
    if (byteSize > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: `Image too large (${Math.round(byteSize / 1024)}KB). Max is ${MAX_IMAGE_BYTES / 1024}KB after compression.` },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({ image, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return NextResponse.json({ ok: true, image });
  }

  return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
}
