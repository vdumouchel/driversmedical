import { NextResponse } from "next/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { getResend, getResendFrom } from "@/lib/resend";
import { brand } from "@/config/brand";

export const runtime = "nodejs";

const DEFAULT_RECIPIENT =
  process.env.FORM_DEFAULT_RECIPIENT_EMAIL ?? "vdumouchel@me.com";

type Payload = {
  formId: string;
  email?: string;
};

export async function POST(req: Request) {
  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "Resend not configured" },
      { status: 500 },
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { formId, email } = body;
  if (!formId) {
    return NextResponse.json({ error: "formId is required" }, { status: 400 });
  }

  const recipient = email || DEFAULT_RECIPIENT;

  console.log(`[forms/send] form=${formId}: reading PDF bytes from DB`);

  const [form] = await db
    .select()
    .from(forms)
    .where(eq(forms.id, formId))
    .limit(1);

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const filename = `${form.provinceRequired}-medical-form.pdf`;
  const base64Pdf = Buffer.from(form.pdf).toString("base64");

  console.log(
    `[forms/send] form=${form.id}: read PDF bytes=${form.pdf.length} base64Length=${base64Pdf.length} filename=${filename}`,
  );
  console.log(
    `[forms/send] form=${form.id}: sending PDF via Resend as base64 attachment to=${recipient}`,
  );

  await resend.emails.send({
    from: getResendFrom(),
    to: recipient,
    subject: `${brand.siteName} — Filled Medical Form (${form.provinceRequired})`,
    html: [
      "<p>Please find your filled medical form attached.</p>",
      `<p>Province: ${form.provinceRequired}</p>`,
      `<p style="color:#999;font-size:12px;">Form ID: ${form.id}</p>`,
    ].join(""),
    attachments: [
      {
        filename,
        content: base64Pdf,
      },
    ],
  });

  console.log(`[forms/send] form=${form.id}: Resend send completed`);

  const updated = await db
    .update(forms)
    .set({
      emailFormSentTo: recipient,
      formEmailSentAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(eq(forms.id, formId), isNull(forms.formEmailSentAt)),
    )
    .returning({ id: forms.id });

  console.log(
    `[forms/send] form=${form.id}: updated email_form_sent_to + form_email_sent_at rows=${updated.length}`,
  );

  return NextResponse.json({
    ok: true,
    sentTo: recipient,
    formId: form.id,
  });
}
