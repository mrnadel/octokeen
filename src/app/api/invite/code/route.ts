import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit } from '@/lib/rate-limit';

function generateInviteCode(): string {
  return crypto.randomBytes(6).toString('base64url').slice(0, 8);
}

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`invite-code:${userId}`, { limit: 10, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const [user] = await db
    .select({ inviteCode: users.inviteCode })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user?.inviteCode) {
    return NextResponse.json({ code: user.inviteCode });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode();
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
