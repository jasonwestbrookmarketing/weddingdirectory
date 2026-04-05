import { NextResponse } from "next/server";
import { applyPublicReadBucketPolicy } from "@/lib/wasabi";

/**
 * One-shot route: applies a public-read bucket policy to Wasabi so all
 * existing and future venue images are publicly accessible.
 *
 * Protected by ADMIN_SECRET env var. Hit once, then it can be left in place
 * (re-applying the same policy is idempotent).
 *
 * Usage:
 *   curl -X POST https://your-domain.com/api/admin/fix-bucket-policy \
 *        -H "x-admin-secret: <ADMIN_SECRET>"
 */
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET env var not set" },
      { status: 500 }
    );
  }

  const provided = request.headers.get("x-admin-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await applyPublicReadBucketPolicy();
    return NextResponse.json({
      ok: true,
      message: "Public-read bucket policy applied. All objects are now publicly accessible.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("fix-bucket-policy error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
