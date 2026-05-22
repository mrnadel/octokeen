import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoist mutable mocks so vi.mock factories can reference them ────────────
const { mockGetAuthUserId } = vi.hoisted(() => ({
  mockGetAuthUserId: vi.fn(),
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
      values: vi.fn().mockReturnValue({ onConflictDoNothing: vi.fn().mockResolvedValue([]) }),
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
    const res = await GET();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 404 when user row is not found in DB', async () => {
    mockGetAuthUserId.mockResolvedValue('user-abc');
    // db.select is mocked to return [] — user not found
    const res = await GET();
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('User not found');
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
});
