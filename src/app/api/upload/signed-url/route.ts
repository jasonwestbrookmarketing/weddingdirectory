import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";
import { createSignedUploadUrl, ALLOWED_IMAGE_TYPES } from "@/lib/wasabi";

const uploadSchema = z.object({
  venueId: z.string().uuid("Invalid venue ID"),
  folder: z.enum(["cover", "gallery"]),
  filename: z.string().min(1, "Filename required"),
  contentType: z.enum(ALLOWED_IMAGE_TYPES as unknown as [string, ...string[]]),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = uploadSchema.safeParse(body);
  if (!result.success) {
    const msg = result.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { venueId, folder, filename, contentType } = result.data;

  try {
    const { signedUrl, publicUrl } = await createSignedUploadUrl(
      venueId,
      folder as "cover" | "gallery",
      filename,
      contentType
    );

    return NextResponse.json({ signedUrl, publicUrl });
  } catch {
    return NextResponse.json(
      { error: "Failed to create signed URL" },
      { status: 500 }
    );
  }
}
