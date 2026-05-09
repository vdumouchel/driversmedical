import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Supabase connection string. Prefer the transaction pooler (port 6543) at
// runtime so serverless functions don't exhaust connections; fall back to
// DATABASE_URL (typically the session pooler) for local dev.
const connectionString =
  process.env.DATABASE_POOL_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  // Fail loud at import time so misconfiguration never silently corrupts state.
  throw new Error(
    "DATABASE_URL (or DATABASE_POOL_URL) is not set. Add it to .env (Supabase → Project Settings → Database → Connection string)."
  );
}

// In dev, Next HMR re-evaluates this module; cache the client on globalThis so
// we don't leak pools.
const globalForDb = globalThis as unknown as {
  _pg?: ReturnType<typeof postgres>;
};

const client =
  globalForDb._pg ??
  postgres(connectionString, {
    prepare: false, // required for Supabase transaction-pooled connections
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb._pg = client;

export const db = drizzle(client, { schema });
export { schema };
