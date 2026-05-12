import { NextResponse } from "next/server";
import { generateFormForPaymentIntent } from "@/lib/forms/generate-form";

export const runtime = "nodejs";

type Payload = {
  transactionId: string; // Stripe PI id (pi_...)
};

/**
 * Manual trigger for form generation. Useful for dev/test and retries.
 * In production this is called automatically by the Stripe webhook.
 */
export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { transactionId } = body;
  if (!transactionId) {
    return NextResponse.json(
      { error: "transactionId is required" },
      { status: 400 },
    );
  }

  try {
    await generateFormForPaymentIntent(transactionId);
    return NextResponse.json({ ok: true, transactionId });
  } catch (err) {
    console.error("[forms/generate] error:", err);
    return NextResponse.json(
      {
        error: "Form generation failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
