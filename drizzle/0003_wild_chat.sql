ALTER TABLE "transactions" ADD COLUMN "stripe_invoice_id" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "invoice_url" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "invoice_pdf_url" text;