import type { Metadata } from "next";

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
