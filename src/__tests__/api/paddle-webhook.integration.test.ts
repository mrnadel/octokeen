import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock heavy modules BEFORE route import ─────────────────────────────────
vi.mock('@/lib/env', () => ({
  serverEnv: vi.fn(() => ({
    PADDLE_API_KEY: 'pdl_sdbx_test_key',
    PADDLE_WEBHOOK_SECRET: 'test_webhook_secret',
    PADDLE_PRO_MONTHLY_PRICE_ID: 'pri_monthly_test',
    PADDLE_PRO_YEARLY_PRICE_ID: 'pri_yearly_test',
  })),
}));

// The Paddle SDK is instantiated with `new Paddle(...)` at module load.
// The factory must return a proper constructor (function, not arrow function).
vi.mock('@paddle/paddle-node-sdk', () => {
  const mockUnmarshal = vi.fn().mockRejectedValue(new Error('Invalid signature'));
  function MockPaddle() {
    return {
      webhooks: { unmarshal: mockUnmarshal },
      customers: { get: vi.fn() },
    };
  }
  return {
    Paddle: MockPaddle,
    Environment: { sandbox: 'sandbox', production: 'production' },
    EventName: {},
  };
});

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }),
      }),
    }),
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue([]) }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
    }),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 99, resetAt: new Date() })),
  RATE_LIMITS: {
    webhook: { limit: 100, windowMs: 60000 },
    auth: { limit: 5, windowMs: 60000 },
    api: { limit: 30, windowMs: 60000 },
  },
}));

import { POST } from '@/app/api/paddle/webhook/route';
import { NextRequest } from 'next/server';

function makeWebhookRequest(body: string, headers?: Record<string, string>) {
  return new NextRequest('http://localhost/api/paddle/webhook', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

describe('POST /api/paddle/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects requests without paddle-signature header', async () => {
    const req = makeWebhookRequest('{"test":true}');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Missing signature');
  });

  it('rejects requests with invalid signature', async () => {
    // The mocked paddle.webhooks.unmarshal rejects, route returns 400.
    const req = makeWebhookRequest('{"test":true}', {
      'paddle-signature': 'ts=1234567890;h1=invalidsignature',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid signature');
  });
});
