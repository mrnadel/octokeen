import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoist mutable mocks so vi.mock factories can reference them ────────────
const { mockGetAuthUserId, mockInsertValues } = vi.hoisted(() => ({
  mockGetAuthUserId: vi.fn(),
  /** Captures what POST actually writes into user_progress. */
  mockInsertValues: vi.fn(),
}));

// ── Module mocks ────────────────────────────────────────────────────────────

vi.mock('@/lib/auth-utils', () => ({
  getAuthUserId: mockGetAuthUserId,
  requireAdmin: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/lib/db', () => {
  const limitMock = vi.fn().mockResolvedValue([]);
  const orderByMock = vi.fn().mockReturnValue({ limit: limitMock });
  const whereMock = vi.fn().mockReturnValue({ limit: limitMock, orderBy: orderByMock });
  const fromMock = vi.fn().mockReturnValue({ where: whereMock });

  const chainMock = {
    select: vi.fn().mockReturnValue({ from: fromMock }),
    insert: vi.fn().mockReturnValue({
      values: mockInsertValues.mockReturnValue({
        onConflictDoNothing: vi.fn().mockResolvedValue([]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
    }),
    delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
    transaction: vi.fn().mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      await fn(chainMock);
    }),
  };

  return { db: chainMock };
});

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 29, resetAt: new Date() })),
  RATE_LIMITS: {
    auth: { limit: 5, windowMs: 60000 },
    api: { limit: 30, windowMs: 60000 },
    webhook: { limit: 100, windowMs: 60000 },
  },
}));

vi.mock('@/lib/access-control', () => ({
  incrementDailyUsageBatch: vi.fn().mockResolvedValue(undefined),
  canStartPracticeSession: vi.fn().mockResolvedValue({ allowed: true, limit: 20 }),
}));

vi.mock('@/lib/activity-feed', () => ({
  insertActivity: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { GET, POST } from '@/app/api/progress/route';
import { NextRequest } from 'next/server';

describe('GET /api/progress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockGetAuthUserId.mockResolvedValue(null);
    const res = await GET(new NextRequest('http://localhost/api/progress'));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 404 when user row is not found in DB', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');
    // db.select is mocked to return [] — user not found
    const res = await GET(new NextRequest('http://localhost/api/progress'));
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('User not found');
  });

  it('GET returns 200 with user progress when authenticated', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');

    const { db } = await import('@/lib/db');
    // db.select is called 4 times in parallel (users, userProgress, topicProgress, sessionHistory)
    // Return realistic shapes for each call
    vi.mocked(db.select)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 'user-abc', displayName: 'Test User', name: 'Test User', joinedDate: '2026-01-01' },
            ]),
          }),
        }),
      } as never)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                currentLevel: 3,
                totalXp: 450,
                currentStreak: 5,
                longestStreak: 10,
                lastActiveDate: '2026-05-22',
                activeDays: ['2026-05-22'],
                achievementsUnlocked: ['first_session'],
                dailyChallengesCompleted: 2,
                totalQuestionsAttempted: 50,
                totalQuestionsCorrect: 38,
                bookmarkedQuestions: [],
                weakAreas: [],
                strongAreas: [],
              },
            ]),
          }),
        }),
      } as never)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as never)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      } as never);

    const res = await GET(new NextRequest('http://localhost/api/progress'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.progress).toBeDefined();
    expect(json.progress.userId).toBe('user-abc');
    expect(json.progress.displayName).toBe('Test User');
    expect(json.progress.totalXp).toBe(450);
  });
});

describe('POST /api/progress', () => {
  function makePostRequest(body: unknown) {
    return new NextRequest('http://localhost/api/progress', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockGetAuthUserId.mockResolvedValue(null);
    const req = makePostRequest({ progress: { totalXp: 0, currentStreak: 0, longestStreak: 0, lastActiveDate: '2026-05-22' } });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 400 for invalid JSON body', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');
    const req = new NextRequest('http://localhost/api/progress', {
      method: 'POST',
      body: 'not-json',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when required progress fields are missing', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');
    // Missing required fields: totalXp, currentStreak, longestStreak, lastActiveDate
    const req = makePostRequest({ progress: { displayName: 'Alice' } });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  // ── Timezone capture ──────────────────────────────────────────────────────
  // The streak-reminder cron buckets users by their own calendar day, which it
  // can only do if the zone the client already sends actually gets stored.

  const VALID_PROGRESS = {
    displayName: 'Alice',
    totalXp: 100,
    currentLevel: 2,
    currentStreak: 3,
    longestStreak: 5,
    lastActiveDate: '2026-01-15',
    activeDays: ['2026-01-15'],
    topicProgress: [],
    sessionHistory: [],
  };

  function postWithTimezone(timezone?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (timezone !== undefined) headers['X-Timezone'] = timezone;
    return new NextRequest('http://localhost/api/progress', {
      method: 'POST',
      body: JSON.stringify({ progress: VALID_PROGRESS }),
      headers,
    });
  }

  /** The values object POST passed to `db.insert(userProgress)`. */
  function insertedProgressRow(): Record<string, unknown> {
    return mockInsertValues.mock.calls[0][0] as Record<string, unknown>;
  }

  it('stores a valid IANA timezone from the X-Timezone header', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');
    const res = await POST(postWithTimezone('America/New_York'));

    expect(res.status).toBe(200);
    expect(insertedProgressRow().timezone).toBe('America/New_York');
  });

  it('omits the column entirely when no header is sent', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');
    const res = await POST(postWithTimezone());

    expect(res.status).toBe(200);
    // Omitted rather than written as null, so a zone captured on an earlier sync
    // survives a request that happens to arrive without the header.
    expect(insertedProgressRow()).not.toHaveProperty('timezone');
  });

  it('drops a malformed header without failing the sync', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');

    for (const bad of ['Not/AZone', "'; DROP TABLE user_progress; --", '', 'A'.repeat(300)]) {
      mockInsertValues.mockClear();
      const res = await POST(postWithTimezone(bad));

      // A bad header must never break a progress sync — that would be a far
      // worse bug than the mistimed nudge this column exists to fix.
      expect(res.status, bad).toBe(200);
      expect(insertedProgressRow(), bad).not.toHaveProperty('timezone');
    }
  });
});
