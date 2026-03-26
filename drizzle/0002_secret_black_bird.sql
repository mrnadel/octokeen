CREATE TABLE "push_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "buckets" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "correct_buckets" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "match_targets" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "correct_matches" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "steps" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "correct_order" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "correct_indices" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "slider_min" real;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "slider_max" real;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "correct_value" real;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "tolerance" real;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "unit" text;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "scenario" text;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "rank_criteria" text;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "tap_zones" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "correct_zone_id" text;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "push_subscriptions_endpoint_idx" ON "push_subscriptions" USING btree ("endpoint");--> statement-breakpoint
CREATE INDEX "push_subscriptions_user_idx" ON "push_subscriptions" USING btree ("user_id");