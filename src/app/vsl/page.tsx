import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyToken, VSL_COOKIE } from "@/lib/vsl-auth";
import VslLockGate from "@/components/vsl/VslLockGate";
import VslDeck from "@/components/vsl/VslDeck";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "StoryVenue — Presentation",
  description: "Private presentation.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function VslPage() {
  const store = await cookies();
  const unlocked = verifyToken(store.get(VSL_COOKIE)?.value);

  if (!unlocked) return <VslLockGate />;
  return <VslDeck />;
}
