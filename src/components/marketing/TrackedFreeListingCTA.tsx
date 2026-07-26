"use client";

import { ArrowRight } from "lucide-react";

/**
 * Fires fbq('track', 'Lead') on click.
 * variant="dark"  → black pill (default, light backgrounds)
 * variant="light" → white pill (dark/black section backgrounds)
 */
export default function TrackedFreeListingCTA({
  href,
  label = "Claim Your Free Listing",
  size = "lg",
  variant = "dark",
  className = "",
}: {
  href: string;
  label?: string;
  size?: "md" | "lg";
  variant?: "dark" | "light";
  className?: string;
}) {
  const sizing =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm";

  const tone =
    variant === "light"
      ? "bg-white text-stone-900 hover:bg-stone-50 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.35)]"
      : "bg-stone-900 text-white hover:bg-stone-800 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)]";

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
      className={`group inline-flex items-center justify-center gap-2 rounded-full font-semibold active:scale-[0.98] transition-all ${tone} ${sizing} ${className}`}
      style={{ fontFamily: "var(--font-open-sans)" }}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
