import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["new", "contacted", "call_booked", "tour_booked", "booked"] as const;

const updateLeadSchema = z.object({
  status: z.enum(VALID_STATUSES),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: venue } = await supabase
    .from("venues")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!venue) {
    return NextResponse.json({ error: "No venue found" }, { status: 404 });
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("venue_id")
    .eq("id", id)
    .single();

  if (!lead || lead.venue_id !== venue.id) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = updateLeadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid status. Must be one of: " + VALID_STATUSES.join(", ") },
      { status: 400 }
    );
  }

  const { data: updated, error } = await supabase
    .from("leads")
    .update({ status: result.data.status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
