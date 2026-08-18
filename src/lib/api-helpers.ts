// ============================================================
// Shared API Route Helpers — Octokeen
// Response shapes, rate-limit responses, and request-body parsing.
// Auth guards live in `@/lib/api/guards` so importing these helpers
// does not pull in the NextAuth stack.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ─── Response Helpers ──────────────────────────────────────────

/** Shorthand for a successful JSON response. */
export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

/** Shorthand for a JSON error response. */
export function jsonError(error: string, status: number): NextResponse {
  return NextResponse.json({ error }, { status });
}

// ─── Rate Limiting ─────────────────────────────────────────────

/** Terse 429 message used by sync/proxy endpoints. */
export const TOO_MANY_REQUESTS = 'Too many requests';
/** User-facing 429 message used by auth and billing endpoints. */
export const TOO_MANY_REQUESTS_RETRY = 'Too many requests. Please try again later.';

/**
 * 429 response carrying a `Retry-After` header derived from the limiter's
 * reset time. Use `jsonError(msg, 429)` for endpoints that omit the header.
 */
export function rateLimited(resetAt: Date, message: string = TOO_MANY_REQUESTS): NextResponse {
  const retryAfterSeconds = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
  return NextResponse.json(
    { error: message },
    { status: 429, headers: { 'Retry-After': retryAfterSeconds.toString() } },
  );
}

/** Best-effort client IP from proxy headers, used as a rate-limit key. */
export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for') ?? 'unknown';
}

/**
 * Last path segment of the request URL. The `with*Auth` wrappers hide Next's
 * route-params argument, so dynamic-segment routes read the ID from the path.
 */
export function lastPathSegment(req: NextRequest): string {
  return req.nextUrl.pathname.split('/').pop() ?? '';
}

// ─── Body Parsing ──────────────────────────────────────────────

/** Generic schema-validation failure message, used where no field-specific text applies. */
export const INVALID_REQUEST = 'Invalid request';
/** Shared by the two destructive endpoints that require a typed confirmation phrase. */
export const INVALID_CONFIRMATION = 'Invalid confirmation phrase';

export interface ParseBodyOptions {
  /** Message when the body is not valid JSON. Defaults to `'Invalid JSON'`. */
  invalidJson?: string;
  /** Message when the body fails schema validation; suppresses the `details` field. */
  invalidInput?: string;
}

/**
 * Safely parse and validate a JSON request body against a Zod schema.
 * Returns `{ data }` on success or `{ error }` (a ready-to-return NextResponse) on failure.
 */
export async function parseBody<T>(
  req: NextRequest,
  schema: z.ZodType<T>,
  options: ParseBodyOptions = {},
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { error: jsonError(options.invalidJson ?? 'Invalid JSON', 400) };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    if (options.invalidInput) {
      return { error: jsonError(options.invalidInput, 400) };
    }
    return {
      error: NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues[0]?.message },
        { status: 400 },
      ),
    };
  }

  return { data: parsed.data };
}
