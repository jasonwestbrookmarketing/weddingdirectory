import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Clock, MapPin } from "lucide-react";

// Brand icons were removed from lucide-react 0.543+ (see the same pattern in
// src/components/venue/VenuePublicBlocks.tsx), so we ship our own small
// inline SVGs. `currentColor` so they inherit from the button text color.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.54l.38-2.95H13.5V8.7c0-.85.24-1.43 1.47-1.43h1.56V4.64a20.8 20.8 0 0 0-2.28-.12c-2.26 0-3.81 1.38-3.81 3.92v2.11H7.88v2.95h2.56V21h3.06z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.115C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.526A2.994 2.994 0 0 0 .502 6.186 31.03 31.03 0 0 0 0 12a31.03 31.03 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.112 2.115c1.881.526 9.386.526 9.386.526s7.505 0 9.386-.526a2.994 2.994 0 0 0 2.112-2.115A31.03 31.03 0 0 0 24 12a31.03 31.03 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM7.114 20.452H3.558V9h3.556v11.452zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124z" />
    </svg>
  );
}

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://storyvenue.com"
).replace(/\/$/, "");

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Book a Call with Jason | StoryVenue",
  description:
    "Get in touch with Jason and book time on his calendar to talk about fully booking your wedding venue.",
  alternates: { canonical: "/jason" },
  // Personal contact/booking link — meant for direct sharing, not organic search.
  // Flip this to true if you'd rather it be discoverable via Google.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "Book a Call with Jason | StoryVenue",
    description:
      "Get in touch with Jason and book time on his calendar to talk about fully booking your wedding venue.",
    url: "/jason",
    siteName: "StoryVenue",
    type: "profile",
  },
};

// ── Edit everything in this block to update the page content ──────────────
const PROFILE = {
  // Drop a square headshot into /public/jason-photo.jpg (at least 200x200px).
  photo: "/jason-photo.jpg",
  name: "Jason Westbrook",
  title: "Founder, StoryVenue",
  heading: "Let's Talk About Your Venue",
  description:
    "Want to fully book your wedding venue without paying The Knot or WeddingWire another cent? Grab a few minutes on my calendar and I'll walk you through exactly how StoryVenue can help.",
  hours: "Monday–Friday · 9:00 AM – 5:00 PM ET",
  location: "USA · Remote",
  socials: [
    { icon: FacebookIcon, href: "https://facebook.com/storyvenue", label: "Facebook" },
    { icon: InstagramIcon, href: "https://instagram.com/storyvenue", label: "Instagram" },
    { icon: YoutubeIcon, href: "https://youtube.com/@storyvenue", label: "YouTube" },
    { icon: LinkedinIcon, href: "https://linkedin.com/company/storyvenue", label: "LinkedIn" },
  ],
};

const GHL_CALENDAR_URL = "https://api.leadconnectorhq.com/widget/booking/3elDdFHS38YLNp25JeB5";
const GHL_CALENDAR_ID = "3elDdFHS38YLNp25JeB5_1787061067537";
const GHL_EMBED_SCRIPT = "https://link.msgsndr.com/js/form_embed.js";
// ────────────────────────────────────────────────────────────────────────────

export default function JasonPage() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-brand-warm px-4 py-10 sm:py-16">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-brand-line overflow-hidden grid grid-cols-1 md:grid-cols-[420px_1fr] divide-y md:divide-y-0 md:divide-x divide-brand-line">
          {/* Left — profile / bio */}
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-10">
            <div>
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-brand-warm ring-1 ring-brand-line">
                <Image
                  src={PROFILE.photo}
                  alt={PROFILE.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <p className="mt-4 text-base font-semibold text-brand-ink">{PROFILE.name}</p>
              <p className="text-sm text-brand-muted">{PROFILE.title}</p>

              <h1
                className="mt-6 text-3xl sm:text-[2.25rem] font-normal leading-tight tracking-tight text-brand-ink"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {PROFILE.heading}
              </h1>

              <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">
                {PROFILE.description}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-brand-ink">
                  <Clock className="w-4 h-4 text-brand-muted shrink-0" />
                  <span>{PROFILE.hours}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-brand-ink">
                  <MapPin className="w-4 h-4 text-brand-muted shrink-0" />
                  <span>{PROFILE.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {PROFILE.socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-brand-line text-brand-muted hover:text-brand-ink hover:border-brand-ink transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right — GHL calendar embed (renders its own date/time picker UI) */}
          <div className="bg-white p-2 sm:p-4">
            <iframe
              src={GHL_CALENDAR_URL}
              id={GHL_CALENDAR_ID}
              allow="payment"
              scrolling="no"
              style={{ width: "100%", border: "none", overflow: "hidden", display: "block" }}
              className="min-h-[640px] sm:min-h-[700px]"
              title="Book a call"
            />
          </div>
        </div>
      </main>

      <Script src={GHL_EMBED_SCRIPT} strategy="afterInteractive" />
    </>
  );
}
