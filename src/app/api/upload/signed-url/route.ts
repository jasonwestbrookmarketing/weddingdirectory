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

  const missingVars = [
    !process.env.WASABI_ACCESS_KEY_ID && "WASABI_ACCESS_KEY_ID",
    !process.env.WASABI_SECRET_ACCESS_KEY && "WASABI_SECRET_ACCESS_KEY",
    !process.env.WASABI_BUCKET && "WASABI_BUCKET",
  ].filter(Boolean);

  if (missingVars.length > 0) {
    return NextResponse.json(
      { error: `Image storage misconfigured. Missing: ${missingVars.join(", ")}` },
      { status: 503 }
    );
  }

  // Log config for debugging (no secrets)
  console.log("Wasabi config:", {
    region: process.env.WASABI_REGION,
    endpoint: process.env.WASABI_ENDPOINT,
    bucket: process.env.WASABI_BUCKET,
    hasKey: !!process.env.WASABI_ACCESS_KEY_ID,
    hasSecret: !!process.env.WASABI_SECRET_ACCESS_KEY,
  });

  try {
    const { signedUrl, publicUrl } = await createSignedUploadUrl(
      venueId,
      folder as "cover" | "gallery",
      filename,
      contentType
    );

    return NextResponse.json({ signedUrl, publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Wasabi signed URL error:", message);
    return NextResponse.json(
      { error: `Failed to create upload URL: ${message}` },
      { status: 500 }
    );
  }
}
