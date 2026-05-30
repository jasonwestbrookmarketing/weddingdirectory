import type { Metadata } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";
import MetaPixelRouteTracker from "@/components/MetaPixelRouteTracker";

// Meta (Facebook) Pixel. Override via NEXT_PUBLIC_META_PIXEL_ID if needed.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1897382194014416";

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
        {/* Meta Pixel base code — fires PageView on every hard page load,
            including /strategy-call/confirmed (the Booked Strategy Call
            custom conversion is a URL-contains rule on that page). */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <MetaPixelRouteTracker />
        {children}
      </body>
    </html>
  );
}
