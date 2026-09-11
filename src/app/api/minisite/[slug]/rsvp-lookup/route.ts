import { NextRequest, NextResponse } from "next/server";
import { STORYPAY_URL, MINISITE_SECRET, signMinisite } from "@/lib/minisite";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateMap = new Map<string, { count: number; resetsAt: number }>();
const RATE_LIMIT = 20;
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

/** POST — sign + forward a "find my invitation by name" lookup. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!STORYPAY_URL || !MINISITE_SECRET) {
    return NextResponse.json({ error: "RSVP is not configured." }, { status: 500 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  let body: { name?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawBody = JSON.stringify({ name: String(body.name ?? "").slice(0, 120) });

  try {
    const res = await fetch(`${STORYPAY_URL}/api/public/minisite/${encodeURIComponent(slug)}/rsvp-lookup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-storypay-signature": signMinisite(rawBody) },
      body: rawBody,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
}
