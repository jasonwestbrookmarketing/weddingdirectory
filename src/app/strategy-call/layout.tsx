import type { Metadata, Viewport } from "next";

// Prevent iOS from auto-zooming when the user taps into the GHL calendar's
// input fields (which have font-size < 16px). Cross-origin iframes can't be
// restyled from the parent, so we stop the page from scaling instead.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Shared social share card. Applied here on the layout so every
// /strategy-call funnel page (main, /book, /confirmed, /start-free) renders
// the exact same preview when a link is shared in a text or on social.
const OG_IMAGE = {
  url: "/og-strategy-call.png",
  width: 1731,
  height: 909,
  alt: "StoryVenue — Fully Book Your Wedding Venue",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://storyvenue.com"),
  title: "Fully Book Your Wedding Venue | StoryVenue",
  description:
    "The first and only booking system built for wedding venues. Book a free strategy call.",
  alternates: { canonical: "/strategy-call" },
  // Funnel pages — keep them out of search. Only reachable via ads or links we send.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title:
      "Fully Book Your Wedding Venue Without Paying The Knot or WeddingWire Another Cent",
    description:
      "The first and only booking system built for wedding venues. Book a free strategy call.",
    url: "/strategy-call",
    siteName: "StoryVenue",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Fully Book Your Wedding Venue Without Paying The Knot or WeddingWire Another Cent",
    description:
      "The first and only booking system built for wedding venues. Book a free strategy call.",
    images: [OG_IMAGE.url],
  },
};

export default function StrategyCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
