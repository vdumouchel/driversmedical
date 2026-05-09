ALTER TABLE "transactions" ADD COLUMN "receipt_id" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "receipt_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");