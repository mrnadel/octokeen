import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit } from '@/lib/rate-limit';
import { jsonOk, jsonError, TOO_MANY_REQUESTS } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { assignInviteCode } from '@/lib/db/invite-codes';

const INVITE_CODE_RATE_LIMIT = { limit: 10, windowMs: 60_000 };

export const GET = withAuth(async (_req, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`invite-code:${userId}`, INVITE_CODE_RATE_LIMIT);
  if (!rl.success) {
    return jsonError(TOO_MANY_REQUESTS, 429);
  }

  const [user] = await db
    .select({ inviteCode: users.inviteCode })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user?.inviteCode) {
    return jsonOk({ code: user.inviteCode });
  }

  const code = await assignInviteCode(userId);
  if (!code) {
    return jsonError('Failed to generate code', 500);
  }

  return jsonOk({ code });
});
