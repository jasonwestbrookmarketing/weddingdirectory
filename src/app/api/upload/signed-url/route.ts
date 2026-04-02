import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSignedUploadUrl, ALLOWED_IMAGE_TYPES } from "@/lib/wasabi";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { venueId, folder, filename, contentType } = body as {
    venueId: string;
    folder: "cover" | "gallery";
    filename: string;
    contentType: string;
  };

  if (!venueId || !folder || !filename || !contentType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Invalid content type. Allowed: JPEG, PNG, WebP" },
      { status: 400 }
    );
  }

  if (!["cover", "gallery"].includes(folder)) {
    return NextResponse.json(
      { error: "Invalid folder. Must be 'cover' or 'gallery'" },
      { status: 400 }
    );
  }

  try {
    const { signedUrl, publicUrl } = await createSignedUploadUrl(
      venueId,
      folder,
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
