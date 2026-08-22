-- Mechanical Engineering is access-gated (professions.requiresAccess) and is no
-- longer part of the product, but course_progress.active_profession still
-- defaulted to it. Every new account therefore landed in an ungranted course:
-- the onboarding asked "How much Mechanical Engineering do you know?" and the
-- home screen showed Statics & Equilibrium.
--
-- Point the default at the same course the code now defaults to
-- (DEFAULT_PROFESSION in src/data/professions.ts).

ALTER TABLE course_progress
  ALTER COLUMN active_profession SET DEFAULT 'personal-finance';
