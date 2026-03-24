CREATE TABLE "friend_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "friendships" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"friend_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "friendship_order_check" CHECK (user_id < friend_id)
);
--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "blanks" jsonb;--> statement-breakpoint
ALTER TABLE "course_questions" ADD COLUMN "word_bank" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "invite_code" text;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_friend_id_users_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "friend_requests_pair_idx" ON "friend_requests" USING btree ("sender_id","receiver_id");--> statement-breakpoint
CREATE INDEX "friend_requests_receiver_idx" ON "friend_requests" USING btree ("receiver_id");--> statement-breakpoint
CREATE UNIQUE INDEX "friendships_pair_idx" ON "friendships" USING btree ("user_id","friend_id");--> statement-breakpoint
CREATE INDEX "friendships_user_idx" ON "friendships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "friendships_friend_idx" ON "friendships" USING btree ("friend_id");--> statement-breakpoint
CREATE INDEX "content_feedback_user_idx" ON "content_feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "course_lessons_unit_idx" ON "course_lessons" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "course_questions_lesson_idx" ON "course_questions" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "gem_transactions_user_idx" ON "gem_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "league_state_user_idx" ON "league_state" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_history_user_idx" ON "payment_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_history_status_created_idx" ON "payment_history" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "practice_questions_topic_idx" ON "practice_questions" USING btree ("topic");--> statement-breakpoint
CREATE UNIQUE INDEX "quest_progress_user_date_type_idx" ON "quest_progress" USING btree ("user_id","quest_date","quest_type");--> statement-breakpoint
CREATE INDEX "session_history_user_date_idx" ON "session_history" USING btree ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "session_history_session_id_idx" ON "session_history" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "subscriptions_paddle_customer_idx" ON "subscriptions" USING btree ("paddle_customer_id");--> statement-breakpoint
ALTER TABLE "league_state" ADD CONSTRAINT "league_state_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_invite_code_unique" UNIQUE("invite_code");