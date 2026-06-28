import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, adminConfigured, ADMIN_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin is not configured. Set FUNNEL_ADMIN_PASSWORD." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  const token =
    typeof body.password === "string" ? verifyPassword(body.password) : null;

  if (!token) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
