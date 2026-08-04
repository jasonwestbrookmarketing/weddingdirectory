"use client";

import Script from "next/script";

const PIXEL_ID_RE = /^\d{5,20}$/;

/**
 * Fires the VENUE's OWN Meta Pixel on their thank-you page only, so a venue
 * can set up their own Meta custom conversion for guide downloads.
 *
 * This is intentionally separate from the sitewide StoryVenue marketing
 * pixel that already loads in the root layout (id 573278748454943) — that
 * one tracks StoryVenue's own ad campaigns and must never be conflated with
 * a venue's ad account. We use `trackSingle` (not `track`) so the PageView
 * only counts against the venue's pixel, not the default/sitewide one.
 */
export function VenueMetaPixelScript({ pixelId }: { pixelId: string | null | undefined }) {
  const id = typeof pixelId === "string" ? pixelId.trim() : "";
  if (!PIXEL_ID_RE.test(id)) return null;

  return (
    <>
      <Script id="venue-meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(id)});
fbq('trackSingle', ${JSON.stringify(id)}, 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- noscript fallback pixel must be a plain <img>, next/image requires JS */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(id)}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
