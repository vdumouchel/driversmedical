CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"intake_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"transaction_id" text NOT NULL,
	"province_required" text NOT NULL,
	"anvil_template_id" text NOT NULL,
	"pdf" "bytea" NOT NULL,
	"pdf_content_type" text DEFAULT 'application/pdf' NOT NULL,
	"pdf_size_bytes" integer NOT NULL,
	"email_form_sent_to" text,
	"form_email_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_intake_id_intakes_id_fk" FOREIGN KEY ("intake_id") REFERENCES "public"."intakes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "forms_intake_idx" ON "forms" USING btree ("intake_id");--> statement-breakpoint
CREATE INDEX "forms_user_idx" ON "forms" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "forms_transaction_idx" ON "forms" USING btree ("transaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "forms_intake_template_uniq" ON "forms" USING btree ("intake_id","anvil_template_id");