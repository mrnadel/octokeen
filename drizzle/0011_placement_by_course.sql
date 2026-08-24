ALTER TABLE "course_progress" ADD COLUMN IF NOT EXISTS "placement_by_course" jsonb DEFAULT '{}'::jsonb;
--> statement-breakpoint
-- Backfill: the old course-agnostic placement belonged to whichever course was
-- active when it was written. Attribute it there so other courses start clean.
UPDATE "course_progress"
SET "placement_by_course" = jsonb_build_object(
  COALESCE("active_profession", 'personal-finance'),
  "placement_unit_index"
)
WHERE "placement_unit_index" > 0
  AND ("placement_by_course" IS NULL OR "placement_by_course" = '{}'::jsonb);
