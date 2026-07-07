-- Enable RLS on tables missed in 0007_enable_rls_all_tables.
-- No policies needed — Drizzle connects as postgres owner which bypasses RLS.
-- PostgREST (anon/authenticated) is fully blocked.

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_reactions ENABLE ROW LEVEL SECURITY;
