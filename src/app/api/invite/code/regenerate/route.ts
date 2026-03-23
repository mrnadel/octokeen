import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit } from '@/lib/rate-limit';

export async function POST() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`invite-regen:${userId}`, { limit: 3, windowMs: 3600_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = crypto.randomBytes(6).toString('base64url').slice(0, 8);
    try {
      await db
        .update(users)
        .set({ inviteCode: code })
        .where(eq(users.id, userId));
      return NextResponse.json({ code });
    } catch (err: any) {
      if (err?.code === '23505') continue;
      throw err;
    }
  }

  return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
}
