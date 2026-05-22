import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUserId } from '@/lib/auth-utils';
import { assignUserToLeague, getLeagueLeaderboard, updateMemberXp } from '@/lib/league-matching';

const postLeagueSchema = z.object({
  tier: z.number().int().min(1).max(5),
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weeklyXp: z.number().min(0).optional(),
});

const patchLeagueSchema = z.object({
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  xpDelta: z.number().int().min(1).max(2500),
});

function isMonday(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.getUTCDay() === 1;
}

/**
 * GET /api/league?weekStart=2026-03-30
 * Returns the user's league leaderboard for the given week.
 */
export async function GET(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const weekStart = request.nextUrl.searchParams.get('weekStart');
  if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart) || !isMonday(weekStart)) {
    return NextResponse.json({ error: 'Invalid weekStart (must be a Monday date YYYY-MM-DD)' }, { status: 400 });
  }

  const leaderboard = await getLeagueLeaderboard(userId, weekStart);
  if (!leaderboard) {
    return NextResponse.json({ members: null });
  }

  return NextResponse.json(leaderboard);
}

/**
 * POST /api/league
 * Body: { tier: number, weekStart: string }
 * Assigns user to a league group. Returns groupId + full leaderboard.
 */
export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const postResult = postLeagueSchema.safeParse(rawBody);
  if (!postResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { tier, weekStart, weeklyXp } = postResult.data;

  if (!isMonday(weekStart)) {
    return NextResponse.json({ error: 'Invalid weekStart (must be a Monday)' }, { status: 400 });
  }
  const initialXp = typeof weeklyXp === 'number' && weeklyXp >= 0
    ? Math.min(Math.floor(weeklyXp), 5000)
    : 0;

  const groupId = await assignUserToLeague(userId, tier as 1 | 2 | 3 | 4 | 5, weekStart, initialXp);
  const leaderboard = await getLeagueLeaderboard(userId, weekStart);

  return NextResponse.json({ groupId, ...leaderboard });
}

/**
 * PATCH /api/league
 * Body: { weekStart: string, xpDelta: number }
 * Increments user's weekly XP in their league membership.
 */
export async function PATCH(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawPatchBody: unknown;
  try {
    rawPatchBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const patchResult = patchLeagueSchema.safeParse(rawPatchBody);
  if (!patchResult.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { weekStart, xpDelta } = patchResult.data;

  if (!isMonday(weekStart)) {
    return NextResponse.json({ error: 'Invalid weekStart (must be a Monday)' }, { status: 400 });
  }

  await updateMemberXp(userId, weekStart, Math.floor(xpDelta));

  return NextResponse.json({ ok: true });
}
