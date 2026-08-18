import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseBody, jsonOk, jsonError, INVALID_REQUEST } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api/guards';
import { assignUserToLeague, getLeagueLeaderboard, updateMemberXp } from '@/lib/league-matching';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_INITIAL_WEEKLY_XP = 5000;
const INVALID_WEEK_START = 'Invalid weekStart (must be a Monday)';

const postLeagueSchema = z.object({
  tier: z.number().int().min(1).max(5),
  weekStart: z.string().regex(DATE_PATTERN),
  weeklyXp: z.number().min(0).optional(),
});

const patchLeagueSchema = z.object({
  weekStart: z.string().regex(DATE_PATTERN),
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
export const GET = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const weekStart = request.nextUrl.searchParams.get('weekStart');
  if (!weekStart || !DATE_PATTERN.test(weekStart) || !isMonday(weekStart)) {
    return jsonError('Invalid weekStart (must be a Monday date YYYY-MM-DD)', 400);
  }

  const leaderboard = await getLeagueLeaderboard(userId, weekStart);
  if (!leaderboard) {
    return jsonOk({ members: null });
  }

  return jsonOk(leaderboard);
});

/**
 * POST /api/league
 * Body: { tier: number, weekStart: string }
 * Assigns user to a league group. Returns groupId + full leaderboard.
 */
export const POST = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const { data, error } = await parseBody(request, postLeagueSchema, {
    invalidInput: INVALID_REQUEST,
  });
  if (error) return error;
  const { tier, weekStart, weeklyXp } = data;

  if (!isMonday(weekStart)) {
    return jsonError(INVALID_WEEK_START, 400);
  }
  const initialXp = typeof weeklyXp === 'number' && weeklyXp >= 0
    ? Math.min(Math.floor(weeklyXp), MAX_INITIAL_WEEKLY_XP)
    : 0;

  const groupId = await assignUserToLeague(userId, tier as 1 | 2 | 3 | 4 | 5, weekStart, initialXp);
  const leaderboard = await getLeagueLeaderboard(userId, weekStart);

  return jsonOk({ groupId, ...leaderboard });
});

/**
 * PATCH /api/league
 * Body: { weekStart: string, xpDelta: number }
 * Increments user's weekly XP in their league membership.
 */
export const PATCH = withAuth(async (request, { userId }): Promise<NextResponse> => {
  const { data, error } = await parseBody(request, patchLeagueSchema, {
    invalidInput: INVALID_REQUEST,
  });
  if (error) return error;
  const { weekStart, xpDelta } = data;

  if (!isMonday(weekStart)) {
    return jsonError(INVALID_WEEK_START, 400);
  }

  await updateMemberXp(userId, weekStart, Math.floor(xpDelta));

  return jsonOk({ ok: true });
});
