/**
 * Server-side date utilities that respect the user's timezone.
 *
 * The client sends an `X-Timezone` header (IANA string like "America/New_York")
 * so the server can compute "today" in the user's local time instead of UTC.
 * This prevents mismatches where a user practicing at 11pm EST would get
 * tomorrow's date (UTC) for streaks, daily rewards, etc.
 */

const MS_PER_DAY = 86_400_000;

/** Format a Date as YYYY-MM-DD using its UTC calendar fields. */
function toUtcDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** "Today" as a YYYY-MM-DD string in UTC, ignoring any client timezone. */
export function getUtcToday(): string {
  return toUtcDateString(new Date());
}

/** A YYYY-MM-DD string for the UTC day `days` before now. */
export function getUtcDaysAgo(days: number): string {
  return toUtcDateString(new Date(Date.now() - days * MS_PER_DAY));
}

/**
 * A YYYY-MM-DD key shifted by `days` calendar days.
 *
 * Anchored at noon UTC so the arithmetic never lands on a DST seam, and read
 * back through UTC fields so the result never depends on the server's own zone.
 */
export function shiftDateKey(dateKey: string, days: number): string {
  const anchored = new Date(`${dateKey}T12:00:00Z`);
  anchored.setUTCDate(anchored.getUTCDate() + days);
  return toUtcDateString(anchored);
}

/** Longest IANA zone name in the database is 32 chars; this is slack, not a limit. */
const MAX_TIMEZONE_LENGTH = 64;

/**
 * Whether `value` is a timezone this runtime can actually resolve.
 *
 * The zone arrives on a client-supplied header, so it is untrusted input and is
 * checked before ever being stored. `Intl.DateTimeFormat` throws `RangeError`
 * for anything it does not recognise, which makes it a complete check against
 * the same table `getServerToday` will later use — no separate allowlist to
 * drift out of sync.
 */
export function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value.length === 0 || value.length > MAX_TIMEZONE_LENGTH) return false;
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** The Monday (UTC) of the week containing `date`, as YYYY-MM-DD. */
export function getUtcWeekMonday(date: Date): string {
  const day = date.getUTCDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() + diff);
  return toUtcDateString(monday);
}

/**
 * Get "today" as a YYYY-MM-DD string in the user's timezone.
 * Falls back to UTC if the timezone header is missing or invalid.
 *
 * `now` defaults to the current instant; pass one to resolve a specific moment,
 * which is what lets the reminder-cron bucketing be tested as a pure function.
 */
export function getServerToday(timezoneHeader?: string | null, now: Date = new Date()): string {
  if (timezoneHeader) {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezoneHeader,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      // en-CA locale formats as YYYY-MM-DD
      return formatter.format(now);
    } catch {
      // Invalid timezone string — fall through to UTC
    }
  }
  return toUtcDateString(now);
}

/**
 * Get a Date object representing "now" but shifted so that its UTC methods
 * (getUTCFullYear, etc.) return values in the user's timezone.
 * Useful for date arithmetic (e.g. "14 days ago") that needs to stay in
 * the user's timezone.
 */
export function getServerNow(timezoneHeader?: string | null): Date {
  if (timezoneHeader) {
    try {
      // Validate the timezone by creating a formatter
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezoneHeader,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const parts = formatter.formatToParts(new Date());
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
      return new Date(
        `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`,
      );
    } catch {
      // Invalid timezone — fall through
    }
  }
  return new Date();
}
