import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoist mutable mocks so vi.mock factories can reference them ────────────
const { mockGetAuthUserId, mockRateLimit } = vi.hoisted(() => ({
  mockGetAuthUserId: vi.fn(),
  mockRateLimit: vi.fn(() => ({
    success: true,
    remaining: 29,
    resetAt: new Date(Date.now() + 60000),
  })),
}));

// ── Module mocks ────────────────────────────────────────────────────────────

vi.mock('@/lib/auth-utils', () => ({
  getAuthUserId: mockGetAuthUserId,
  requireAdmin: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: mockRateLimit,
  RATE_LIMITS: {
    auth: { limit: 5, windowMs: 60000 },
    api: { limit: 30, windowMs: 60000 },
    webhook: { limit: 100, windowMs: 60000 },
  },
}));

vi.mock('@/lib/db', () => {
  // computeGemBalanceFromLedger uses db.select with SQL expressions
  // and returns [{ balance, totalEarned }]. We need to support both
  // no-arg select() (used by regular queries) and the aggregation form.
  const aggResult = [{ balance: 0, totalEarned: 0 }];

  const limitMock = vi.fn().mockResolvedValue([]);
  const whereMock = vi.fn().mockReturnValue({ limit: limitMock });
  const fromMock = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(aggResult) });

  return {
    db: {
      select: vi.fn().mockReturnValue({ from: fromMock }),
      insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue([]) }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
      }),
      delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
    },
  };
});

vi.mock('@/lib/activity-feed', () => ({
  insertActivity: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { POST } from '@/app/api/engagement/route';
import { NextRequest } from 'next/server';

const validEngagementBody = {
  gems: {
    balance: 100,
    totalEarned: 200,
    inventory: { activeTitles: [], activeFrames: [] },
    selectedTitle: null,
    selectedFrame: null,
  },
  streak: { freezesOwned: 0, milestonesReached: [] },
  hearts: { current: 5, lastRechargeAt: Date.now() },
  doubleXpExpiry: null,
};

function makePostRequest(body: unknown) {
  return new NextRequest('http://localhost/api/engagement', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('GET /api/engagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthUserId.mockResolvedValue('user-abc');
  });

  it('returns 401 when not authenticated', async () => {
    mockGetAuthUserId.mockResolvedValue(null);
    const { GET } = await import('@/app/api/engagement/route');
    const res = await GET(new NextRequest('http://localhost/api/engagement'));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('GET returns 200 with engagement state when authenticated', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');

    const { db } = await import('@/lib/db');

    // GET calls Promise.all with: userProgress, questProgress, computeGemBalanceFromLedger, isProUser
    // computeGemBalanceFromLedger uses db.select with .from(gemTransactions).where() -> returns [{ balance, totalEarned }]
    // isProUser uses db.select with .from(subscriptions).where().limit(1)
    // userProgress: db.select().from(userProgress).where().limit(1)
    // questProgress: db.select().from(questProgress).where()

    vi.mocked(db.select)
      // 1) userProgress query
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                heartsCurrent: 5,
                heartsLastRechargeAt: String(Date.now()),
                streakFreezes: 0,
                streakMilestones: [],
                gemsInventory: { activeTitles: [], activeFrames: [] },
                selectedTitle: null,
                selectedFrame: null,
                doubleXpExpiry: null,
                dailyRewardCalendar: null,
              },
            ]),
          }),
        }),
      } as never)
      // 2) questProgress query
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as never)
      // 3) computeGemBalanceFromLedger: db.select({...}).from(gemTransactions).where()
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ balance: 50, totalEarned: 100 }]),
        }),
      } as never)
      // 4) isProUser: db.select().from(subscriptions).where().limit(1) => no subscription
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as never);

    const { GET } = await import('@/app/api/engagement/route');
    const res = await GET(new NextRequest('http://localhost/api/engagement'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.gems).toBeDefined();
    expect(json.hearts).toBeDefined();
    expect(json.streak).toBeDefined();
  });
});

describe('POST /api/engagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthUserId.mockResolvedValue('user-abc');
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 29,
      resetAt: new Date(Date.now() + 60000),
    });
  });

  it('returns 401 when not authenticated', async () => {
    mockGetAuthUserId.mockResolvedValue(null);
    const req = makePostRequest(validEngagementBody);
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 429 when rate limit is exceeded', async () => {
    mockRateLimit.mockReturnValue({
      success: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 60000),
    });
    const req = makePostRequest(validEngagementBody);
    const res = await POST(req);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toMatch(/too many requests/i);
  });

  it('returns 400 when body is invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/engagement', {
      method: 'POST',
      body: 'not-json',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when required fields are missing', async () => {
    const req = makePostRequest({ gems: { balance: 0 } }); // missing required fields
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });
});
