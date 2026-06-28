import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "fa_admin";
const SALT = "storyvenue-funnel-admin-v1";

export function adminConfigured(): boolean {
  return Boolean(process.env.FUNNEL_ADMIN_PASSWORD);
}

function expectedToken(): string | null {
  const pw = process.env.FUNNEL_ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHmac("sha256", pw).update(SALT).digest("hex");
}

/** Returns the cookie token to set if the password matches, else null. */
export function verifyPassword(input: string): string | null {
  const pw = process.env.FUNNEL_ADMIN_PASSWORD;
  if (!pw) return null;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  return expectedToken();
}

export async function isAdmin(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const store = await cookies();
  const val = store.get(ADMIN_COOKIE)?.value;
  if (!val) return false;
  const a = Buffer.from(val);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
