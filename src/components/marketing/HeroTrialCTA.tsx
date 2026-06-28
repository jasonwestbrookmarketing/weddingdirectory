"use client";

import { ArrowRight } from "lucide-react";
import { sendExperimentClick } from "./ExperimentTracker";

/**
 * Hero CTA that records an A/B "click" conversion before navigating to the
 * trial signup. Mirrors the styling of the shared PrimaryCTA (lg size).
 */
export default function HeroTrialCTA({
  href,
  label,
  page,
  variantIds,
}: {
  href: string;
  label: string;
  page: string;
  variantIds: string[];
}) {
  return (
    <a
      href={href}
      onClick={() => sendExperimentClick(page, variantIds)}
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)] px-6 py-3.5 text-[15px]"
      style={{ fontFamily: "var(--font-open-sans)" }}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
