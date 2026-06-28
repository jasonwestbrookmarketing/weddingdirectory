import { NextRequest, NextResponse } from "next/server";
import { trackEvent, evaluateAutoPause } from "@/lib/experiments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Records a funnel A/B impression or click. Called via navigator.sendBeacon
 * from the landing page hero. Body: { event: "impression" | "click",
 * ids: string[], page?: string }.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { event, ids, page } = (body ?? {}) as {
    event?: string;
    ids?: unknown;
    page?: string;
  };

  if (event !== "impression" && event !== "click") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const cleanIds = ids.filter((x): x is string => typeof x === "string");
  await trackEvent(cleanIds, event);

  // Occasionally evaluate auto-pause after a click (the rarer, higher-signal
  // event) so winners can lock in hands-off without a cron job.
  if (event === "click" && page && Math.random() < 0.15) {
    try {
      await evaluateAutoPause(page);
    } catch {
      /* non-fatal */
    }
  }

  return NextResponse.json({ ok: true });
}
