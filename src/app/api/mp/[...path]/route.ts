import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { jsonError, getClientIp, TOO_MANY_REQUESTS } from '@/lib/api-helpers';

const MIXPANEL_API = 'https://api-eu.mixpanel.com';

// Only allow known Mixpanel ingestion endpoints
const ALLOWED_ENDPOINTS = ['track', 'engage', 'groups', 'record'];

const PROXY_RATE_LIMIT = { limit: 60, windowMs: 60_000 };

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const rl = rateLimit(`mp-proxy:${getClientIp(req)}`, PROXY_RATE_LIMIT);
  if (!rl.success) {
    return jsonError(TOO_MANY_REQUESTS, 429);
  }

  const { path } = await params;
  const endpoint = path.join('/');

  // Validate the endpoint is a known Mixpanel ingestion path
  if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
    return jsonError('Invalid endpoint', 400);
  }

  const search = req.nextUrl.searchParams.toString();
  const body = await req.text();

  let resp: Response;
  try {
    resp = await fetch(`${MIXPANEL_API}/${endpoint}?${search}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  } catch {
    return jsonError('Upstream request failed', 502);
  }

  const data = await resp.text();
  return new NextResponse(data, {
    status: resp.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
