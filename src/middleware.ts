import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Public-only middleware. The directory site has no logged-in users — all
 * venue management now lives at app.storyvenue.com. Everything this runs is
 * the lightweight maintenance-mode check so we can take the site down cleanly.
 */

const MAINTENANCE_EXEMPT = [
  "/maintenance",
  "/_next",
  "/favicon.ico",
  "/api",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isExempt = MAINTENANCE_EXEMPT.some((r) => path.startsWith(r));
  if (isExempt) return NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return []; }, setAll() {} },
    }
  );

  const { data: setting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "maintenance_mode")
    .single();

  if (setting?.value === "true") {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
