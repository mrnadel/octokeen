import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { jsonOk, jsonError } from '@/lib/api-helpers';
import { withAdminAuth } from '@/lib/api/guards';
import { upsertSubscription } from '@/lib/db/queries';

// DEV ONLY: Grant Pro to the currently logged-in user
export const POST = withAdminAuth(async (_req, { adminId }): Promise<NextResponse> => {
  if (process.env.NODE_ENV !== 'development') {
    return jsonError('Not available', 403);
  }

  try {
    await upsertSubscription(adminId, { tier: 'pro', status: 'active' });
    return jsonOk({ success: true, message: 'You are now Pro!' });
  } catch (error) {
    logger.error('Grant pro error:', error);
    return jsonError('DB error', 500);
  }
});
