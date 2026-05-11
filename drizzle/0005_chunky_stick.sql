ALTER TABLE "transactions" DROP COLUMN IF EXISTS "stripe_invoice_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "invoice_url";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "invoice_pdf_url";
