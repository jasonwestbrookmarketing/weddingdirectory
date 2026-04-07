import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function GET() {
  const service = await createServiceClient();
  const { data } = await service.from("site_settings").select("key, value");
  const settings: Record<string, string> = {};
  (data ?? []).forEach((row) => { settings[row.key] = row.value; });
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body: Record<string, string> = await request.json();
  const service = await createServiceClient();

  for (const [key, value] of Object.entries(body)) {
    await service.from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
  }
  return NextResponse.json({ ok: true });
}
