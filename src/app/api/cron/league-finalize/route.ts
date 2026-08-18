import { finalizeLeagueWeek } from '@/lib/league-matching';
import { logger } from '@/lib/logger';
import { jsonOk, jsonError } from '@/lib/api-helpers';
import { withCronAuth } from '@/lib/api/guards';
import { getUtcWeekMonday } from '@/lib/server-dates';

const DAYS_PER_WEEK = 7;
const MS_PER_DAY = 86_400_000;
const MONDAY = 1;

/**
 * GET /api/cron/league-finalize
 * Runs every Monday at 00:05 UTC. Finalizes the PREVIOUS week's league groups:
 * calculates final ranks, promotes/demotes real users, marks groups as finalized.
 *
 * Secured by CRON_SECRET.
 */
export const GET = withCronAuth(async () => {
  // Most recent past Monday: if today is Monday, step back a full week so we
  // finalize the week that just ended rather than the one in progress.
  const now = new Date();
  const reference = now.getUTCDay() === MONDAY
    ? new Date(now.getTime() - DAYS_PER_WEEK * MS_PER_DAY)
    : now;
  const weekStart = getUtcWeekMonday(reference);

  try {
    const processed = await finalizeLeagueWeek(weekStart);
    return jsonOk({
      ok: true,
      weekStart,
      groupsFinalized: processed,
    });
  } catch (err) {
    logger.error('League finalization error:', err);
    return jsonError('Finalization failed', 500);
  }
});
