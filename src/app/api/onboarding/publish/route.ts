import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: venue, error: fetchError } = await supabase
    .from("venues")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (fetchError || !venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  const errors: string[] = [];

  if (!venue.name) errors.push("Venue name is required");
  if (!venue.location_full) errors.push("Location is required");
  if (!venue.venue_type) errors.push("Venue type is required");
  if (!venue.notification_email) errors.push("Notification email is required");

  const galleryImages = venue.gallery_images as string[] | null;
  if (!venue.cover_image_url && (!galleryImages || galleryImages.length === 0)) {
    errors.push("At least one image (cover or gallery) is required");
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const { error: updateError } = await supabase
    .from("venues")
    .update({
      is_published: true,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", venue.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to publish venue" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, slug: venue.slug });
}
