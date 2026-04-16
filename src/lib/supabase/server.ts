import { createServerClient } from "@supabase/ssr";

/**
 * Public anon Supabase client for server components.
 *
 * This site is read-only (public directory) — no user sessions live here
 * anymore. Cookie handling is intentionally a no-op, so listings render the
 * same for every visitor and public RLS policies apply.
 */
export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() { /* no-op: no sessions on this site */ },
      },
    }
  );
}
