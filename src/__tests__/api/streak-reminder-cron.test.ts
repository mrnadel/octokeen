import { describe, it, expect } from 'vitest';

import {
  reminderCandidateDates,
  bucketReminderRow,
  type ReminderRow,
} from '@/app/api/cron/streak-reminder/buckets';
import { getServerToday, isValidTimeZone, shiftDateKey } from '@/lib/server-dates';

/**
 * The cron's real firing time: `vercel.json` schedules it at 19:00 UTC daily.
 * Every zone below has a fixed offset in mid-January, so these instants resolve
 * identically no matter what TZ the test runner itself is set to.
 */
const FIRE_TIME = new Date('2026-01-15T19:00:00Z');
const UTC_TODAY = '2026-01-15';

/** Zones chosen for stable January offsets, spanning the full real-world range. */
const KIRITIMATI = 'Pacific/Kiritimati'; // UTC+14, no DST
const AUCKLAND = 'Pacific/Auckland'; //     UTC+13 in January (NZDT)
const JERUSALEM = 'Asia/Jerusalem'; //      UTC+2  in January — all 11 current users
const NEW_YORK = 'America/New_York'; //     UTC-5  in January
const NIUE = 'Pacific/Niue'; //             UTC-11, no DST
const BAKER_ISLAND = 'Etc/GMT+12'; //       UTC-12, the westernmost real offset

function row(over: Partial<ReminderRow>): ReminderRow {
  return { lastActiveDate: null, timezone: null, courseLastActive: null, ...over };
}

// ── The candidate window ────────────────────────────────────────────────────

describe('reminderCandidateDates', () => {
  it('is the four UTC days ending on the day the cron fires', () => {
    expect(reminderCandidateDates(UTC_TODAY)).toEqual([
      '2026-01-12',
      '2026-01-13',
      '2026-01-14',
      '2026-01-15',
    ]);
  });

  it('contains both nudge dates for every offset from UTC-12 to UTC+14', () => {
    // If the window is ever narrowed, the users at the extremes stop being
    // selected at all and simply never hear from the cron again.
    const candidates = reminderCandidateDates(UTC_TODAY);
    const zones = [KIRITIMATI, AUCKLAND, JERUSALEM, 'UTC', NEW_YORK, NIUE, BAKER_ISLAND];

    for (const zone of zones) {
      const localToday = getServerToday(zone, FIRE_TIME);
      expect(candidates, `day-1 date for ${zone}`).toContain(shiftDateKey(localToday, -1));
      expect(candidates, `day-2 date for ${zone}`).toContain(shiftDateKey(localToday, -2));
    }
  });

  it('covers a zone whose local date is behind UTC, whatever hour the cron fires', () => {
    // 05:00 UTC puts Niue (UTC-11) on the previous calendar day. The schedule
    // does not produce this today, but the window must not depend on that.
    const earlyFire = new Date('2026-01-15T05:00:00Z');
    expect(getServerToday(NIUE, earlyFire)).toBe('2026-01-14');

    const candidates = reminderCandidateDates(UTC_TODAY);
    expect(candidates).toContain('2026-01-13'); // Niue's local yesterday
    expect(candidates).toContain('2026-01-12'); // Niue's local two-days-ago
  });
});

// ── Bucketing, east of UTC ──────────────────────────────────────────────────

describe('bucketReminderRow — a user whose local day is ahead of the server', () => {
  it('nudges a UTC+13 user on their own yesterday, not the server’s', () => {
    // 19:00 UTC on the 15th is 08:00 on the 16th in Auckland, so this user's
    // yesterday is 2026-01-15 — the same key the server calls "today".
    expect(getServerToday(AUCKLAND, FIRE_TIME)).toBe('2026-01-16');

    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-15', timezone: AUCKLAND }), FIRE_TIME))
      .toBe('day1');
  });

  it('re-buckets the row the old UTC comparison called day-1', () => {
    // This is the defect itself. The old cron matched last_active_date against
    // UTC yesterday (2026-01-14) for the day-1 nudge. For a UTC+13 user that
    // date is two local days back, so they were told "your streak breaks
    // tomorrow" a day before the gentle reminder was even due.
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-14', timezone: AUCKLAND }), FIRE_TIME))
      .toBe('day2');
  });

  it('sends nothing to a UTC+14 user who was active on their local today', () => {
    expect(getServerToday(KIRITIMATI, FIRE_TIME)).toBe('2026-01-16');
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-16', timezone: KIRITIMATI }), FIRE_TIME))
      .toBeNull();
  });

  it('nudges a UTC+14 user whose last activity was their local yesterday', () => {
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-15', timezone: KIRITIMATI }), FIRE_TIME))
      .toBe('day1');
  });

  it('leaves the eleven UTC+2/+3 users on exactly the schedule they have today', () => {
    // Jerusalem's local date equals the UTC date at 19:00 UTC, so bucketing by
    // local day is a no-op for every current account.
    expect(getServerToday(JERUSALEM, FIRE_TIME)).toBe(UTC_TODAY);
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-14', timezone: JERUSALEM }), FIRE_TIME))
      .toBe('day1');
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-13', timezone: JERUSALEM }), FIRE_TIME))
      .toBe('day2');
  });
});

// ── Bucketing, west of UTC ──────────────────────────────────────────────────

describe('bucketReminderRow — a user whose local day is behind the server', () => {
  const EARLY_FIRE = new Date('2026-01-15T05:00:00Z');

  it('nudges a UTC-11 user on their own yesterday when UTC has already rolled over', () => {
    expect(getServerToday(NIUE, EARLY_FIRE)).toBe('2026-01-14');

    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-13', timezone: NIUE }), EARLY_FIRE))
      .toBe('day1');
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-12', timezone: NIUE }), EARLY_FIRE))
      .toBe('day2');
  });

  it('does not nudge a UTC-11 user who is still active on their local today', () => {
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-14', timezone: NIUE }), EARLY_FIRE))
      .toBeNull();
  });

  it('treats UTC-5 correctly at the real 19:00 firing time', () => {
    expect(getServerToday(NEW_YORK, FIRE_TIME)).toBe(UTC_TODAY);
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-14', timezone: NEW_YORK }), FIRE_TIME))
      .toBe('day1');
  });
});

// ── Rows with no timezone yet ───────────────────────────────────────────────

describe('bucketReminderRow — a row with no stored timezone', () => {
  it('falls back to UTC rather than being dropped', () => {
    // Every account predating the timezone column has NULL here. Skipping those
    // rows would silence the cron entirely for them, which is strictly worse
    // than the mistimed nudge they already receive.
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-14', timezone: null }), FIRE_TIME))
      .toBe('day1');
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-13', timezone: null }), FIRE_TIME))
      .toBe('day2');
  });

  it('reproduces the pre-migration behaviour exactly', () => {
    expect(bucketReminderRow(row({ lastActiveDate: UTC_TODAY, timezone: null }), FIRE_TIME))
      .toBeNull();
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-12', timezone: null }), FIRE_TIME))
      .toBeNull();
  });

  it('falls back to UTC for a stored value the runtime cannot resolve', () => {
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-14', timezone: 'Mars/Olympus_Mons' }), FIRE_TIME))
      .toBe('day1');
  });
});

// ── Suppression rules ───────────────────────────────────────────────────────

describe('bucketReminderRow — suppression', () => {
  it('sends nothing when course activity lands on the user’s local today', () => {
    const entry = row({
      lastActiveDate: '2026-01-15',
      courseLastActive: '2026-01-16',
      timezone: AUCKLAND,
    });
    expect(entry.courseLastActive).toBe(getServerToday(AUCKLAND, FIRE_TIME));
    expect(bucketReminderRow(entry, FIRE_TIME)).toBeNull();
  });

  it('still nudges when the course date is itself stale', () => {
    const entry = row({
      lastActiveDate: '2026-01-15',
      courseLastActive: '2026-01-15',
      timezone: AUCKLAND,
    });
    expect(bucketReminderRow(entry, FIRE_TIME)).toBe('day1');
  });

  it('sends nothing for an empty last-active date', () => {
    expect(bucketReminderRow(row({ lastActiveDate: '', timezone: JERUSALEM }), FIRE_TIME)).toBeNull();
    expect(bucketReminderRow(row({ lastActiveDate: null, timezone: JERUSALEM }), FIRE_TIME)).toBeNull();
  });

  it('sends nothing once the user is three or more local days gone', () => {
    // Selected by the UTC window, discarded here: the streak is beyond saving
    // and neither message would be true.
    expect(bucketReminderRow(row({ lastActiveDate: '2026-01-12', timezone: JERUSALEM }), FIRE_TIME))
      .toBeNull();
  });
});

// ── Header validation ───────────────────────────────────────────────────────

describe('isValidTimeZone', () => {
  it('accepts real IANA names', () => {
    for (const zone of [KIRITIMATI, AUCKLAND, JERUSALEM, NEW_YORK, NIUE, BAKER_ISLAND, 'UTC']) {
      expect(isValidTimeZone(zone), zone).toBe(true);
    }
  });

  it('rejects anything the runtime cannot resolve', () => {
    const bad = [
      '',
      'Not/AZone',
      'America/New_York; DROP TABLE user_progress',
      "'; DELETE FROM users; --",
      '../../etc/passwd',
      'A'.repeat(200),
      null,
      undefined,
      42,
      { timeZone: 'UTC' },
    ];
    for (const value of bad) {
      expect(isValidTimeZone(value), JSON.stringify(value)).toBe(false);
    }
  });
});

// ── Date arithmetic ─────────────────────────────────────────────────────────

describe('shiftDateKey', () => {
  it('crosses month and year boundaries', () => {
    expect(shiftDateKey('2026-01-01', -1)).toBe('2025-12-31');
    expect(shiftDateKey('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDateKey('2024-03-01', -1)).toBe('2024-02-29');
    expect(shiftDateKey('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('is a no-op at zero', () => {
    expect(shiftDateKey(UTC_TODAY, 0)).toBe(UTC_TODAY);
  });
});
