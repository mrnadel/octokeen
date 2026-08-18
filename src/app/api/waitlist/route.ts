import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { proWaitlist } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { emailSchema } from '@/lib/api-schemas';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { jsonOk, jsonError, TOO_MANY_REQUESTS_RETRY } from '@/lib/api-helpers';

const waitlistSchema = z.object({
  email: emailSchema,
});

/**
 * Waitlist uses a stricter IP resolution than `getClientIp` — it takes the
 * first entry of `x-forwarded-for` and falls back to `x-real-ip`.
 */
function getWaitlistIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Returns a ready-to-send 429 when the caller is over the limit, else null. */
function checkRateLimit(req: NextRequest): NextResponse | null {
  const rl = rateLimit(`waitlist:${getWaitlistIp(req)}`, RATE_LIMITS.auth);
  return rl.success ? null : jsonError(TOO_MANY_REQUESTS_RETRY, 429);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const limited = checkRateLimit(req);
  if (limited) return limited;

  try {
    const rawBody = await req.json();
    const parsed = waitlistSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonError('Invalid email format', 400);
    }
    const { email } = parsed.data;

    // Insert into waitlist, ignore duplicates
    await db
      .insert(proWaitlist)
      .values({ email: email.toLowerCase().trim() })
      .onConflictDoNothing({ target: proWaitlist.email });

    return jsonOk({ success: true });
  } catch {
    return jsonError('Something went wrong', 500);
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const limited = checkRateLimit(req);
  if (limited) return limited;

  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(proWaitlist);

    return jsonOk({ count: Number(result[0]?.count ?? 0) });
  } catch {
    return jsonError('Something went wrong', 500);
  }
}
