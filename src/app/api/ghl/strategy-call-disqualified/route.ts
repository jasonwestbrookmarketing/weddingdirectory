import { NextRequest, NextResponse } from "next/server";
import { sendStrategyCallEvent } from "@/lib/meta-capi";

/**
 * Server-to-server webhook GHL calls the moment a lead is routed to the
 * "disqualified" branch of the Strategy Call survey (configured as a
 * "Webhook" action on the GHL survey Workflow, on the disqualified branch).
 *
 * This is a fallback for the client-side pixel fired by
 * `FireDisqualifiedEvent` on /strategy-call/start-free — it fires the same
 * Meta custom event straight from our server, so a disqualified lead still
 * counts as a conversion even if the visitor's browser pixel never fires
 * (in-app browser, ad blocker, Safari ITP, interrupted redirect, etc).
 *
 * Auth: shared secret in GHL_WEBHOOK_SECRET (header `x-webhook-secret` or
 * `?secret=`). Set GHL_WEBHOOK_SECRET to a long random string.
 *
 * Always responds 200 quickly so GHL's workflow log doesn't show errors or
 * retries — failures are logged server-side instead of surfaced to GHL.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_SOURCE_URL = "https://storyvenue.com/strategy-call/start-free";

interface StrategyCallDisqualifiedPayload {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  fbc?: string;
  fbp?: string;
  event_id?: string;
}

function authorized(req: NextRequest): boolean {
  const secret = process.env.GHL_WEBHOOK_SECRET;
  if (!secret) return false; // not configured → disabled
  const provided =
    req.headers.get("x-webhook-secret") ??
    new URL(req.url).searchParams.get("secret") ??
    "";
  return provided === secret;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: StrategyCallDisqualifiedPayload = {};
  try {
    body = (await req.json()) as StrategyCallDisqualifiedPayload;
  } catch {
    console.error("[ghl-strategy-call-disqualified] invalid JSON body");
    return NextResponse.json({ received: true, warning: "invalid JSON body" });
  }

  const email = body.email?.trim();
  const phone = body.phone?.trim();

  if (!email && !phone) {
    console.error(
      "[ghl-strategy-call-disqualified] no identifying contact info in payload:",
      JSON.stringify(body),
    );
    return NextResponse.json({ received: true, warning: "no identifying contact info" });
  }

  const clientIpAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;

  const result = await sendStrategyCallEvent({
    eventName: "DisqualifiedStrategyCall",
    email,
    phone,
    firstName: body.first_name?.trim(),
    lastName: body.last_name?.trim(),
    eventSourceUrl: EVENT_SOURCE_URL,
    eventId: body.event_id,
    clientIpAddress,
    clientUserAgent: req.headers.get("user-agent") ?? undefined,
    fbc: body.fbc,
    fbp: body.fbp,
  });

  if (!result.success) {
    console.error("[ghl-strategy-call-disqualified] Meta CAPI send failed:", result.error);
  }

  return NextResponse.json({ received: true });
}
