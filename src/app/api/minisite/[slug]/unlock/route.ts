import { NextRequest, NextResponse } from "next/server";
import { STORYPAY_URL, MINISITE_SECRET, signMinisite } from "@/lib/minisite";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateMap = new Map<string, { count: number; resetsAt: number }>();
const RATE_LIMIT = 15;
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
 * POST — verify a private-site password. Signs + forwards to StoryPay; on a
 * correct password, stores the returned unlock token as an httpOnly cookie so
 * the server page can render the real content on reload.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!STORYPAY_URL || !MINISITE_SECRET) {
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawBody = JSON.stringify({ password: String(body.password ?? "").slice(0, 128) });

  try {
    const res = await fetch(`${STORYPAY_URL}/api/public/minisite/${encodeURIComponent(slug)}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-storypay-signature": signMinisite(rawBody) },
      body: rawBody,
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; token?: string };

    if (res.ok && data.ok && typeof data.token === "string") {
      const response = NextResponse.json({ ok: true });
      response.cookies.set(`sv_ms_${slug}`, data.token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 60, // 60 days
      });
      return response;
    }
    return NextResponse.json({ ok: false }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
}
