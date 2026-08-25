-- The streak-reminder cron (src/app/api/cron/streak-reminder/route.ts) fires once
-- per day at 19:00 UTC and matched UTC date keys against
-- user_progress.last_active_date, which the client writes in *local* time. Every
-- user at UTC+5 or further east was therefore nudged a day off: the day-2
-- "your streak breaks tomorrow" message landed on the day the day-1 nudge was due.
--
-- The client already sends its IANA zone on every sync (the X-Timezone header set
-- by timezoneHeaders() in src/lib/db-sync/utils.ts). /api/progress now persists it
-- here so the cron can resolve each user's own calendar day instead of the
-- server's.
--
-- Deliberately nullable with no default. Every existing row predates the capture,
-- and a DEFAULT 'UTC' would be a lie the cron could not tell apart from a user who
-- genuinely lives in UTC — reintroducing exactly this bug for that population.
-- NULL means "not known yet"; the cron falls back to UTC for those rows, which is
-- the behaviour they already have today, and each row self-heals on the user's
-- next progress sync.

ALTER TABLE "user_progress" ADD COLUMN IF NOT EXISTS "timezone" text;
