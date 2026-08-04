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
