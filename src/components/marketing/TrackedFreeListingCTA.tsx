"use client";

import { ArrowRight } from "lucide-react";

/**
 * Identical look to PrimaryCTA but fires fbq('track', 'Lead') on click.
 * Use this for every "Claim Your Free Listing" button on /free-listing so
 * Meta can optimise for people who actually intent to sign up.
 *
 * Meta event map:
 *   ViewContent          → fired on page load (FireFreeListingLandingEvent)
 *   Lead                 → fired here on CTA click (intent to create listing)
 *   CompleteRegistration → must be fired by StoryPay on signup success page
 */
export default function TrackedFreeListingCTA({
  href,
  label = "Claim Your Free Listing",
  size = "lg",
  className = "",
}: {
  href: string;
  label?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm";

  function handleClick() {
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("track", "Lead", {
        content_name: "Free Listing CTA",
        content_category: "Venue Directory",
      });
    } catch { /* non-fatal */ }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)] ${sizing} ${className}`}
      style={{ fontFamily: "var(--font-open-sans)" }}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
