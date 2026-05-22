import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoist mutable mocks so vi.mock factories can reference them ────────────
const { mockRateLimit } = vi.hoisted(() => ({
  mockRateLimit: vi.fn(() => ({
    success: true,
    remaining: 4,
    resetAt: new Date(Date.now() + 60000),
  })),
}));

// ── Module mocks ────────────────────────────────────────────────────────────

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]), // no existing user by default
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          { id: 'user-123', email: 'test@example.com', displayName: 'Test User' },
        ]),
      }),
    }),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: mockRateLimit,
  RATE_LIMITS: {
    auth: { limit: 5, windowMs: 60000 },
    api: { limit: 30, windowMs: 60000 },
    webhook: { limit: 100, windowMs: 60000 },
  },
}));

// bcrypt is slow; mock hash to speed up tests
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$2b$12$hashedpassword'),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue('$2b$12$hashedpassword'),
  compare: vi.fn().mockResolvedValue(true),
}));

import { POST } from '@/app/api/auth/register/route';
import { NextRequest } from 'next/server';

function makeRegisterRequest(body: unknown, ip?: string) {
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip ?? '127.0.0.1',
    },
  });
}

const validBody = {
  email: 'test@example.com',
  password: 'SecurePass1!',
  displayName: 'Test User',
};

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 4,
      resetAt: new Date(Date.now() + 60000),
    });
  });

  it('returns 400 when required fields are missing', async () => {
    const req = makeRegisterRequest({ email: 'test@example.com' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 400 for invalid email format', async () => {
    const req = makeRegisterRequest({ ...validBody, email: 'not-an-email' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 400 for password that does not meet requirements', async () => {
    const req = makeRegisterRequest({ ...validBody, password: 'weak' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 429 when rate limit is exceeded', async () => {
    mockRateLimit.mockReturnValue({
      success: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 60000),
    });

    const req = makeRegisterRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toMatch(/too many requests/i);
  });

  it('returns 201 with user data on valid registration', async () => {
    const req = makeRegisterRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.user).toBeDefined();
    expect(json.user.email).toBe('test@example.com');
  });

  it('returns 409 when email already exists', async () => {
    // Override the db mock so the select query returns an existing user row
    const { db } = await import('@/lib/db');
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 'existing-user-1' }]),
        }),
      }),
    } as never);

    const req = makeRegisterRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });
});
