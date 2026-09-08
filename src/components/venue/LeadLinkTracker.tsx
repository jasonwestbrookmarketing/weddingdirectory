"use client";

/**
 * LeadLinkTracker
 *
 * Analytics for the public Lead Link (link-in-bio) page at
 * storyvenue.com/venue/{slug}/links. Events are POSTed cross-origin to the
 * StoryPay dashboard's /api/listing-track endpoint, which persists them into
 * `listing_events`.
 *
 * Kept deliberately separate from ListingTracker so bio-link traffic never
 * pollutes the venue listing's view/funnel metrics:
 *   • lead_link_view         — fired once on mount
 *   • lead_link_click        — any element with data-track="lead_link_click"
 *   • lead_link_social_click — any element with data-track="lead_link_social_click"
 *
 * The clicked element may carry data-track-platform to record which button /
 * social channel was tapped.
 */

import { useEffect, useRef } from "react";
import { captureFbclid } from "@/lib/attribution";

const API_BASE =
  process.env.NEXT_PUBLIC_STORYPAY_URL?.replace(/\/$/, "") ||
  "https://app.storyvenue.com";

const TRACK_URL = `${API_BASE}/api/listing-track`;

interface Props {
  venueId: string;
}

function getOrCreateSessionId(venueId: string): string {
  const key = `llsid_${venueId}`;
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

export default function LeadLinkTracker({ venueId }: Props) {
  const sessionId = useRef<string | null>(null);
  const firedView = useRef(false);

  useEffect(() => {
    sessionId.current = getOrCreateSessionId(venueId);
    // Stash the Meta fbclid so the lead form can attach it on submit — an
    // ad-driven visitor who lands here still gets credited to the ad platform.
    captureFbclid(venueId);

    function track(event_type: string, event_data: Record<string, unknown> = {}) {
      if (!sessionId.current) return;
      const payload: Record<string, unknown> = {
        venue_id: venueId,
        session_id: sessionId.current,
        event_type,
        event_data,
        referrer: document.referrer || null,
      };
      fetch(TRACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
        mode: "cors",
      }).catch((err) => console.error("[LeadLinkTracker]", event_type, err));
    }

    if (!firedView.current) {
      firedView.current = true;
      track("lead_link_view");
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tagged = target.closest("[data-track]") as HTMLElement | null;
      if (!tagged) return;
      const evt = tagged.dataset.track;
      if (evt !== "lead_link_click" && evt !== "lead_link_social_click") return;
      const extra: Record<string, unknown> = {};
      if (tagged.dataset.trackPlatform) extra.platform = tagged.dataset.trackPlatform;
      track(evt, extra);
    }
    document.addEventListener("click", onClick);

    return () => document.removeEventListener("click", onClick);
  }, [venueId]);

  return null;
}
