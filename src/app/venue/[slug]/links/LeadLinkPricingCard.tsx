"use client";

import { useState } from "react";
import { FileText, ArrowUpRight } from "lucide-react";
import LeadFormModal from "@/components/lead/LeadFormModal";

interface Props {
  venueId: string;
  venueName: string;
  venueSlug: string;
  venueWebsite?: string;
}

/**
 * "Download Pricing & Availability" card for the Lead Link bio page.
 *
 * Opens the shared LeadFormModal in-page (rather than deep-linking to the
 * listing) so the inquiry is captured as a real lead. It seeds
 * utm_source=lead_link so StoryPay buckets it under the dedicated "Lead Link"
 * funnel source; any real ad attribution on the URL still wins.
 */
export default function LeadLinkPricingCard({
  venueId,
  venueName,
  venueSlug,
  venueWebsite,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-track="lead_link_click"
        data-track-platform="pricing"
        className="group flex w-full items-center gap-4 rounded-2xl border border-brand-line bg-white px-5 py-4 text-left shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-ink"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ink text-white">
          <FileText className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-snug text-brand-ink">
            Download Pricing &amp; Availability
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-brand-muted">
            Get the guide sent straight to your inbox
          </span>
        </span>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </button>

      <LeadFormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        venueId={venueId}
        venueName={venueName}
        venueSlug={venueSlug}
        venueWebsite={venueWebsite}
        attributionOverride={{ utm_source: "lead_link", utm_medium: "bio" }}
      />
    </>
  );
}
