import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user;
}

// GET /api/admin/venues?search=...&page=1
export async function GET(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = 20;
  const offset = (page - 1) * limit;

  const service = await createServiceClient();

  let query = service
    .from("venues")
    .select(`
      id, name, slug, location_full, location_city, location_state,
      venue_type, is_published, onboarding_completed,
      cover_image_url, created_at, updated_at,
      owner:profiles!venues_owner_id_fkey(id, full_name),
      owner_auth:owner_id
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,location_full.ilike.%${search}%,location_city.ilike.%${search}%,location_state.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach owner emails via a separate lookup if needed
  return NextResponse.json({ venues: data ?? [], total: count ?? 0, page, limit });
}

// POST /api/admin/venues — create a new venue
export async function POST(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const service = await createServiceClient();
  const { data, error } = await service
    .from("venues")
    .insert(body)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ venue: data });
}
