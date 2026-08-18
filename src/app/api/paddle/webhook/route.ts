import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import {
  EventName,
  type EventEntity,
  type SubscriptionNotification,
  type TransactionNotification,
} from '@paddle/paddle-node-sdk';
import paddle from '@/lib/paddle';
import { db } from '@/lib/db';
import { users, subscriptions, paymentHistory } from '@/lib/db/schema';
import { serverEnv } from '@/lib/env';
import { logger } from '@/lib/logger';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { tierFromPriceId } from '@/lib/pricing';
import { jsonOk, jsonError, getClientIp, rateLimited } from '@/lib/api-helpers';
import { upsertSubscription } from '@/lib/db/queries';

export const runtime = 'nodejs';

const env = serverEnv();

// ─── Custom error for non-retryable failures ────────────────
// Return 200 to Paddle so it does not retry indefinitely.
class NonRetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NonRetryableError';
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rl = rateLimit(`paddle-webhook:${getClientIp(request)}`, RATE_LIMITS.webhook);
  if (!rl.success) {
    return rateLimited(rl.resetAt);
  }

  // ── Signature verification ──────────────────────────────────
  const signature = request.headers.get('paddle-signature');
  if (!signature) {
    return jsonError('Missing signature', 400);
  }

  const body = await request.text();

  let event: EventEntity;
  try {
    event = await paddle.webhooks.unmarshal(
      body,
      env.PADDLE_WEBHOOK_SECRET,
      signature,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Webhook signature verification failed:', message);
    return jsonError('Invalid signature', 400);
  }

  // ── Event dispatch ──────────────────────────────────────────
  try {
    switch (event.eventType) {
      // Subscription lifecycle — all upsert the subscription record
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionResumed:
      case EventName.SubscriptionTrialing:
        await handleSubscriptionUpsert(event.data as SubscriptionNotification);
        break;

      case EventName.SubscriptionPastDue:
        await handleSubscriptionPastDue(event.data as SubscriptionNotification);
        break;

      case EventName.SubscriptionCanceled:
        await handleSubscriptionCanceled(event.data as SubscriptionNotification);
        break;

      case EventName.SubscriptionPaused:
        await handleSubscriptionPaused(event.data as SubscriptionNotification);
        break;

      // Transaction events
      case EventName.TransactionCompleted:
        await handleTransactionCompleted(event.data as TransactionNotification);
        break;

      case EventName.TransactionPaymentFailed:
        await handleTransactionPaymentFailed(event.data as TransactionNotification);
        break;

      // Adjustment events (refunds)
      case EventName.AdjustmentCreated:
        await handleAdjustmentCreated(event.data as unknown as Record<string, unknown>);
        break;

      default:
        // Unhandled event type — acknowledge so Paddle does not retry
        logger.info(`Unhandled Paddle webhook event: ${event.eventType}`);
        break;
    }
  } catch (err) {
    // Non-retryable errors: return 200 so Paddle stops retrying
    if (err instanceof NonRetryableError) {
      logger.warn(`Non-retryable webhook error for ${event.eventType}:`, err.message);
      return jsonOk({ received: true, warning: 'non-retryable error' });
    }

    // Retryable errors: return 500 so Paddle retries
    logger.error(`Webhook handler error for ${event.eventType}:`, err);
    return jsonError('Webhook handler failed', 500);
  }

  return jsonOk({ received: true });
}

// ─── Helpers ────────────────────────────────────────────────────

/** Currency recorded when Paddle omits one from the notification. */
const DEFAULT_CURRENCY = 'USD';

/** Parse a Paddle money total string into whole cents. */
function parseAmountCents(total: string | undefined): number {
  return Math.round(parseFloat(total ?? '0') || 0);
}

/** True when a payment_history row already exists for this Paddle record ID. */
async function isPaymentRecorded(paddleTransactionId: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: paymentHistory.id })
    .from(paymentHistory)
    .where(eq(paymentHistory.paddleTransactionId, paddleTransactionId))
    .limit(1);
  return !!existing;
}

function resolveTier(priceId: string | null): 'free' | 'pro' {
  return tierFromPriceId(priceId, env.PADDLE_PRO_MONTHLY_PRICE_ID, env.PADDLE_PRO_YEARLY_PRICE_ID);
}

function mapPaddleStatus(
  status: string,
): string {
  const map: Record<string, string> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    paused: 'canceled',
  };
  // Default to 'past_due' for unknown statuses — safe: grants temporary
  // access while flagging the account for attention, rather than silently
  // granting full 'active' access for unrecognised statuses.
  return map[status] ?? 'past_due';
}

// ─── Subscription Event Handlers ────────────────────────────────

async function handleSubscriptionUpsert(sub: SubscriptionNotification) {
  const customerId = sub.customerId;
  if (!customerId) return;

  const userId = await getUserIdByCustomer(customerId);
  if (!userId) {
    // User was likely deleted — acknowledge so Paddle stops retrying
    logger.warn(`[webhook] Ignoring subscription upsert: no user for Paddle customer ${customerId} (account may have been deleted)`);
    return;
  }

  const priceId = sub.items?.[0]?.price?.id ?? null;
  const interval = sub.items?.[0]?.price?.billingCycle?.interval ?? null;

  await upsertSubscription(userId, {
    tier: resolveTier(priceId),
    status: mapPaddleStatus(sub.status ?? 'active'),
    paddleCustomerId: customerId,
    paddleSubscriptionId: sub.id,
    paddlePriceId: priceId,
    billingInterval: interval === 'year' ? 'year' : 'month',
    currentPeriodStart: sub.currentBillingPeriod?.startsAt ?? null,
    currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
    trialStart: sub.items?.[0]?.trialDates?.startsAt ?? null,
    trialEnd: sub.items?.[0]?.trialDates?.endsAt ?? null,
    cancelAtPeriodEnd: sub.scheduledChange?.action === 'cancel',
  });
}

async function handleSubscriptionPastDue(sub: SubscriptionNotification) {
  const customerId = sub.customerId;
  if (!customerId) return;

  const userId = await getUserIdByCustomer(customerId);
  if (!userId) {
    logger.warn(`[webhook] Ignoring past_due event: no user for Paddle customer ${customerId} (account may have been deleted)`);
    return;
  }

  const priceId = sub.items?.[0]?.price?.id ?? null;

  // Keep the current tier so the user retains access during the grace period,
  // but mark the status as past_due so the UI can show a payment warning.
  await upsertSubscription(userId, {
    tier: resolveTier(priceId),
    status: 'past_due',
    paddleCustomerId: customerId,
    paddleSubscriptionId: sub.id,
    currentPeriodStart: sub.currentBillingPeriod?.startsAt ?? null,
    currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
  });
}

async function handleSubscriptionCanceled(sub: SubscriptionNotification) {
  const customerId = sub.customerId;
  if (!customerId) return;

  const userId = await getUserIdByCustomer(customerId);
  if (!userId) {
    logger.warn(`[webhook] Ignoring canceled event: no user for Paddle customer ${customerId} (account may have been deleted)`);
    return;
  }

  // Preserve currentPeriodEnd so the user knows when access actually expires.
  await upsertSubscription(userId, {
    tier: 'free',
    status: 'canceled',
    cancelAtPeriodEnd: false,
    currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
  });
}

async function handleSubscriptionPaused(sub: SubscriptionNotification) {
  const customerId = sub.customerId;
  if (!customerId) return;

  const userId = await getUserIdByCustomer(customerId);
  if (!userId) {
    logger.warn(`[webhook] Ignoring paused event: no user for Paddle customer ${customerId} (account may have been deleted)`);
    return;
  }

  await upsertSubscription(userId, {
    tier: 'free',
    status: 'canceled',
    currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
  });
}

// ─── Transaction Event Handlers ─────────────────────────────────

async function handleTransactionCompleted(txn: TransactionNotification) {
  const customerId = txn.customerId;
  if (!customerId) return;

  const userId = await getUserIdByCustomer(customerId);
  if (!userId) {
    logger.warn(`[webhook] Ignoring transaction completed: no user for Paddle customer ${customerId} (account may have been deleted)`);
    return;
  }

  // Idempotent: skip if already recorded (unique constraint on paddleTransactionId
  // also guards against races, but checking first avoids unnecessary INSERT attempts)
  if (txn.id && (await isPaymentRecorded(txn.id))) return;

  await db.insert(paymentHistory).values({
    userId,
    paddleTransactionId: txn.id ?? null,
    amountCents: parseAmountCents(txn.details?.totals?.total),
    currency: txn.currencyCode ?? DEFAULT_CURRENCY,
    status: 'succeeded',
    description: `Paddle transaction ${txn.id ?? ''}`,
  });
}

async function handleTransactionPaymentFailed(txn: TransactionNotification) {
  const customerId = txn.customerId;
  if (!customerId) return;

  const userId = await getUserIdByCustomer(customerId);
  if (!userId) {
    logger.warn(`[webhook] Ignoring failed payment: no user for Paddle customer ${customerId} (account may have been deleted)`);
    return;
  }

  // Idempotent: skip if already recorded
  if (txn.id && (await isPaymentRecorded(txn.id))) return;

  await db.insert(paymentHistory).values({
    userId,
    paddleTransactionId: txn.id ?? null,
    amountCents: parseAmountCents(txn.details?.totals?.total),
    currency: txn.currencyCode ?? DEFAULT_CURRENCY,
    status: 'failed',
    description: `Failed payment — Paddle transaction ${txn.id ?? ''}`,
  });
}

// ─── Adjustment (Refund) Handler ────────────────────────────────

async function handleAdjustmentCreated(data: Record<string, unknown>) {
  // Paddle adjustment events include: id, transactionId, action (refund|credit|chargeback), totals, etc.
  const adjustmentId = data.id as string | undefined;
  const transactionId = data.transactionId as string | undefined;
  const action = data.action as string | undefined;
  const customerId = data.customerId as string | undefined;

  if (!transactionId) return;

  // Idempotent: use adjustmentId as the paddleTransactionId to avoid duplicates
  const recordId = adjustmentId ?? `adj_${transactionId}`;
  if (await isPaymentRecorded(recordId)) return;

  // Try to find the user from the original transaction
  let userId: string | null = null;

  // First try from the original transaction's payment history
  if (transactionId) {
    const [txnRecord] = await db
      .select({ userId: paymentHistory.userId })
      .from(paymentHistory)
      .where(eq(paymentHistory.paddleTransactionId, transactionId))
      .limit(1);
    if (txnRecord) userId = txnRecord.userId;
  }

  // Fall back to customer lookup
  if (!userId && customerId) {
    userId = await getUserIdByCustomer(customerId);
  }

  if (!userId) {
    logger.warn(`Adjustment ${adjustmentId}: could not resolve user for transaction ${transactionId}`);
    return; // Non-critical: don't fail the webhook
  }

  const totals = data.totals as Record<string, string> | undefined;

  await db.insert(paymentHistory).values({
    userId,
    paddleTransactionId: recordId,
    amountCents: parseAmountCents(totals?.total),
    currency: (data.currencyCode as string) ?? DEFAULT_CURRENCY,
    status: action === 'refund' ? 'refunded' : (action ?? 'adjustment'),
    description: `${action ?? 'Adjustment'} for transaction ${transactionId}`,
  });
}

// ─── DB utilities ───────────────────────────────────────────────

async function getUserIdByCustomer(
  paddleCustomerId: string,
): Promise<string | null> {
  // First try to find by paddleCustomerId in subscriptions
  const [row] = await db
    .select({ userId: subscriptions.userId })
    .from(subscriptions)
    .where(eq(subscriptions.paddleCustomerId, paddleCustomerId))
    .limit(1);
  if (row) return row.userId;

  // If not found, look up the Paddle customer's email and match to our users
  try {
    const customer = await paddle.customers.get(paddleCustomerId);
    if (customer?.email) {
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, customer.email))
        .limit(1);
      return user?.id ?? null;
    }
  } catch (err) {
    logger.error('Failed to look up Paddle customer:', err);
  }

  return null;
}

