CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded');--> statement-breakpoint
CREATE TABLE "intakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"province_required" text NOT NULL,
	"form_required" text,
	"license_class" text,
	"answers" jsonb NOT NULL,
	"transaction_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"intake_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"province_required" text NOT NULL,
	"transaction_id" text NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"subtotal_amount" integer NOT NULL,
	"taxes_total_amount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer NOT NULL,
	"stripe_fees_amount" integer,
	"available_amount_after_stripe_fees" integer,
	"stripe_charge_id" text,
	"stripe_balance_transaction_id" text,
	"currency" text DEFAULT 'cad' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" date,
	"city" text,
	"phone_number" text,
	"postal_code" text,
	"license_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "intakes" ADD CONSTRAINT "intakes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_intake_id_intakes_id_fk" FOREIGN KEY ("intake_id") REFERENCES "public"."intakes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "intakes_user_idx" ON "intakes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "intakes_transaction_idx" ON "intakes" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "transactions_intake_idx" ON "transactions" USING btree ("intake_id");--> statement-breakpoint
CREATE INDEX "transactions_user_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_license_number_idx" ON "users" USING btree ("license_number");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone_number");