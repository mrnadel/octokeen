import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { jsonOk, jsonError, TOO_MANY_REQUESTS } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { assignInviteCode } from '@/lib/db/invite-codes';

const REGENERATE_RATE_LIMIT = { limit: 3, windowMs: 3600_000 };

export const POST = withAuth(async (_req, { userId }): Promise<NextResponse> => {
  const rl = rateLimit(`invite-regen:${userId}`, REGENERATE_RATE_LIMIT);
  if (!rl.success) {
    return jsonError(TOO_MANY_REQUESTS, 429);
  }

  const code = await assignInviteCode(userId);
  if (!code) {
    return jsonError('Failed to generate code', 500);
  }

  return jsonOk({ code });
});
