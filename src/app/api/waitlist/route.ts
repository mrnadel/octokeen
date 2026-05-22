import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { proWaitlist } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { emailSchema } from '@/lib/api-schemas';

const waitlistSchema = z.object({
  email: emailSchema,
});

// Simple in-memory rate limiting: 5 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count += 1;
  return entry.count > 5;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  try {
    const rawBody = await req.json();
    const parsed = waitlistSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }
    const { email } = parsed.data;

    // Insert into waitlist, ignore duplicates
    await db
      .insert(proWaitlist)
      .values({ email: email.toLowerCase().trim() })
      .onConflictDoNothing({ target: proWaitlist.email });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(proWaitlist);

    return NextResponse.json({ count: Number(result[0]?.count ?? 0) });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
