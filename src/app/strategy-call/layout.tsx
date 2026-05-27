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

export const metadata: Metadata = {
  metadataBase: new URL("https://storyvenue.com"),
  title: "Fully Book Your Wedding Venue | StoryVenue",
  description:
    "The first and only booking system built for wedding venues. Book a free strategy call.",
  alternates: { canonical: "/strategy-call" },
  openGraph: {
    title:
      "Fully Book Your Wedding Venue Without Paying The Knot or WeddingWire Another Cent",
    description:
      "The first and only booking system built for wedding venues. Book a free strategy call.",
    url: "/strategy-call",
    siteName: "StoryVenue",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Fully Book Your Wedding Venue Without Paying The Knot or WeddingWire Another Cent",
    description:
      "The first and only booking system built for wedding venues. Book a free strategy call.",
  },
};

export default function StrategyCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
