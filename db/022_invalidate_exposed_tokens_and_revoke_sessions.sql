-- ============================================================================
-- storyvenue.com / app.storyvenue.com — invalidate exposed login_token values
-- and force-logout all existing sessions, out of caution after tonight's
-- anon + authenticated column-exposure fixes (020, 021).
--
-- TARGET PROJECT: brnxhsaakmhgwcthcapd (same shared project as 020/021).
--
-- Migrations 020/021 closed the ability for anon and authenticated roles to
-- READ these columns going forward through PostgREST. This file addresses
-- the separate question: values that were ALREADY read before the fix, and
-- any session currently open, should be treated as potentially compromised.
-- Idempotent — safe to run multiple times (each run just re-stamps "now").
-- ============================================================================


-- ── 1. Invalidate every legacy (never-expiring) venue login_token ─────────
-- 78 of 82 venues currently have a login_token with no expiry (verified via
-- direct query tonight) — a permanent, non-rotating magic-link credential
-- that was readable via anon's old select("*") exposure. This regenerates
-- each one to a fresh unguessable value and marks it already-expired, so
-- any previously-leaked value is useless immediately. The app already
-- handles this gracefully: request-login (StoryPay's
-- src/app/api/auth/request-login/route.ts) always overwrites login_token
-- with a fresh value + new TTL on every login request, so venue owners are
-- unaffected other than needing to click "email me a login link" once if
-- they had an old bookmarked magic-link URL (which was the actual security
-- issue — those links never expired).
-- No extensions required (gen_random_uuid() is core Postgres 13+).

update public.venues
set
  login_token = replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  login_token_expires_at = now() - interval '1 day'
where login_token_expires_at is null
   or login_token_expires_at >= now();


-- ── 2. Force-logout every venue owner + team member session ───────────────
-- Uses the app's own existing revocation mechanism (see StoryPay's
-- src/lib/session-revoke.ts): the proxy middleware strips any signed session
-- cookie whose issue-time predates session_invalidated_before. Propagates
-- within ~60s (the middleware's cache window). Owners/members simply need to
-- log back in (via the magic-link flow above, or password if applicable) —
-- no data is affected, this only ends existing browser sessions.

update public.venues
set session_invalidated_before = now();

update public.venue_team_members
set session_invalidated_before = now();


-- ── 3. Force-logout every couple (bride) Supabase Auth session ────────────
-- Couples authenticate via real Supabase Auth (email/password), which is a
-- separate mechanism from the two above. Deleting refresh tokens + sessions
-- blocks every session from renewing — forces a fresh login next time each
-- user's current access token needs refreshing.
--
-- ⚠ CAVEAT: Supabase access tokens (JWTs) are self-contained and verified by
-- signature alone, not by a live DB lookup on every request. This blocks
-- future refreshes immediately, but anyone with an *already-issued, still
-- unexpired* access token (default lifetime: 1 hour) remains able to use it
-- until it naturally expires. That's inherent to how JWT auth works and is
-- not something SQL can change. If you want truly immediate invalidation of
-- every currently-active access token (not just future refreshes), the only
-- way is rotating the project's JWT signing secret in Supabase Dashboard →
-- Authentication → Settings → JWT Secret. That is a much bigger action (it
-- also invalidates every anon/service-role key derived from that secret
-- family in some configurations) and is NOT included here — flag it to me
-- explicitly if you want to go that far; for tonight's actual risk (the
-- authenticated-role column leak, now closed at the grant level regardless
-- of session state) this SQL is sufficient.

delete from auth.refresh_tokens;
delete from auth.sessions;


-- ============================================================================
-- WHY THIS IS SAFE TO RUN NOW (unlike 023, which requires a prior deploy):
-- None of the above depends on any pending code change. It only invalidates
-- credentials/sessions — every real login flow (magic link, team invite,
-- couple email/password) already knows how to issue a fresh one.
-- ============================================================================
