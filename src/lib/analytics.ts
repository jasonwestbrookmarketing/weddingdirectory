type AnalyticsEvent =
  | "homepage_search_submitted"
  | "search_filter_applied"
  | "venue_card_clicked"
  | "venue_page_viewed"
  | "lead_cta_clicked"
  | "lead_form_started"
  | "lead_form_submitted"
  | "lead_form_failed";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  // PostHog integration point
  if ("posthog" in window && typeof (window as Record<string, unknown>).posthog === "object") {
    (window as { posthog: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog.capture(event, properties);
  }

  // GA4 integration point
  if ("gtag" in window && typeof (window as Record<string, unknown>).gtag === "function") {
    (window as { gtag: (...args: unknown[]) => void }).gtag("event", event, properties);
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${event}`, properties);
  }
}
