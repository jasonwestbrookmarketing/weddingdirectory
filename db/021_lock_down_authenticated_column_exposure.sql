-- ============================================================================
-- storyvenue.com / app.storyvenue.com — authenticated-role column-exposure fix
--
-- TARGET PROJECT: brnxhsaakmhgwcthcapd (same shared project as 020).
--
-- WHY THIS FILE EXISTS
-- Migration 020 closed the anon-key column leak on public.venues,
-- public.directory_plans, and public.venue_pricing_guides. While reviewing
-- pg_policies output together on 2026-08-04, we found that all three tables
-- also grant row-level SELECT access to the `authenticated` role (or to
-- `public`, which includes `authenticated`) via policies such as:
--   - venues:               "Public can read published venues" (anon, authenticated)
--   - venues:                "Owners can read own venue" (authenticated, owner_id = auth.uid())
--   - directory_plans:      "Public read directory_plans" (anon, authenticated)
--   - venue_pricing_guides: "Public read enabled guides" (public)
--   - venue_pricing_guides: "Owners manage their guide" (public, ALL — INSERT/UPDATE/DELETE too)
--
-- Migration 020 only revoked/re-granted column-level SELECT for `anon`. The
-- `authenticated` role's column grants were never touched, so any user who
-- signs up for a real Supabase Auth account (e.g. via StoryPay's public
-- /signup flow for the couple/bride portal — this is genuinely self-serve,
-- no approval required) gets a legitimate `authenticated`-role JWT and can
-- call the REST API directly (bypassing the app's UI entirely) to read every
-- column on every published venue, every directory_plans row, and every
-- venue_pricing_guides row — including lunarpay_secret_key, lunarpay_org_token,
-- ghl_access_token/ghl_refresh_token/ghl_location_token, login_token, and all
-- internal fields. This is arguably a WORSE hole than the anon one it was
-- built to fix, since signup is trivial and unauthenticated (no manual review).
--
-- VERIFIED SAFE TO APPLY — before writing this file we grepped the entire
-- StoryPay repo for every consumer of these three tables:
--   - The couple-facing browser Supabase client (src/lib/couple-browser.ts)
--     only ever extracts the session's access_token to forward as a Bearer
--     header to StoryPay's own first-party API routes — it never calls
--     `.from()` directly on any table from the browser.
--   - Every .tsx page component that touches venues/directory_plans/
--     venue_pricing_guides (dashboard/layout.tsx, guide/[venueId]/page.tsx,
--     dashboard/marketing/email/campaigns/[id]/design/page.tsx,
--     u/[token]/manage/page.tsx) reads via `supabaseAdmin` (service-role),
--     which bypasses RLS/grants entirely and is unaffected by this change.
--   - No application code anywhere references `owner_id = auth.uid()` — the
--     "Owners can read own venue" policy appears to be a vestigial/defensive
--     policy with no live consumer, since venue owners authenticate via a
--     custom signed cookie (see src/app/api/auth/venue/[token]/route.ts in
--     StoryPay), not real Supabase Auth sessions.
-- Net result: no known legitimate code path depends on `authenticated` having
-- any column access beyond the same public-safe allowlist already granted to
-- `anon` in migration 020. This migration grants that identical allowlist to
-- `authenticated` too — nothing more, nothing less.
--
-- CAVEAT — read before applying, mirrors migration 020's own caveat:
-- public.venue_pricing_guides has an "Owners manage their guide" policy that
-- is `ALL` (not just SELECT) for `{public}`, meaning if any *authenticated*
-- write path exists that inserts/updates a guide row and immediately reads
-- back non-allowlisted columns (e.g. `.select()` after an `.update()` call),
-- restricting SELECT columns here could make that specific read-back fail
-- (the write itself is unaffected — INSERT/UPDATE/DELETE grants are separate
-- from SELECT grants and are not touched by this file). We did not find such
-- a code path in StoryPay, but we do not have visibility into every branch
-- of that repo's dashboard code. Smoke-test the pricing-guide editor in the
-- dashboard (as an authenticated/logged-in flow, not just the public guide
-- viewer) after applying this section.
--
-- Idempotent — safe to run multiple times.
-- ============================================================================


-- ── 1. public.venues ─────────────────────────────────────────────────────
-- Same allowlist as migration 020's anon grant.

revoke select on public.venues from authenticated;

grant select (
  id,
  slug,
  name,
  description,
  venue_type,
  location_full,
  location_city,
  location_state,
  lat,
  lng,
  capacity_min,
  capacity_max,
  price_min,
  price_max,
  indoor_outdoor,
  features,
  cover_image_url,
  gallery_images,
  availability_notes,
  is_published,
  is_demo,
  demo_preview_token,
  brand_website,
  phone,
  email,
  show_map,
  social_links,
  faq,
  google_place_id,
  google_reviews_cache,
  google_reviews_fetched_at,
  directory_verified_status,
  directory_sponsored_status,
  directory_plan_id,
  meta_pixel_id,
  seo_title,
  seo_description,
  seo_keywords,
  created_at,
  updated_at
) on public.venues to authenticated;


-- ── 2. public.directory_plans ───────────────────────────────────────────

revoke select on public.directory_plans from authenticated;

grant select (
  id,
  nav_permissions,
  hide_header
) on public.directory_plans to authenticated;


-- ── 3. public.venue_pricing_guides ──────────────────────────────────────
-- ⚠ See caveat above re: the "Owners manage their guide" ALL policy before
-- applying — smoke-test the dashboard's pricing-guide editor afterward.

revoke select on public.venue_pricing_guides from authenticated;

grant select (
  id,
  venue_id,
  cover_image_url,
  enabled
) on public.venue_pricing_guides to authenticated;


-- ============================================================================
-- NOT INCLUDED IN THIS MIGRATION:
--
-- 1. Token rotation for lunarpay_secret_key / lunarpay_org_token / ghl_*_token /
--    login_token remains a separate, deferred action (see migration 020's
--    notes and the audit report). Every value was already exposed to BOTH
--    anon and authenticated roles before 020 + this file run, so closing the
--    column leak here does not un-expose values already retrieved historically.
--
-- 2. The vestigial "Owners can read own venue" (authenticated, owner_id =
--    auth.uid()) RLS policy on public.venues was left in place rather than
--    dropped, since removing a row policy is a larger behavioral change than
--    this audit's scope (column-level exposure) and it is harmless as-is —
--    it only grants ROW visibility into a venue's already-column-restricted
--    public fields, same as everyone else gets.
-- ============================================================================
