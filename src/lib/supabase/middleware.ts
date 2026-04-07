import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes always accessible regardless of maintenance mode
const MAINTENANCE_EXEMPT = [
  "/maintenance",
  "/admin",           // all /admin/* routes (login, register, metrics, etc.)
  "/api/admin",       // admin API routes
  "/auth/confirm",    // password reset flow
  "/_next",
  "/favicon.ico",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ── Maintenance mode check ──────────────────────────────────────────────
  const isExempt = MAINTENANCE_EXEMPT.some((r) => path.startsWith(r));

  if (!isExempt) {
    // Check maintenance flag — use anon client since RLS allows public SELECT
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .single();

    if (setting?.value === "true") {
      // Admins bypass maintenance mode
      let isAdmin = false;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles").select("role").eq("id", user.id).single();
        isAdmin = profile?.role === "admin";
      }

      if (!isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/maintenance";
        return NextResponse.redirect(url);
      }
    }
  }

  // ── Normal auth routing ─────────────────────────────────────────────────
  const adminPublicRoutes = ["/admin/login", "/admin/forgot-password", "/admin/register"];
  const isAdminPublic = adminPublicRoutes.some((r) => path.startsWith(r));
  const protectedRoutes = ["/dashboard", "/onboarding"];
  const authRoutes = ["/login", "/signup"];

  if (!user) {
    if (protectedRoutes.some((r) => path.startsWith(r))) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/admin") && !isAdminPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  if (user && authRoutes.some((r) => path.startsWith(r))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
