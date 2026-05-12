import { db } from "@/db";
import { forms, transactions, intakes, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { fillPdf } from "@/lib/anvil";
import {
  NB_ANVIL_TEMPLATE_ID,
  buildNewBrunswickPayload,
} from "@/lib/forms/new-brunswick-anvil";

interface ProvinceTemplate {
  templateId: string;
  buildPayload: (answers: Record<string, unknown>) => Parameters<typeof fillPdf>[1];
}

const PROVINCE_TEMPLATES: Record<string, ProvinceTemplate> = {
  "new-brunswick": {
    templateId: NB_ANVIL_TEMPLATE_ID,
    buildPayload: buildNewBrunswickPayload,
  },
};

/**
 * Generate the filled PDF for a given Stripe PaymentIntent if all conditions
 * are met:
 *  - The province has a registered Anvil template
 *  - The form hasn't already been generated for this intake + template
 *
 * Designed to be called fire-and-forget from the Stripe webhook. Failures are
 * logged but never rethrown so they don't break webhook delivery.
 */
export async function generateFormForPaymentIntent(piId: string) {
  console.log(`[form-gen] PI ${piId}: loading transaction + intake + user from DB`);

  const rows = await db
    .select({
      txn: transactions,
      intake: intakes,
      user: users,
    })
    .from(transactions)
    .innerJoin(intakes, eq(intakes.id, transactions.intakeId))
    .innerJoin(users, eq(users.id, transactions.userId))
    .where(eq(transactions.transactionId, piId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    console.log(`[form-gen] PI ${piId}: no transaction row found — skipping`);
    return;
  }

  const province = row.txn.provinceRequired;
  console.log(
    `[form-gen] PI ${piId}: loaded DB records txn=${row.txn.id} intake=${row.intake.id} user=${row.user.id} province=${province}`,
  );

  const template = PROVINCE_TEMPLATES[province];
  if (!template) {
    console.log(
      `[form-gen] PI ${piId}: province "${province}" has no Anvil template — skipping`,
    );
    return;
  }

  // Idempotency: skip if already generated for this intake + template.
  const existing = await db
    .select({ id: forms.id })
    .from(forms)
    .where(
      and(
        eq(forms.intakeId, row.intake.id),
        eq(forms.anvilTemplateId, template.templateId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    console.log(
      `[form-gen] PI ${piId}: form already exists (${existing[0].id}) — skipping`,
    );
    return;
  }

  const answers = (row.intake.answers ?? {}) as Record<string, unknown>;
  console.log(
    `[form-gen] PI ${piId}: building Anvil payload from ${Object.keys(answers).length} intake answers`,
  );
  const payload = template.buildPayload(answers);
  console.log(
    `[form-gen] PI ${piId}: built Anvil payload title="${payload.title ?? ""}" dataKeys=${Object.keys(payload.data).join(",")}`,
  );

  console.log(
    `[form-gen] PI ${piId}: calling Anvil fill for template ${template.templateId}`,
  );
  const pdfBuffer = await fillPdf(template.templateId, payload);
  console.log(
    `[form-gen] PI ${piId}: received Anvil PDF bytes=${pdfBuffer.length}`,
  );

  console.log(
    `[form-gen] PI ${piId}: inserting PDF into forms table as bytea`,
  );
  const [inserted] = await db
    .insert(forms)
    .values({
      intakeId: row.intake.id,
      userId: row.user.id,
      transactionId: piId,
      provinceRequired: province,
      anvilTemplateId: template.templateId,
      pdf: pdfBuffer,
      pdfSizeBytes: pdfBuffer.length,
    })
    .returning({ id: forms.id });

  console.log(
    `[form-gen] PI ${piId}: inserted form=${inserted.id} into forms table bytes=${pdfBuffer.length}`,
  );
}
