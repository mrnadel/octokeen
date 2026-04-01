ALTER TABLE "user_progress" ADD COLUMN "gems_inventory" jsonb DEFAULT '{"activeTitles":[],"activeFrames":[]}'::jsonb;
ALTER TABLE "user_progress" ADD COLUMN "selected_title" text;
ALTER TABLE "user_progress" ADD COLUMN "selected_frame" text;
ALTER TABLE "user_progress" ADD COLUMN "double_xp_expiry" text;
ALTER TABLE "user_progress" ADD COLUMN "hearts_current" integer DEFAULT 5;
ALTER TABLE "user_progress" ADD COLUMN "hearts_last_recharge_at" text;
