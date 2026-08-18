import { describe, it, expect } from 'vitest';
import { NextResponse } from 'next/server';
import { jsonError, jsonOk, rateLimited } from '@/lib/api-helpers';

/**
 * Contract lock for the shared response helpers.
 *
 * `jsonError`/`jsonOk` replaced inline `NextResponse.json(...)` calls in ~70
 * route handlers, and `rateLimited` replaced a hand-rolled 429 + Retry-After
 * block in 15. A silent change to any of them — an added header, a reshaped
 * body — is a client-visible API break that `tsc` cannot see. These tests
 * assert the helpers stay byte-identical to the inline forms they replaced.
 */

interface ResponseSnapshot {
  status: number;
  body: string;
  headers: Record<string, string>;
}

async function snapshot(res: NextResponse): Promise<ResponseSnapshot> {
  return {
    status: res.status,
    body: await res.text(),
    headers: Object.fromEntries([...res.headers.entries()].sort()),
  };
}

describe('jsonError', () => {
  const cases: Array<[string, number]> = [
    ['Unauthorized', 401],
    ['Forbidden', 403],
    ['Invalid JSON', 400],
    ['User not found', 404],
    ['Quest expired', 410],
    ['Too many requests', 429],
    ['Webhook handler failed', 500],
    ['Failed to load subscription details', 502],
  ];

  for (const [message, status] of cases) {
    it(`matches the inline form for ${status} "${message}"`, async () => {
      const inline = await snapshot(NextResponse.json({ error: message }, { status }));
      const helper = await snapshot(jsonError(message, status));

      expect(helper).toEqual(inline);
      expect(helper.status).toBe(status);
      expect(helper.body).toBe(JSON.stringify({ error: message }));
    });
  }
});

describe('jsonOk', () => {
  it('matches NextResponse.json for a bare payload', async () => {
    expect(await snapshot(jsonOk({ ok: true })))
      .toEqual(await snapshot(NextResponse.json({ ok: true })));
  });

  it('honours a ResponseInit, e.g. the 201 on register', async () => {
    expect(await snapshot(jsonOk({ user: { id: 'u1' } }, { status: 201 })))
      .toEqual(await snapshot(NextResponse.json({ user: { id: 'u1' } }, { status: 201 })));
  });
});

describe('rateLimited', () => {
  it('matches the inline 429 + Retry-After block', async () => {
    const resetAt = new Date(Date.now() + 42_000);
    const inline = NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((resetAt.getTime() - Date.now()) / 1000).toString(),
        },
      },
    );

    const result = await snapshot(rateLimited(resetAt));
    expect(result).toEqual(await snapshot(inline));
    expect(result.headers['retry-after']).toBe('42');
  });

  it('accepts the longer user-facing message used by auth and billing routes', async () => {
    const message = 'Too many requests. Please try again later.';
    const result = await snapshot(rateLimited(new Date(Date.now() + 60_000), message));

    expect(result.status).toBe(429);
    expect(result.body).toBe(JSON.stringify({ error: message }));
    expect(result.headers['retry-after']).toBe('60');
  });
});
