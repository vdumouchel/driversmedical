import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, intakes, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateReceiptNumber } from "@/lib/receipt-number";

export const runtime = "nodejs";

type Payload = {
  amount: number; // cents, total incl. taxes
  subtotal: number; // cents, pre-tax
  taxes: number; // cents
  province: string;
  formCode?: string;
  licenseClass?: string;
  answers: Record<string, unknown>;
};

// Pick user-identifying fields out of the intake answers. Keys match the
// field `id`s in src/schemas/*. Some schemas use camelCase variants, so we
// try several.
function pickUserFields(a: Record<string, unknown>) {
  const s = (k: string) => (typeof a[k] === "string" ? (a[k] as string) : undefined);
  return {
    firstName: s("first_name") ?? s("firstName") ?? "",
    lastName: s("last_name") ?? s("lastName") ?? "",
    dateOfBirth: s("date_of_birth") ?? s("dob") ?? null,
    city: s("city") ?? null,
    phoneNumber: s("phone") ?? s("phone_number") ?? null,
    postalCode: s("postal_code") ?? s("postalCode") ?? null,
    address: s("address") ?? s("street_address") ?? null,
    // Schemas use British spelling (`licence_*`); accept both.
    licenseNumber:
      s("licence_number") ?? s("license_number") ?? s("licenseNumber") ?? null,
    email: s("email") ?? null,
  };
}

// Province slug → ISO 3166-2 subdivision code (used on Stripe Customer.address.state).
const PROVINCE_STATE: Record<string, string> = {
  quebec: "QC",
  "new-brunswick": "NB",
  ontario: "ON",
  alberta: "AB",
  "british-columbia": "BC",
  manitoba: "MB",
  "nova-scotia": "NS",
  "prince-edward-island": "PE",
  saskatchewan: "SK",
  "newfoundland-and-labrador": "NL",
  "northwest-territories": "NT",
  nunavut: "NU",
  yukon: "YT",
};

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body = (await req.json()) as Payload;
    const { amount, subtotal, taxes, province, formCode, licenseClass, answers } = body;

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (!province || !answers) {
      return NextResponse.json({ error: "Missing province or answers" }, { status: 400 });
    }

    const userFields = pickUserFields(answers);
    if (!userFields.firstName || !userFields.lastName) {
      return NextResponse.json(
        { error: "Missing first/last name in answers" },
        { status: 400 }
      );
    }

    // 1. Upsert user. Dedupe on licenseNumber when present, otherwise phone.
    //    Name alone is too loose. We don't error if nothing matches — just insert.
    // `address` is captured from intake answers but isn't a column on users —
    // strip it before writing to the DB.
    const { address: _addressForStripe, ...userDbFields } = userFields;

    let userId: string | null = null;
    let stripeCustomerId: string | null = null;
    if (userFields.licenseNumber) {
      const [existing] = await db
        .select({ id: users.id, stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.licenseNumber, userFields.licenseNumber))
        .limit(1);
      if (existing) {
        userId = existing.id;
        stripeCustomerId = existing.stripeCustomerId;
      }
    }
    if (!userId && userFields.phoneNumber) {
      const [existing] = await db
        .select({ id: users.id, stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.phoneNumber, userFields.phoneNumber))
        .limit(1);
      if (existing) {
        userId = existing.id;
        stripeCustomerId = existing.stripeCustomerId;
      }
    }
    if (!userId && userFields.email) {
      const [existing] = await db
        .select({ id: users.id, stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.email, userFields.email))
        .limit(1);
      if (existing) {
        userId = existing.id;
        stripeCustomerId = existing.stripeCustomerId;
      }
    }

    if (userId) {
      await db
        .update(users)
        .set({ ...userDbFields, updatedAt: new Date() })
        .where(eq(users.id, userId));
    } else {
      const [inserted] = await db
        .insert(users)
        .values(userDbFields)
        .returning({ id: users.id });
      userId = inserted.id;
    }

    // Create or update a Stripe Customer so the hosted receipt shows the full
    // "Bill to" block (name, email, phone, address) like a normal business
    // receipt — instead of just the email line.
    const customerPayload: Stripe.CustomerCreateParams = {
      name: `${userFields.firstName} ${userFields.lastName}`.trim(),
      email: userFields.email ?? undefined,
      phone: userFields.phoneNumber ?? undefined,
      address: {
        line1: userFields.address ?? undefined,
        city: userFields.city ?? undefined,
        postal_code: userFields.postalCode ?? undefined,
        state: PROVINCE_STATE[province] ?? undefined,
        country: "CA",
      },
      metadata: { user_id: userId, province },
    };
    if (stripeCustomerId) {
      try {
        await stripe.customers.update(stripeCustomerId, customerPayload);
      } catch (err) {
        // Customer may have been deleted in the dashboard — recreate.
        console.warn("[create-pi] stripe customer update failed, recreating:", err);
        stripeCustomerId = null;
      }
    }
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create(customerPayload);
      stripeCustomerId = customer.id;
      await db
        .update(users)
        .set({ stripeCustomerId, updatedAt: new Date() })
        .where(eq(users.id, userId));
    }

    // 2. Create intake row (no transactionId yet — patched after PI creation).
    const [intake] = await db
      .insert(intakes)
      .values({
        userId,
        provinceRequired: province,
        formRequired: formCode ?? null,
        licenseClass: licenseClass ?? null,
        answers,
      })
      .returning({ id: intakes.id });

    // 3. Create the Stripe PaymentIntent and carry our IDs in metadata so the
    //    webhook can stitch everything back together.
    // Province display name + form code → human-readable line on the receipt
    // ("New Brunswick driver's medical form (Form 404)").
    const provinceLabel = province
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const description = `${provinceLabel} driver's medical form${
      formCode ? ` (${formCode})` : ""
    }${licenseClass ? ` — Class ${licenseClass}` : ""}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "cad",
      automatic_payment_methods: { enabled: true },
      // Attach the Customer so the hosted receipt renders name + address +
      // phone in the "Bill to" block.
      customer: stripeCustomerId,
      // Shows up as the line-item description on the hosted receipt.
      description,
      // Stripe auto-emails a hosted receipt to this address once the charge
      // succeeds, and exposes `charge.receipt_number` + `charge.receipt_url`
      // on the resulting Charge — both persisted by the webhook.
      ...(userFields.email ? { receipt_email: userFields.email } : {}),
      metadata: {
        province,
        intake_id: intake.id,
        user_id: userId,
      },
    });

    // 4. Persist the transaction in "pending". Fees + status get updated by
    //    the Stripe webhook once the charge settles.
    await db.insert(transactions).values({
      intakeId: intake.id,
      userId,
      provinceRequired: province,
      transactionId: paymentIntent.id,
      // Our customer-facing receipt number, stable from the moment payment
      // kicks off. Customer service references this when discussing a
      // transaction with the user.
      receiptNumber: generateReceiptNumber(),
      status: "pending",
      subtotalAmount: Math.round(subtotal ?? 0),
      taxesTotalAmount: Math.round(taxes ?? 0),
      totalAmount: Math.round(amount),
      currency: "cad",
      metadata: { formCode, licenseClass },
    });

    // 5. Backfill transactionId onto the intake row.
    await db
      .update(intakes)
      .set({ transactionId: paymentIntent.id, updatedAt: new Date() })
      .where(eq(intakes.id, intake.id));

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      intakeId: intake.id,
    });
  } catch (err) {
    console.error("create-payment-intent error:", err);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
