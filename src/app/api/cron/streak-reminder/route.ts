import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pushSubscriptions, userProgress } from '@/lib/db/schema';
import { eq, ne, and, gt } from 'drizzle-orm';
import { sendPushNotification } from '@/lib/push';

// Secured by CRON_SECRET — only callable from Vercel Cron Jobs
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  // Process at-risk users in batches to avoid timeouts at scale
  const BATCH_SIZE = 500;
  let sent = 0;
  let failed = 0;
  let total = 0;
  let lastUserId: string | null = null;

  while (true) {
    // Cursor-based pagination: fetch next batch of at-risk users
    const conditions = [
      gt(userProgress.currentStreak, 0),
      ne(userProgress.lastActiveDate, today),
    ];
    if (lastUserId) {
      conditions.push(gt(userProgress.userId, lastUserId));
    }

    const batch = await db
      .select({
        userId: userProgress.userId,
        currentStreak: userProgress.currentStreak,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
      })
      .from(userProgress)
      .innerJoin(pushSubscriptions, eq(userProgress.userId, pushSubscriptions.userId))
      .where(and(...conditions))
      .orderBy(userProgress.userId)
      .limit(BATCH_SIZE);

    if (batch.length === 0) break;

    total += batch.length;
    lastUserId = batch[batch.length - 1].userId;

    // Send notifications concurrently in small groups
    const CONCURRENCY = 10;
    for (let i = 0; i < batch.length; i += CONCURRENCY) {
      const chunk = batch.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        chunk.map((user) =>
          sendPushNotification(
            { endpoint: user.endpoint, p256dh: user.p256dh, auth: user.auth },
            {
              title: `Your ${user.currentStreak}-day streak is at risk!`,
              body: 'Complete one lesson today to keep it alive.',
              tag: 'streak-reminder',
              url: '/',
            },
          )
        )
      );

      for (let j = 0; j < results.length; j++) {
        if (results[j].status === 'fulfilled') {
          sent++;
        } else {
          const err = (results[j] as PromiseRejectedResult).reason;
          if (err && typeof err === 'object' && 'statusCode' in err && (err as { statusCode: number }).statusCode === 410) {
            await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, chunk[j].endpoint));
          }
          failed++;
        }
      }
    }

    if (batch.length < BATCH_SIZE) break; // Last batch
  }

  return NextResponse.json({ sent, failed, total });
}
