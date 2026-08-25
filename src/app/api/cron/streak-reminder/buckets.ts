/**
 * Deciding which streak nudge a user is due, in *their* calendar day.
 *
 * `user_progress.last_active_date` is written by the client in local time, but
 * this cron fires on a UTC schedule. Comparing the two directly shifts the nudge
 * by a day for anyone far enough east or west, so the query selects a UTC window
 * wide enough to contain every timezone's answer and the bucketing happens here,
 * per row, against that row's own stored zone.
 *
 * Pure and side-effect free so the boundary cases can be tested without a
 * database or a push service.
 */

import { getServerToday, shiftDateKey } from '@/lib/server-dates';

/** Day-1 nudge: last active on the user's local yesterday, streak still intact. */
const DAY1_OFFSET = -1;

/** Day-2 nudge: last active two local days ago, streak breaks after today. */
const DAY2_OFFSET = -2;

/**
 * How far a user's local calendar date can sit from the server's UTC date.
 *
 * Real UTC offsets run from -12 (Etc/GMT+12) to +14 (Pacific/Kiritimati), a
 * 26-hour spread, so at any instant a user's local date is at most one day ahead
 * of the UTC date and at most one day behind it.
 */
const MAX_LOCAL_DAYS_AHEAD = 1;
const MAX_LOCAL_DAYS_BEHIND = 1;

export type ReminderBucket = 'day1' | 'day2';

/** The row fields the bucketing decision reads. */
export interface ReminderRow {
  /** Practice-store last active date, a local YYYY-MM-DD key. */
  lastActiveDate: string | null;
  /** Stored IANA zone, or null for a row synced before the column existed. */
  timezone: string | null;
  /** Course-store last active date, a local YYYY-MM-DD key. */
  courseLastActive: string | null;
}

/**
 * Every UTC day key that could be some user's local day-1 or day-2 date when the
 * cron fires on `utcToday`.
 *
 * Local today spans `utcToday - 1 … utcToday + 1`, so local yesterday spans
 * `utcToday - 2 … utcToday` and local two-days-ago spans `utcToday - 3 …
 * utcToday - 1`. The union is a contiguous four-day window ending on `utcToday`.
 * Widening it only costs rows that `bucketReminderRow` then discards; narrowing
 * it silently drops real users at the extremes.
 */
export function reminderCandidateDates(utcToday: string): string[] {
  const oldest = DAY2_OFFSET - MAX_LOCAL_DAYS_BEHIND;
  const newest = DAY1_OFFSET + MAX_LOCAL_DAYS_AHEAD;
  const dates: string[] = [];
  for (let offset = oldest; offset <= newest; offset++) {
    dates.push(shiftDateKey(utcToday, offset));
  }
  return dates;
}

/**
 * Which nudge `row` is due right now, or null for none.
 *
 * A null `timezone` resolves to UTC via `getServerToday`, which is exactly the
 * behaviour every row has today. That is deliberate: dropping unknown-zone rows
 * would stop reminders entirely for every account that predates the column,
 * which is a worse outcome than the mistimed nudge they already get. Each row
 * upgrades itself the first time its owner syncs progress.
 */
export function bucketReminderRow(row: ReminderRow, now?: Date): ReminderBucket | null {
  if (!row.lastActiveDate) return null;

  const today = getServerToday(row.timezone, now);

  // Course activity today means the user is not lapsed at all — practice
  // `lastActiveDate` just has not caught up, since the two stores sync separately.
  if (row.courseLastActive === today) return null;

  if (row.lastActiveDate === shiftDateKey(today, DAY1_OFFSET)) return 'day1';
  if (row.lastActiveDate === shiftDateKey(today, DAY2_OFFSET)) return 'day2';
  return null;
}
