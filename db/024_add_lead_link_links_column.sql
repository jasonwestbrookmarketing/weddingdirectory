-- ============================================================================
-- Lead Link (link-in-bio) — custom buttons column
--
-- TARGET PROJECT: brnxhsaakmhgwcthcapd (the shared StoryPay backend project),
-- same project as migrations 020–023.
--
-- Adds venues.lead_link_links: up to 3 owner-defined buttons rendered on the
-- public Lead Link page (storyvenue.com/venue/{slug}/links). Shape:
--   [{ "label": "Book a Tour", "url": "https://…", "icon": "calendar" }, …]
--
-- The StoryPay dashboard writes this column via the service-role client (which
-- bypasses column grants). The public directory site reads it with the anon
-- key, so anon needs a column-level SELECT grant added to the allowlist from
-- migration 020.
--
-- Idempotent — safe to run multiple times.
-- ============================================================================

alter table public.venues
  add column if not exists lead_link_links jsonb not null default '[]'::jsonb;

grant select (lead_link_links) on public.venues to anon;
