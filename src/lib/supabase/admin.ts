import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for privileged, server-only writes/reads
 * (funnel A/B testing, etc.). NEVER import this into a Client Component.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY. Returns null if it's not configured so
 * callers can degrade gracefully (e.g. render default hero copy).
 */
let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (cached) return cached;
  cached = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
