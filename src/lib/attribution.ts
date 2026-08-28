/**
 * First-touch attribution capture for the public listing lead form.
 *
 * Meta auto-appends `fbclid` to every paid-ad click URL; UTM tags and the
 * browser referrer cover the rest. We stash `fbclid` in sessionStorage on the
 * first page load (see ListingTracker) so the lead form can still attach it
 * even after client-side navigation drops the query string. Everything here is
 * forwarded to StoryPay's /api/public/leads, which stores it on the lead's
 * `first_touch_utm` and uses it to bucket the lead as Meta / Google / Direct.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

function fbclidKey(venueId: string): string {
  return `fbclid_${venueId}`;
}

function safeGetSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Persist the fbclid from the current URL so it survives client-side
 * navigation and is still available when the visitor later opens the form.
 * Meta appends fbclid on every paid-ad click; organic posts do not carry it.
 */
export function captureFbclid(venueId: string): void {
  if (typeof window === "undefined") return;
  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) sessionStorage.setItem(fbclidKey(venueId), fbclid);
  } catch {
    /* sessionStorage unavailable (private mode) — non-fatal */
  }
}

/**
 * Collect first-touch attribution to attach to a lead submission: any UTM tags
 * on the URL, the Meta fbclid (live URL first, sessionStorage fallback), and
 * the browser referrer as a zero-setup fallback for untagged traffic.
 */
export function getAttribution(venueId: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  try {
    const p = new URLSearchParams(window.location.search);
    for (const k of UTM_KEYS) {
      const v = p.get(k);
      if (v) out[k] = v;
    }
    const fbclid = p.get("fbclid") || safeGetSession(fbclidKey(venueId));
    if (fbclid) out.fbclid = fbclid;
    if (document.referrer) out.referrer = document.referrer;
  } catch {
    /* noop */
  }
  return out;
}

/* ── Meta click-id pass-through for the Strategy Call ad funnel ─────────────
 * Separate from the per-venue lead attribution above. The base Meta Pixel
 * (see layout.tsx) sets first-party `_fbc`/`_fbp` cookies on arrival. We
 * snapshot them on the /strategy-call landing page and forward them as query
 * params into the GHL survey/booking iframes, so GHL can store them on the
 * contact and echo them back to our server-side CAPI webhooks for match
 * quality. `_fbc`/`_fbp` are Meta's own cookie names; `sv_*` are our snapshot
 * keys so we never collide with the pixel's cookies.
 */
const FBC_SESSION_KEY = "sv_fbc";
const FBP_SESSION_KEY = "sv_fbp";

// A synthesized `_fbc` is memoized so repeated reads return the same timestamp:
// a fresh Date.now() per call would break referential stability for callers
// (e.g. useSyncExternalStore) that compare successive snapshots.
let synthesizedFbc: string | null = null;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
    );
    if (!match) return null;
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  } catch {
    return null;
  }
}

// Meta's canonical `_fbc` format is `fb.1.<unixTimeMs>.<fbclid>`. Built from the
// URL's fbclid only as a fallback when the pixel hasn't dropped an `_fbc` cookie
// (blocked/slow pixel, in-app browser, etc).
function synthesizeFbc(): string | null {
  if (synthesizedFbc || typeof window === "undefined") return synthesizedFbc;
  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) synthesizedFbc = `fb.1.${Date.now()}.${fbclid}`;
  } catch {
    /* noop */
  }
  return synthesizedFbc;
}

/**
 * Read the Meta click identifiers, preferring the live pixel cookie (freshest),
 * then the landing-page sessionStorage snapshot, then an `_fbc` synthesized from
 * the URL's fbclid.
 */
export function getMetaClickIds(): { fbc?: string; fbp?: string } {
  if (typeof window === "undefined") return {};
  const out: { fbc?: string; fbp?: string } = {};
  const fbc =
    readCookie("_fbc") || safeGetSession(FBC_SESSION_KEY) || synthesizeFbc();
  const fbp = readCookie("_fbp") || safeGetSession(FBP_SESSION_KEY);
  if (fbc) out.fbc = fbc;
  if (fbp) out.fbp = fbp;
  return out;
}

/**
 * Snapshot the Meta click identifiers into sessionStorage on the VSL landing
 * page so they survive the navigation into the GHL booking iframe even when the
 * pixel cookie is unavailable there (e.g. the pixel was blocked and only the
 * fbclid-synthesized `_fbc` exists).
 */
export function captureMetaClickIds(): void {
  if (typeof window === "undefined") return;
  try {
    const { fbc, fbp } = getMetaClickIds();
    if (fbc) sessionStorage.setItem(FBC_SESSION_KEY, fbc);
    if (fbp) sessionStorage.setItem(FBP_SESSION_KEY, fbp);
  } catch {
    /* sessionStorage/cookies unavailable (private mode) — non-fatal */
  }
}

/**
 * Append the Meta click identifiers as `fbc`/`fbp` query params to a GHL iframe
 * URL, preserving any existing params. Returns the URL unchanged when no
 * identifiers are available (so the iframe still loads normally).
 */
export function appendMetaClickIds(url: string): string {
  const { fbc, fbp } = getMetaClickIds();
  if (!fbc && !fbp) return url;
  try {
    const u = new URL(url);
    if (fbc) u.searchParams.set("fbc", fbc);
    if (fbp) u.searchParams.set("fbp", fbp);
    return u.toString();
  } catch {
    return url;
  }
}
