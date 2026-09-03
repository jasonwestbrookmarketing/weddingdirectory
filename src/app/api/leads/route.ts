import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { leadFormSchema } from "@/lib/validators";

const STORYPAY_LEAD_WEBHOOK_URL =
  process.env.STORYPAY_LEAD_WEBHOOK_URL ||
  (process.env.NEXT_PUBLIC_STORYPAY_URL
    ? `${process.env.NEXT_PUBLIC_STORYPAY_URL}/api/public/leads`
    : "");

const STORYPAY_LEAD_WEBHOOK_SECRET = process.env.STORYPAY_LEAD_WEBHOOK_SECRET || "";

const rateMap = new Map<string, { count: number; resetsAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetsAt) {
    rateMap.set(ip, { count: 1, resetsAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

/**
 * Thin proxy to StoryPay's lead webhook.
 *
 * This route no longer writes to the database. Instead it validates the form,
 * signs the raw JSON body with HMAC-SHA256 using `STORYPAY_LEAD_WEBHOOK_SECRET`,
 * and forwards it to `${NEXT_PUBLIC_STORYPAY_URL}/api/public/leads`. StoryPay
 * persists the lead and emails the venue owner.
 */
export async function POST(request: NextRequest) {
  if (!STORYPAY_LEAD_WEBHOOK_URL || !STORYPAY_LEAD_WEBHOOK_SECRET) {
    console.error("[leads-proxy] Missing STORYPAY_LEAD_WEBHOOK_URL or STORYPAY_LEAD_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Lead forwarding is not configured." }, { status: 500 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = leadFormSchema.safeParse(body);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".");
      if (!errors[field]) errors[field] = issue.message;
    }
    return NextResponse.json({ error: "Validation failed.", errors }, { status: 400 });
  }

  const d = result.data;
  const forwarded = {
    venue_id: d.venue_id,
    listing_slug: d.listing_slug,
    name: d.name,
    first_name: d.first_name,
    last_name: d.last_name,
    email: d.email,
    phone: d.phone,
    guest_count: d.guest_count ?? null,
    booking_timeline: d.booking_timeline ?? null,
    venue_matters: d.venue_matters ?? null,
    message: d.message ?? null,
    source: "directory",
    // First-touch attribution — StoryPay persists these into the lead's
    // first_touch_utm and buckets the lead as Meta / Google / Direct.
    // Undefined keys are dropped by JSON.stringify, so untagged traffic is
    // forwarded exactly as before.
    utm_source: d.utm_source,
    utm_medium: d.utm_medium,
    utm_campaign: d.utm_campaign,
    utm_term: d.utm_term,
    utm_content: d.utm_content,
    fbclid: d.fbclid,
    referrer: d.referrer,
  };

  const rawBody = JSON.stringify(forwarded);
  const signature = crypto
    .createHmac("sha256", STORYPAY_LEAD_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  try {
    const res = await fetch(STORYPAY_LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-storypay-signature": signature,
      },
      body: rawBody,
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[leads-proxy] StoryPay rejected lead:", res.status, data);
      return NextResponse.json(
        { error: data?.error ?? "Failed to save your inquiry. Please try again." },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true, leadId: data.lead_id ?? null });
  } catch (err) {
    console.error("[leads-proxy] fetch error:", err);
    return NextResponse.json(
      { error: "Could not reach our lead system. Please try again in a moment." },
      { status: 502 },
    );
  }
}
