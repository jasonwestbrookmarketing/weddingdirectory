"use client";

/**
 * ListingTracker
 *
 * Fires analytics events for the public listing page at storyvenue.com.
 * Events are POSTed cross-origin to the StoryPay dashboard's
 * /api/listing-track endpoint, which persists them into `listing_events`.
 *
 * Events: page_view, session_heartbeat (every 30s), scroll_25/50/75/100,
 *         photo_view, faq_open, map_click, social_click.
 *
 * Any element with `data-track="event_name"` will fire that event when
 * clicked, no wiring needed on the parent component.
 */

import { useEffect, useRef } from "react";

const API_BASE =
  (process.env.NEXT_PUBLIC_STORYPAY_URL?.replace(/\/$/, "") ||
    "https://app.storyvenue.com");

const TRACK_URL = `${API_BASE}/api/listing-track`;

interface Props {
  venueId: string;
}

function getOrCreateSessionId(venueId: string): string {
  const key = `lsid_${venueId}`;
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

function getUtmParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get("utm_source") ?? undefined,
      utm_medium: p.get("utm_medium") ?? undefined,
      utm_campaign: p.get("utm_campaign") ?? undefined,
    };
  } catch {
    return {};
  }
}

export default function ListingTracker({ venueId }: Props) {
  const sessionId = useRef<string | null>(null);
  const scrollFired = useRef({
    s25: false,
    s50: false,
    s75: false,
    s100: false,
  });
  const firedPageView = useRef(false);
  const heartbeat = useRef<ReturnType<typeof setInterval> | null>(null);
  const photoSeen = useRef<Set<number>>(new Set());

  function track(event_type: string, event_data: Record<string, unknown> = {}) {
    if (!sessionId.current) return;
    const payload = {
      venue_id: venueId,
      session_id: sessionId.current,
      event_type,
      event_data,
      referrer: document.referrer || null,
      ...getUtmParams(),
    };
    fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      mode: "cors",
    })
      .then((res) => {
        if (!res.ok)
          console.error("[ListingTracker]", event_type, res.status);
      })
      .catch((err) => {
        console.error("[ListingTracker]", event_type, err);
      });
  }

  useEffect(() => {
    sessionId.current = getOrCreateSessionId(venueId);
    console.log(`[ListingTracker] venue=${venueId} url=${TRACK_URL}`);

    if (!firedPageView.current) {
      firedPageView.current = true;
      track("page_view");
    }

    // Heartbeat — powers "On listing right now". Fires immediately so the
    // visitor shows up in realtime, then every 30s while the tab is open.
    track("session_heartbeat");
    heartbeat.current = setInterval(
      () => track("session_heartbeat"),
      30_000
    );

    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = (scrolled / total) * 100;
      if (!scrollFired.current.s25 && pct >= 25) {
        scrollFired.current.s25 = true;
        track("scroll_25");
      }
      if (!scrollFired.current.s50 && pct >= 50) {
        scrollFired.current.s50 = true;
        track("scroll_50");
      }
      if (!scrollFired.current.s75 && pct >= 75) {
        scrollFired.current.s75 = true;
        track("scroll_75");
      }
      if (!scrollFired.current.s100 && pct >= 95) {
        scrollFired.current.s100 = true;
        track("scroll_100");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Explicit data-track takes priority when present.
      const tagged = target.closest("[data-track]") as HTMLElement | null;
      if (tagged) {
        const extra: Record<string, unknown> = {};
        if (tagged.dataset.trackIndex)
          extra.photo_index = Number(tagged.dataset.trackIndex);
        if (tagged.dataset.trackPlatform)
          extra.platform = tagged.dataset.trackPlatform;
        if (tagged.dataset.trackFaq)
          extra.faq_index = Number(tagged.dataset.trackFaq);
        track(tagged.dataset.track!, extra);
        return;
      }

      // 2. Auto-detect — infer the event from the element.
      // FAQ: <summary> is the clickable row of a <details> accordion.
      const summary = target.closest("summary") as HTMLElement | null;
      if (summary) {
        const details = summary.closest("details") as HTMLElement | null;
        const faqIndex = details?.parentElement
          ? Array.from(details.parentElement.children).indexOf(details)
          : -1;
        track("faq_open", { faq_index: faqIndex });
        return;
      }

      // Anchor targets: social, map, or generic outbound.
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        const mapMatch =
          /google\.com\/maps|maps\.google|openstreetmap|apple\.com\/maps/i.test(
            href
          );
        if (mapMatch) {
          track("map_click", { href });
          return;
        }
        const socialPlatforms: Record<string, RegExp> = {
          instagram: /instagram\.com/i,
          facebook: /facebook\.com|fb\.com/i,
          tiktok: /tiktok\.com/i,
          pinterest: /pinterest\.com|pin\.it/i,
          youtube: /youtube\.com|youtu\.be/i,
          twitter: /twitter\.com|x\.com/i,
          website: /^https?:\/\//i,
        };
        for (const [platform, rx] of Object.entries(socialPlatforms)) {
          if (rx.test(href)) {
            if (anchor.target === "_blank" || platform !== "website") {
              track("social_click", { platform, href });
              return;
            }
          }
        }
      }

      // Photo views are handled by the IntersectionObserver below (every photo
      // that crosses 50% visibility fires exactly once) so we skip click-based
      // detection here — clicking a photo tile that opens the gallery will
      // still fire once the tile was in view, and scrolling the modal will
      // fire one event per photo automatically.

      // Map container click (the map div itself doesn't always have an href).
      const mapEl = target.closest(
        '[data-map], .leaflet-container, [aria-label*="map" i]'
      ) as HTMLElement | null;
      if (mapEl) {
        track("map_click");
        return;
      }

      // Contact / inquiry CTA — button text based.
      const btn = target.closest("button,a") as HTMLElement | null;
      if (btn) {
        const text = (btn.innerText || btn.getAttribute("aria-label") || "")
          .trim()
          .toLowerCase();
        if (
          /^(inquire|contact|request|book|tour|get in touch|send message|check availability)/i.test(
            text
          )
        ) {
          track("contact_form_open", { label: text.slice(0, 40) });
          return;
        }
      }
    }
    document.addEventListener("click", onClick);

    // Photo view tracking via IntersectionObserver.
    // Any element with `data-photo-view-index="N"` will fire a photo_view
    // exactly once per N when it becomes 50% visible, so scrolling through
    // the fullscreen gallery records every image viewed without per-element
    // click handlers.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const raw = el.dataset.photoViewIndex;
          if (raw == null) continue;
          const idx = Number(raw);
          if (Number.isNaN(idx)) continue;
          if (photoSeen.current.has(idx)) continue;
          photoSeen.current.add(idx);
          track("photo_view", { photo_index: idx });
        }
      },
      { threshold: 0.5 }
    );

    // MutationObserver so the gallery modal (which mounts/unmounts dynamically)
    // gets picked up automatically when its photos land in the DOM.
    function observePhotoTargets(root: Node) {
      const nodes =
        root instanceof Element
          ? [
              ...(root.matches?.("[data-photo-view-index]") ? [root] : []),
              ...Array.from(root.querySelectorAll?.("[data-photo-view-index]") || []),
            ]
          : [];
      for (const n of nodes) io.observe(n);
    }
    observePhotoTargets(document.body);
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => observePhotoTargets(n));
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      if (heartbeat.current) clearInterval(heartbeat.current);
      io.disconnect();
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  return null;
}
