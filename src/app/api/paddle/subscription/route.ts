import { NextResponse } from 'next/server';
import { FREE_TIER_RESPONSE } from '@/lib/pricing';
import { jsonOk } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { getSubscription } from '@/lib/db/queries';
import type { SubscriptionTier, SubscriptionStatus } from '@/lib/subscription';

export const GET = withAuth(async (_req, { userId }): Promise<NextResponse> => {
  try {
    const sub = await getSubscription(userId);

    if (!sub) {
      return jsonOk(FREE_TIER_RESPONSE);
    }

    return jsonOk({
      subscription: {
        tier: sub.tier as SubscriptionTier,
        status: sub.status as SubscriptionStatus,
        billingInterval: sub.billingInterval,
        currentPeriodEnd: sub.currentPeriodEnd,
        trialEnd: sub.trialEnd,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        paddleSubscriptionId: sub.paddleSubscriptionId,
      },
    });
  } catch {
    // DB error (e.g. table doesn't exist yet) — default to free tier
    return jsonOk(FREE_TIER_RESPONSE);
  }
});
