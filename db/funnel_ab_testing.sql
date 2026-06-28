-- ─────────────────────────────────────────────────────────────────────────────
-- Funnel A/B testing (hero headline / subheadline / CTA) for storyvenue.com
-- landing pages. Runs against StoryPay's shared Supabase project.
--
-- Apply this in the Supabase SQL editor (the directory app only has the anon
-- key; all writes happen server-side via the service-role key).
--
-- Safe to run multiple times (idempotent).
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.funnel_pages (
  page_key        text primary key,
  auto_pause      boolean not null default false,
  min_impressions integer not null default 200,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Backfill for projects created before created_at existed.
alter table public.funnel_pages
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.funnel_variants (
  id          uuid primary key default gen_random_uuid(),
  page_key    text not null,
  element     text not null check (element in ('headline','subheadline','cta')),
  content     text not null,
  enabled     boolean not null default true,
  pinned      boolean not null default false,
  impressions bigint  not null default 0,
  clicks      bigint  not null default 0,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists funnel_variants_page_element_idx
  on public.funnel_variants(page_key, element);

-- RLS on, no policies: the anon role is denied entirely. Only the service-role
-- key (used server-side) can read/write, plus the SECURITY DEFINER function below.
alter table public.funnel_variants enable row level security;
alter table public.funnel_pages    enable row level security;

-- Atomic counter increments for impressions / clicks. SECURITY DEFINER so the
-- server's anon-less calls (via service role) increment safely in one statement.
create or replace function public.funnel_track(p_ids uuid[], p_event text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event = 'impression' then
    update public.funnel_variants
       set impressions = impressions + 1, updated_at = now()
     where id = any(p_ids);
  elsif p_event = 'click' then
    update public.funnel_variants
       set clicks = clicks + 1, updated_at = now()
     where id = any(p_ids);
  end if;
end;
$$;

-- ── Seed the bride-booking-system hero with its current copy as the control ──
insert into public.funnel_pages (page_key) values ('bride-booking-system')
  on conflict (page_key) do nothing;

-- Headline: text after "|" renders in gold (matches the live two-tone hero).
insert into public.funnel_variants (page_key, element, content, position)
select 'bride-booking-system', 'headline', 'Start Booking More Brides|in 5 Minutes.', 0
where not exists (
  select 1 from public.funnel_variants
   where page_key = 'bride-booking-system' and element = 'headline'
);

insert into public.funnel_variants (page_key, element, content, position)
select 'bride-booking-system', 'subheadline', 'Stop losing brides to the venue that replied first.', 0
where not exists (
  select 1 from public.funnel_variants
   where page_key = 'bride-booking-system' and element = 'subheadline'
);

insert into public.funnel_variants (page_key, element, content, position)
select 'bride-booking-system', 'cta', 'Start Your 14-Day Free Trial', 0
where not exists (
  select 1 from public.funnel_variants
   where page_key = 'bride-booking-system' and element = 'cta'
);
