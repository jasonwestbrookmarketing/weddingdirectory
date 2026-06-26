import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR purge for the public directory.
 *
 * The directory (this app) renders the homepage "Featured Venues" and the
 * /search results from a shared Supabase project that is actually WRITTEN by the
 * separate StoryPay app (venue create / publish / unpublish / delete all happen
 * there). Those pages are ISR/statically cached here, so a venue deleted in
 * StoryPay can linger on the directory until the cache expires.
 *
 * StoryPay calls this endpoint after any change that affects directory presence
 * so the listing pages refresh within seconds instead of waiting out the cache.
 * It can also be hit manually to force a purge:
 *   GET /api/revalidate?secret=XXXX                → purge home + search
 *   GET /api/revalidate?secret=XXXX&slug=my-venue  → also purge that venue page
 *
 * Auth: a shared secret in REVALIDATE_SECRET (header `x-revalidate-secret` or
 * `?secret=`). If the secret env is unset the endpoint is disabled (401).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false; // not configured → disabled
  const provided =
    req.headers.get("x-revalidate-secret") ??
    new URL(req.url).searchParams.get("secret") ??
    "";
  return provided === secret;
}

function purge(slug: string | null, extraPaths: string[]): string[] {
  const revalidated: string[] = [];
  const paths = ["/", "/search", ...extraPaths];
  if (slug) paths.push(`/venue/${slug}`);
  for (const p of paths) {
    try {
      revalidatePath(p);
      revalidated.push(p);
    } catch {
      /* ignore individual path failures */
    }
  }
  return revalidated;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { slug?: string | null; paths?: string[] } = {};
  try {
    body = (await req.json()) as { slug?: string | null; paths?: string[] };
  } catch {
    /* empty/invalid body is fine — purge the defaults */
  }
  const revalidated = purge(
    body.slug ?? null,
    Array.isArray(body.paths) ? body.paths.filter((p) => typeof p === "string") : [],
  );
  return NextResponse.json({ revalidated, now: Date.now() });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const slug = new URL(req.url).searchParams.get("slug");
  const revalidated = purge(slug, []);
  return NextResponse.json({ revalidated, now: Date.now() });
}
