import type { Metadata } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoryVenue — Find Your Perfect Wedding Venue",
  description:
    "Discover wedding venues that match your vision, guest count, and budget. Get pricing and check availability instantly.",
  icons: {
    icon: "/storyvenue-mark.png",
    apple: "/storyvenue-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-open-sans)] bg-white text-stone-900">
        {/* Announcement ticker */}
        <div className="bg-black overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_6%,white_94%,transparent)]">
          <div className="flex items-center h-10 animate-[announcement-ticker_50s_linear_infinite] whitespace-nowrap w-max">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="px-12 text-sm font-medium text-white tracking-wide"
              >
                StoryVenue Public Beta is live! Get your venue in front of more couples — List your venue free →
              </span>
            ))}
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
