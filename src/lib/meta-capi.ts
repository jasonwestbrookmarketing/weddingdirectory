/**
 * Server-side Meta (Facebook) Conversions API integration for the OWNER's
 * own storyvenue.com "Strategy Call" ad funnel ONLY
 * (/strategy-call → /strategy-call/book → /strategy-call/confirmed).
 *
 * This is unrelated to any per-venue SaaS tracking — venues never see or
 * configure this. It is the SINGLE SOURCE OF TRUTH for the three funnel
 * conversions (Qualified, Disqualified, Booked): the client-side browser
 * pixel no longer fires these events, so there is nothing to dedupe against.
 * Firing server-to-server means a conversion still counts even when the
 * browser pixel is blocked or lost (Meta/Instagram in-app browser, ad
 * blockers, Safari ITP, interrupted redirects, etc).
 *
 * Never throws — a Meta API failure must never break the caller (the GHL
 * webhook route needs to always respond 200 quickly).
 */

import crypto from "crypto";

const META_API_VERSION = "v21.0";
// The StoryVenue Marketing Pixel id. NOTE: this is the PIXEL id, not the ad
// account id (1897382194014416 is the ad account and must never be used here).
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "573278748454943";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Lowercase + trim, per Meta's Advanced Matching normalization rules. */
function hashText(value: string): string {
  return sha256(value.trim().toLowerCase());
}

/** Digits only, no leading `+`, per Meta's phone normalization rules. */
function hashPhone(value: string): string {
  return sha256(value.replace(/\D/g, ""));
}

/**
 * Pull the Meta click identifiers out of a GHL webhook payload. GHL can deliver
 * mapped custom fields at the top level or nested under a `customData` /
 * `customFields` / `contact` container, and the exact key depends on how the
 * user maps the URL params — so we check a few likely paths and names. These
 * values are forwarded to Meta raw (never hashed), per the CAPI spec.
 */
export function extractMetaClickIds(payload: unknown): {
  fbc?: string;
  fbp?: string;
} {
  const containers: Record<string, unknown>[] = [];
  const add = (v: unknown) => {
    if (v && typeof v === "object") containers.push(v as Record<string, unknown>);
  };
  add(payload);
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    add(p.customData);
    add(p.custom_data);
    add(p.customFields);
    add(p.custom_fields);
    add(p.contact);
    add(p.data);
  }

  const pick = (keys: string[]): string | undefined => {
    for (const c of containers) {
      for (const k of keys) {
        const v = c[k];
        if (typeof v === "string" && v.trim()) return v.trim();
      }
    }
    return undefined;
  };

  return {
    fbc: pick(["fbc", "_fbc"]),
    fbp: pick(["fbp", "_fbp"]),
  };
}

export interface SendStrategyCallEventParams {
  eventName: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  eventSourceUrl: string;
  eventId?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
}

export interface SendStrategyCallEventResult {
  success: boolean;
  error?: string;
}

export async function sendStrategyCallEvent(
  params: SendStrategyCallEventParams,
): Promise<SendStrategyCallEventResult> {
  try {
    if (!ACCESS_TOKEN) {
      console.error("[meta-capi] META_CAPI_ACCESS_TOKEN is not set — skipping Meta CAPI send");
      return { success: false, error: "META_CAPI_ACCESS_TOKEN not configured" };
    }

    const userData: Record<string, string | string[]> = {};
    if (params.email && params.email.trim()) userData.em = [hashText(params.email)];
    if (params.phone && params.phone.trim()) userData.ph = [hashPhone(params.phone)];
    if (params.firstName && params.firstName.trim()) userData.fn = [hashText(params.firstName)];
    if (params.lastName && params.lastName.trim()) userData.ln = [hashText(params.lastName)];
    if (params.clientIpAddress) userData.client_ip_address = params.clientIpAddress;
    if (params.clientUserAgent) userData.client_user_agent = params.clientUserAgent;
    if (params.fbc) userData.fbc = params.fbc;
    if (params.fbp) userData.fbp = params.fbp;

    const event: Record<string, unknown> = {
      event_name: params.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: params.eventSourceUrl,
      action_source: "website",
      user_data: userData,
    };
    if (params.eventId) event.event_id = params.eventId;

    const res = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [event] }),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[meta-capi] non-OK response from Meta:", res.status, body);
      return { success: false, error: `Meta API responded ${res.status}: ${body}` };
    }

    return { success: true };
  } catch (err) {
    console.error("[meta-capi] failed to send event:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
