import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for Route Handlers / Server Components / Server
 * Actions. Uses the publishable key + cookie-bound auth.
 *
 * For privileged, service-role style writes (ignore RLS) use
 * `createAdminSupabase()` below — but prefer writing through Drizzle when you
 * can, since it's type-safe and bypasses the PostgREST layer.
 */
export async function createSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll from a Server Component — Next refuses; that's fine when
            // middleware also refreshes the session.
          }
        },
      },
    }
  );
}

import { createClient } from "@supabase/supabase-js";

/** Service-role client. Never import from client code. */
export function createAdminSupabase() {
  const key = process.env.SECRET_SUPABASE_API_KEY;
  if (!key) throw new Error("SECRET_SUPABASE_API_KEY is not set");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
