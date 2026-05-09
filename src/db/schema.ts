import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  pgEnum,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "processing",
  "succeeded",
  "failed",
  "canceled",
  "refunded",
]);

// ─── Users ────────────────────────────────────────────────────────────────────
// A minimal "patient" record. Same person can create multiple intakes.

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email"),
    dateOfBirth: date("date_of_birth"),
    city: text("city"),
    phoneNumber: text("phone_number"),
    postalCode: text("postal_code"),
    licenseNumber: text("license_number"),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("users_license_number_idx").on(t.licenseNumber),
    index("users_phone_idx").on(t.phoneNumber),
    index("users_email_idx").on(t.email),
  ]
);

// ─── Intakes ──────────────────────────────────────────────────────────────────
// Full form submission, tied to a user. The whole province-specific answer set
// lives in `answers` as JSON so we don't have to model each field column-wise.

export const intakes = pgTable(
  "intakes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    provinceRequired: text("province_required").notNull(),
    formRequired: text("form_required"),
    licenseClass: text("license_class"),
    answers: jsonb("answers").$type<Record<string, unknown>>().notNull(),
    transactionId: text("transaction_id"), // Stripe PaymentIntent id (pi_...)
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("intakes_user_idx").on(t.userId),
    index("intakes_transaction_idx").on(t.transactionId),
  ]
);

// ─── Transactions ─────────────────────────────────────────────────────────────
// One row per Stripe PaymentIntent. Linked to an intake + user.
// Amounts stored in cents (integer) to avoid float errors.

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    intakeId: uuid("intake_id")
      .notNull()
      .references(() => intakes.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    provinceRequired: text("province_required").notNull(),
    transactionId: text("transaction_id").notNull().unique(), // Stripe pi_...
    status: transactionStatusEnum("status").notNull().default("pending"),
    subtotalAmount: integer("subtotal_amount").notNull(), // cents
    taxesTotalAmount: integer("taxes_total_amount").notNull().default(0),
    totalAmount: integer("total_amount").notNull(),
    stripeFeesAmount: integer("stripe_fees_amount"),
    availableAmountAfterStripeFees: integer("available_amount_after_stripe_fees"),
    stripeChargeId: text("stripe_charge_id"),
    stripeBalanceTransactionId: text("stripe_balance_transaction_id"),
    // Stripe-generated receipt (populated when receipt_email is set on PI).
    // receipt_id is the human-friendly confirmation number (e.g. "1234-5678");
    // receipt_url is the hosted printable receipt page.
    receiptId: text("receipt_id"),
    receiptUrl: text("receipt_url"),
    // Our own human-friendly receipt number (e.g. "DM-20260425-A4B2C3"),
    // generated at transaction-creation time. This is the ID we print on the
    // self-rendered HTML receipt page and that customer service references.
    receiptNumber: text("receipt_number").unique(),
    // Captured from the Stripe Charge so the receipt can render
    // "Paid via Visa •••• 4242 on Apr 25, 2026".
    paymentMethodBrand: text("payment_method_brand"),
    paymentMethodLast4: text("payment_method_last4"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    // Legacy Stripe Invoice columns — no longer written to. Kept so existing
    // rows don't break; new flow renders our own HTML receipt instead.
    stripeInvoiceId: text("stripe_invoice_id"),
    invoiceUrl: text("invoice_url"),
    invoicePdfUrl: text("invoice_pdf_url"),
    currency: text("currency").notNull().default("cad"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("transactions_intake_idx").on(t.intakeId),
    index("transactions_user_idx").on(t.userId),
    index("transactions_status_idx").on(t.status),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  intakes: many(intakes),
  transactions: many(transactions),
}));

export const intakesRelations = relations(intakes, ({ one, many }) => ({
  user: one(users, { fields: [intakes.userId], references: [users.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  intake: one(intakes, {
    fields: [transactions.intakeId],
    references: [intakes.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

// Touch-updatedAt helper used by callers; defined as SQL expression for convenience.
export const updatedAtNow = sql`now()`;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Intake = typeof intakes.$inferSelect;
export type NewIntake = typeof intakes.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
