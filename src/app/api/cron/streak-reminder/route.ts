import { db } from '@/lib/db';
import { pushSubscriptions, userProgress, courseProgress } from '@/lib/db/schema';
import { eq, and, gt, inArray } from 'drizzle-orm';
import { sendPushNotification } from '@/lib/push';
import { jsonOk } from '@/lib/api-helpers';
import { withCronAuth } from '@/lib/api/guards';
import { getUtcToday } from '@/lib/server-dates';
import { reminderCandidateDates, bucketReminderRow, type ReminderBucket } from './buckets';

const BATCH_SIZE = 500;
const CONCURRENCY = 10;

/** HTTP status Web Push returns for a subscription the browser has revoked. */
const GONE = 410;

const MESSAGES: Record<ReminderBucket, (streak: number) => { title: string; body: string; tag: string }> = {
  day1: (streak) => ({
    title: 'Quick 3-min lesson?',
    body: `Keep your ${streak}-day streak alive!`,
    tag: 'streak-nudge-day1',
  }),
  day2: (streak) => ({
    title: `Your ${streak}-day streak breaks tomorrow!`,
    body: "One lesson is all it takes. Don't lose your progress.",
    tag: 'streak-nudge-day2',
  }),
};

// Secured by CRON_SECRET — only callable from Vercel Cron Jobs
export const GET = withCronAuth(async () => {
  const stats = { day1Sent: 0, day1Failed: 0, day2Sent: 0, day2Failed: 0, total: 0 };

  // The window is selected in UTC because that is what the cron schedule knows;
  // which nudge each row is actually due is decided per row against its own
  // timezone, since last_active_date is written in the user's local calendar.
  const candidateDates = reminderCandidateDates(getUtcToday());
  const now = new Date();

  let lastUserId: string | null = null;

  while (true) {
    const where = [
      gt(userProgress.currentStreak, 0),
      inArray(userProgress.lastActiveDate, candidateDates),
    ];
    if (lastUserId) {
      where.push(gt(userProgress.userId, lastUserId));
    }

    // Join with courseProgress to get the true last active date
    // (user may only do course lessons, not practice)
    const batch = await db
      .select({
        userId: userProgress.userId,
        currentStreak: userProgress.currentStreak,
        timezone: userProgress.timezone,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
        courseLastActive: courseProgress.lastActiveDate,
        lastActiveDate: userProgress.lastActiveDate,
      })
      .from(userProgress)
      .innerJoin(pushSubscriptions, eq(userProgress.userId, pushSubscriptions.userId))
      .leftJoin(courseProgress, eq(userProgress.userId, courseProgress.userId))
      .where(and(...where))
      .orderBy(userProgress.userId)
      .limit(BATCH_SIZE);

    if (batch.length === 0) break;

    lastUserId = batch[batch.length - 1].userId;

    const due = batch
      .map((row) => ({ row, bucket: bucketReminderRow(row, now) }))
      .filter((entry): entry is { row: (typeof batch)[number]; bucket: ReminderBucket } =>
        entry.bucket !== null,
      );
    stats.total += due.length;

    for (let i = 0; i < due.length; i += CONCURRENCY) {
      const chunk = due.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        chunk.map(({ row, bucket }) =>
          sendPushNotification(
            { endpoint: row.endpoint, p256dh: row.p256dh, auth: row.auth },
            { ...MESSAGES[bucket](row.currentStreak), url: '/', icon: '/icon-192.png' },
          ),
        ),
      );

      for (let j = 0; j < results.length; j++) {
        const { bucket } = chunk[j];
        if (results[j].status === 'fulfilled') {
          stats[`${bucket}Sent`]++;
        } else {
          const err = (results[j] as PromiseRejectedResult).reason;
          if (err && typeof err === 'object' && 'statusCode' in err && (err as { statusCode: number }).statusCode === GONE) {
            await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, chunk[j].row.endpoint));
          }
          stats[`${bucket}Failed`]++;
        }
      }
    }

    if (batch.length < BATCH_SIZE) break;
  }

  return jsonOk(stats);
});
