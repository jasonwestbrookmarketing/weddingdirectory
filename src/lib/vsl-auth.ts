import "server-only";
import crypto from "crypto";

/**
 * Self-contained password gate for the /vsl slide deck.
 *
 * A single shared password (VSL_DECK_PASSWORD) unlocks the deck. On success we
 * set an httpOnly cookie holding an HMAC token; the server page recomputes the
 * expected token and only renders the slides when it matches — so the deck is
 * never sent to the browser until the correct password is entered.
 *
 * Set VSL_DECK_PASSWORD and VSL_DECK_SECRET in the environment (e.g. Railway).
 * The dev fallbacks below only exist so the route works before configuration.
 */
export const VSL_COOKIE = "sv_vsl";

const VSL_PASSWORD = process.env.VSL_DECK_PASSWORD || "storyvenue";
const VSL_SECRET =
  process.env.VSL_DECK_SECRET ||
  process.env.STORYPAY_LEAD_WEBHOOK_SECRET ||
  "vsl-dev-secret-change-me";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** The token stored in the unlock cookie. Bump the suffix to invalidate all. */
export function expectedToken(): string {
  return crypto.createHmac("sha256", VSL_SECRET).update("vsl:v1").digest("hex");
}

export function checkPassword(input: unknown): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  return safeEqual(input, VSL_PASSWORD);
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  return safeEqual(token, expectedToken());
}
