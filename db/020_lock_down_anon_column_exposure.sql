-- ============================================================================
-- storyvenue.com (public directory) — anon-key column-exposure lockdown
--
-- TARGET PROJECT: brnxhsaakmhgwcthcapd (the shared StoryPay backend project).
-- Confirmed via Railway's production env vars for the "StoryVenue Frontend"
-- service (NEXT_PUBLIC_SUPABASE_URL), decoded JWT `ref` claims on both the
-- anon and service-role keys, and live REST probes against real data (35
-- venues, populated directory_plans/venue_pricing_guides). Do NOT run this
-- against blclfnsztrxfhcfauzer — that ref is a separate, effectively-empty
-- legacy project (2 dummy venue rows, no directory_plans table at all) that
-- only this repo's local .env.local/.env.example still point at. See the
-- audit report for the full two-project topology writeup.
--
-- WHY THIS FILE EXISTS
-- Direct anon-key REST probes against production (`GET .../rest/v1/venues
-- ?select=*`, no auth beyond the public anon key) currently return, for
-- EVERY one of the 35 real venues:
--   - login_token             (looks like a passwordless/session-bypass token)
--   - lunarpay_secret_key     (live payment-processor SECRET key, non-null on
--                              ~25 of 35 venues)
--   - lunarpay_org_token
--   - ghl_access_token / ghl_refresh_token / ghl_location_token
--     (GoHighLevel CRM OAuth tokens, several venues, one JWT-format)
--   - owner_id, calendly_*, onboarding_*, service_fee_rate, notification_email,
--     address/city/state/zip, brand_* internal fields, etc.
-- None of these columns are read by any anon consumer anywhere in this repo
-- (verified by grepping every `.from("venues")` call). This is pure
-- incidental exposure from `select("*")` / `select("*", ...)` queries with no
-- column-level grant restricting what anon can actually see. Anyone with the
-- public anon key (which ships in this site's client bundle — it is not a
-- secret) can currently read every venue's payment and CRM credentials.
--
-- Similarly, `public.directory_plans` is fully anon-readable with no column
-- restriction, exposing `fortis_merchant_id`, `stripe_price_id`, and the
-- complete internal `nav_permissions`/`feature_flags` JSON for every plan —
-- this repo's code only ever reads `nav_permissions` and `hide_header`.
--
-- `public.venue_pricing_guides` is fully anon-readable with no column
-- restriction. This repo's code only ever reads `cover_image_url` and
-- `enabled`. CAVEAT: the other columns on this table (congratulatory_message,
-- gallery, about_venue, pricing_intro, reviews, cta_*, etc.) may be consumed
-- by a public guide-viewer page on app.storyvenue.com (the StoryPay backend
-- repo) using the SAME anon key — this repo has no visibility into that
-- codebase. Section 3 below is written but should be verified against the
-- backend repo (or smoke-tested on the live guide viewer) before applying.
--
-- THE LESSON FROM TONIGHT'S INCIDENT — READ BEFORE TOUCHING directory_plans
-- `directory_plans` has an `is_public` boolean column that looks purpose-
-- built for a `USING (is_public = true)` row policy. DO NOT gate the row
-- policy on it. This app's venue pages look up a plan strictly BY ID
-- (`.eq("id", venue.directory_plan_id)`), and real venues are attached to
-- plans where `is_public = false` (e.g. the "Legacy Plan" row seen in
-- production has `is_public: false`). A row policy filtering on `is_public`
-- would make those rows invisible to anon entirely, breaking the pricing-
-- guide CTA / hide_header gate on every venue attached to a non-public plan
-- — this is almost certainly what broke tonight. The fix below keeps the ROW
-- policy permissive (`using (true)` — this is a shared lookup-by-id table,
-- not user-owned data) and instead restricts which COLUMNS anon can read.
-- Row-level security and column-level GRANTs are independent mechanisms in
-- Postgres; `SELECT *` gracefully degrades to only the columns a role has
-- been granted (no error), so no application code changes are required.
--
-- Idempotent — safe to run multiple times. Does not touch RLS/grants on
-- funnel_variants, funnel_pages, or the funnel_track() RPC — those were
-- verified already correctly locked down (anon gets zero rows, RPC execute
-- is permission-denied to anon).
-- ============================================================================


-- ── 1. public.venues ─────────────────────────────────────────────────────
-- Column allowlist below is the union of every column actually referenced
-- across this repo's anon-key consumers: src/app/page.tsx, src/app/search/
-- page.tsx, src/app/venue/[slug]/page.tsx, src/app/venue/[slug]/thankyou/
-- page.tsx, src/lib/directory-venues.ts, plus every field declared in the
-- documented "directory-facing projection" in src/types/database.ts.

alter table public.venues enable row level security;

drop policy if exists "anon_select_venues" on public.venues;
create policy "anon_select_venues"
  on public.venues
  for select
  to anon
  using (true);

revoke select on public.venues from anon;

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
) on public.venues to anon;


-- ── 2. public.directory_plans ───────────────────────────────────────────
-- This app only ever reads (nav_permissions, hide_header) for a single plan
-- by id (src/app/venue/[slug]/page.tsx). Row policy stays USING (true) —
-- see "lesson from tonight's incident" above for why is_public must NOT be
-- used as a row filter here.

alter table public.directory_plans enable row level security;

drop policy if exists "anon_select_directory_plans" on public.directory_plans;
create policy "anon_select_directory_plans"
  on public.directory_plans
  for select
  to anon
  using (true);

revoke select on public.directory_plans from anon;

grant select (
  id,
  nav_permissions,
  hide_header
) on public.directory_plans to anon;


-- ── 3. public.venue_pricing_guides ──────────────────────────────────────
-- ⚠ VERIFY BEFORE APPLYING: this repo only reads (cover_image_url, enabled)
-- by venue_id. If app.storyvenue.com's public guide-viewer page reads other
-- columns (congratulatory_message, gallery, about_venue, pricing_intro,
-- reviews, cta_*, etc.) via the SAME anon key, applying this section as-is
-- will break that page. Grep the StoryPay repo for `.from("venue_pricing_
-- guides")` before running this section, or smoke-test the live guide
-- viewer immediately after.

alter table public.venue_pricing_guides enable row level security;

drop policy if exists "anon_select_venue_pricing_guides" on public.venue_pricing_guides;
create policy "anon_select_venue_pricing_guides"
  on public.venue_pricing_guides
  for select
  to anon
  using (true);

revoke select on public.venue_pricing_guides from anon;

grant select (
  id,
  venue_id,
  cover_image_url,
  enabled
) on public.venue_pricing_guides to anon;


-- ============================================================================
-- NOT INCLUDED IN THIS MIGRATION (see audit report for details):
--
-- 1. login_token / lunarpay_secret_key / lunarpay_org_token / ghl_*_token
--    ROTATION. Revoking anon's column-level SELECT above stops FUTURE reads
--    through PostgREST, but every token value listed in the audit report was
--    already publicly retrievable before this migration runs. Treat all of
--    them as compromised and rotate/reissue: login_token (regenerate per
--    venue), all non-null lunarpay_secret_key / lunarpay_org_token values
--    (rotate with LunarPay), and all non-null ghl_access_token /
--    ghl_refresh_token / ghl_location_token values (reconnect each venue's
--    GHL integration to force new tokens). This is an application/vendor-
--    side action, not SQL, and is not included here.
--
-- 2. public.site_settings does not exist at all on brnxhsaakmhgwcthcapd (only
--    on the legacy blclfnsztrxfhcfauzer project) — src/proxy.ts's maintenance
--    -mode check silently no-ops in production today (fails open, not a
--    security exposure, but maintenance mode cannot currently be turned on
--    via that mechanism). Optional follow-up, not included here since it's
--    a functional gap rather than a vulnerability:
--
--    create table if not exists public.site_settings (
--      key   text primary key,
--      value text
--    );
--    alter table public.site_settings enable row level security;
--    create policy "anon_select_site_settings" on public.site_settings
--      for select to anon using (true);
--    insert into public.site_settings (key, value)
--      values ('maintenance_mode', 'false')
--      on conflict (key) do nothing;
--
-- 3. Row-level tightening of public.venues (e.g. restricting SELECT to
--    is_published = true at the DB layer, not just in application code) was
--    deliberately left OUT of this migration. It would be more correct
--    defense-in-depth, but every current production venue row happens to
--    have is_published = true, so it could not be empirically verified
--    against this data, and campaigns like the free-listing ticker
--    (getTickerVenues) intentionally read unpublished signups via the
--    service-role client, bypassing RLS regardless. Recommend testing this
--    separately on a Supabase branch before applying to production.
-- ============================================================================
