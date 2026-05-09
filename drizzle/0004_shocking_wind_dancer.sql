ALTER TABLE "transactions" ADD COLUMN "receipt_number" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "payment_method_brand" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "payment_method_last4" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "paid_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receipt_number_unique" UNIQUE("receipt_number");