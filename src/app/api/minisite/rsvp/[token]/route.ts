import { NextRequest, NextResponse } from "next/server";
import { STORYPAY_URL } from "@/lib/minisite";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Thin same-origin proxy to StoryPay's public per-guest RSVP endpoint. The
 * unguessable token is the credential (no HMAC needed) — this just avoids
 * cross-origin calls from the browser.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!UUID_RE.test(token) || !STORYPAY_URL) {
    return NextResponse.json({ error: "Invalid RSVP link." }, { status: 404 });
  }
  try {
    const res = await fetch(`${STORYPAY_URL}/api/rsvp/${token}`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!UUID_RE.test(token) || !STORYPAY_URL) {
    return NextResponse.json({ error: "Invalid RSVP link." }, { status: 404 });
  }
  const rawBody = await req.text();
  try {
    const res = await fetch(`${STORYPAY_URL}/api/rsvp/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawBody,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
}
