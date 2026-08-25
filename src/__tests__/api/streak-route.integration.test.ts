import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoist mutable mocks so vi.mock factories can reference them ────────────
const { mockGetAuthUserId, mockRows } = vi.hoisted(() => ({
  mockGetAuthUserId: vi.fn(),
  mockRows: {
    /** Distinct `session_history.date` rows — empty for a course-only user. */
    sessionDates: [] as { date: string }[],
    userProgress: [] as Record<string, unknown>[],
    courseProgress: [] as Record<string, unknown>[],
  },
}));

vi.mock('@/lib/auth-utils', () => ({
  getAuthUserId: mockGetAuthUserId,
  requireAdmin: vi.fn().mockResolvedValue(null),
}));

/**
 * The route issues three reads, in this order:
 *   1. selectDistinct(...).from().where().orderBy()   → session dates
 *   2. select(...).from().where().limit()             → user_progress
 *   3. select(...).from().where().limit()             → course_progress
 * The two `select` calls are distinguished by call order.
 */
vi.mock('@/lib/db', () => {
  let selectCall = 0;

  const db = {
    selectDistinct: vi.fn(() => ({
      from: () => ({
        where: () => ({
          orderBy: () => Promise.resolve(mockRows.sessionDates),
        }),
      }),
    })),
    select: vi.fn(() => {
      const rows = selectCall++ === 0 ? mockRows.userProgress : mockRows.courseProgress;
      return {
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve(rows),
          }),
        }),
      };
    }),
    __resetSelectCall: () => { selectCall = 0; },
  };

  return { db };
});

import { GET } from '@/app/api/streak/route';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

/** 14 consecutive day keys ending on `endDate`. */
function consecutiveDays(endDate: string, count: number): string[] {
  const out: string[] = [];
  const d = new Date(`${endDate}T12:00:00Z`);
  for (let i = 0; i < count; i++) {
    out.unshift(d.toISOString().split('T')[0]);
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return out;
}

function callRoute(timezone = 'America/New_York') {
  const req = new NextRequest('http://localhost/api/streak', {
    headers: { 'x-timezone': timezone },
  });
  return GET(req);
}

describe('GET /api/streak — course-only user', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (db as unknown as { __resetSelectCall: () => void }).__resetSelectCall();
    mockGetAuthUserId.mockResolvedValue('user-1');
    vi.useFakeTimers();
    // Noon UTC so "today" is 2026-08-25 in both New York and Jerusalem.
    vi.setSystemTime(new Date('2026-08-25T12:00:00Z'));
  });

  it('reads the streak from user_progress.active_days when there are no practice sessions', async () => {
    // A course-only user: 14 straight days of lessons, zero session_history rows.
    const activeDays = consecutiveDays('2026-08-25', 14);
    mockRows.sessionDates = [];
    mockRows.userProgress = [{ lastActiveDate: '2026-08-25', activeDays, streakFreezes: 0 }];
    mockRows.courseProgress = [{ lastActiveDate: '2026-08-25' }];

    const res = await callRoute();
    const body = await res.json();

    // Before active_days was included the server saw a single date and answered 1,
    // which applyServerStreak then wrote over the client's real streak.
    expect(body.currentStreak).toBe(14);
  });

  it('still answers 1 when active_days genuinely holds only today', async () => {
    mockRows.sessionDates = [];
    mockRows.userProgress = [{ lastActiveDate: '2026-08-25', activeDays: ['2026-08-25'], streakFreezes: 0 }];
    mockRows.courseProgress = [{ lastActiveDate: '' }];

    const res = await callRoute();
    const body = await res.json();

    expect(body.currentStreak).toBe(1);
  });

  it('tolerates a null active_days column', async () => {
    mockRows.sessionDates = [];
    mockRows.userProgress = [{ lastActiveDate: '2026-08-25', activeDays: null, streakFreezes: 0 }];
    mockRows.courseProgress = [{ lastActiveDate: '2026-08-24' }];

    const res = await callRoute();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.currentStreak).toBe(2);
  });

  it('merges practice session dates with course active days', async () => {
    mockRows.sessionDates = [{ date: '2026-08-20' }, { date: '2026-08-21' }];
    mockRows.userProgress = [{
      lastActiveDate: '2026-08-25',
      activeDays: ['2026-08-22', '2026-08-23', '2026-08-24', '2026-08-25'],
      streakFreezes: 0,
    }];
    mockRows.courseProgress = [{ lastActiveDate: '2026-08-25' }];

    const res = await callRoute();
    const body = await res.json();

    expect(body.currentStreak).toBe(6);
  });
});
