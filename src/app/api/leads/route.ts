import { NextRequest, NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validators";
import { createServiceClient } from "@/lib/supabase/server";
import { sendLeadNotification } from "@/lib/sendgrid";

const rateMap = new Map<string, { count: number; resetsAt: number }>();
const RATE_LIMIT = 5;
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

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const result = leadFormSchema.safeParse(body);

  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".");
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
    return NextResponse.json(
      { error: "Validation failed.", errors },
      { status: 400 }
    );
  }

  const data = result.data;
  const supabase = await createServiceClient();

  const { data: lead, error: insertError } = await supabase
    .from("leads")
    .insert({
      venue_id: data.venue_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      wedding_date: data.wedding_date ?? null,
      guest_count: data.guest_count ?? null,
      booking_timeline: data.booking_timeline ?? null,
      message: data.message ?? null,
      status: "new",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Failed to insert lead:", insertError);
    return NextResponse.json(
      { error: "Failed to save your inquiry. Please try again." },
      { status: 500 }
    );
  }

  const { data: venue } = await supabase
    .from("venues")
    .select("name, notification_email, owner_id")
    .eq("id", data.venue_id)
    .single();

  let recipientEmail = venue?.notification_email;

  if (!recipientEmail && venue?.owner_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", venue.owner_id)
      .single();

    if (profile?.email) {
      recipientEmail = profile.email;
    } else {
      const { data: authUser } = await supabase.auth.admin.getUserById(
        venue.owner_id
      );
      recipientEmail = authUser?.user?.email ?? null;
    }
  }

  if (recipientEmail) {
    sendLeadNotification({
      venueName: venue?.name ?? "Your Venue",
      recipientEmail,
      lead: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        wedding_date: data.wedding_date,
        guest_count: data.guest_count,
        booking_timeline: data.booking_timeline,
        message: data.message,
      },
    });
  }

  return NextResponse.json({ success: true, leadId: lead.id });
}
