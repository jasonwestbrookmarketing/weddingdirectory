import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Building2,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
  Globe,
} from "lucide-react";

// Brand icons were removed from lucide-react 0.543+ (same pattern used in
// src/app/jason/page.tsx and src/components/venue/VenuePublicBlocks.tsx), so we
// ship our own small inline SVGs. `currentColor` so they inherit the text color.
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

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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
  title: "StoryVenue — Links",
  description:
    "Everything StoryVenue in one place: find a wedding venue, list your venue for free, book more weddings, and connect with us.",
  alternates: { canonical: "/links" },
  openGraph: {
    title: "StoryVenue — Links",
    description:
      "Everything StoryVenue in one place: find a wedding venue, list your venue for free, book more weddings, and connect with us.",
    url: "/links",
    siteName: "StoryVenue",
    type: "website",
    images: [{ url: "/og-strategy-call.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryVenue — Links",
    description:
      "Find a wedding venue, list your venue for free, book more weddings, and connect with us.",
    images: ["/og-strategy-call.png"],
  },
};

// ── Edit everything in this block to update the page ────────────────────────
const PROFILE = {
  // Circular brand mark shown at the top. Swap the file in /public if needed.
  mark: "/storyvenue-mark.png",
  name: "StoryVenue",
  handle: "@storyvenue",
  tagline:
    "The story of your day starts with the perfect place. Tap a link below.",
};

type LinkItem = {
  label: string;
  description?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  featured?: boolean;
};

// Reorder / add / remove freely. Internal routes start with "/"; anything
// starting with "http" opens in a new tab automatically.
const LINKS: LinkItem[] = [
  {
    label: "Find Your Wedding Venue",
    description: "Browse venues by location, guest count & budget",
    href: "/venues",
    icon: Search,
    featured: true,
  },
  {
    label: "List Your Venue — Free",
    description: "Venue owners: claim your free StoryVenue listing",
    href: "/free-listing",
    icon: Building2,
  },
  {
    label: "Book More Weddings",
    description: "The system that fills your venue's calendar",
    href: "/book-more-weddings",
    icon: TrendingUp,
  },
  {
    label: "Book a Call with Jason",
    description: "1:1 strategy call with our founder",
    href: "/jason",
    icon: CalendarDays,
  },
  {
    label: "Watch on YouTube",
    description: "The Bride Booking System channel",
    href: "https://www.youtube.com/@bridebookingsystem",
    icon: YoutubeIcon,
  },
];

const SOCIALS = [
  { icon: Globe, href: "https://storyvenue.com", label: "Website" },
  { icon: InstagramIcon, href: "https://www.instagram.com/storyvenue", label: "Instagram" },
  { icon: YoutubeIcon, href: "https://www.youtube.com/@bridebookingsystem", label: "YouTube" },
  { icon: TiktokIcon, href: "https://www.tiktok.com/@storyvenue", label: "TikTok" },
];
// ────────────────────────────────────────────────────────────────────────────

function LinkButton({ item }: { item: LinkItem }) {
  const { label, description, href, icon: Icon, featured } = item;
  const external = href.startsWith("http");

  const base =
    "group relative flex items-center gap-4 w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40";
  const skin = featured
    ? "border-transparent bg-brand-ink text-white shadow-[0_16px_40px_-18px_rgba(0,0,0,0.55)] hover:bg-black"
    : "border-brand-line bg-white text-brand-ink shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)] hover:border-brand-ink";

  const inner = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          featured
            ? "bg-white/10 text-white"
            : "bg-brand-warm text-brand-gold"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug">
          {label}
        </span>
        {description ? (
          <span
            className={`mt-0.5 block text-[13px] leading-snug ${
              featured ? "text-white/70" : "text-brand-muted"
            }`}
          >
            {description}
          </span>
        ) : null}
      </span>

      <ArrowUpRight
        className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
          featured ? "text-white/70" : "text-brand-muted"
        }`}
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${skin}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${skin}`}>
      {inner}
    </Link>
  );
}

export default function LinksPage() {
  return (
    <main className="flex min-h-screen justify-center bg-brand-warm px-4 py-12 sm:py-16">
      <div className="w-full max-w-[520px]">
        {/* Header — brand mark, name, tagline */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-brand-line bg-white p-3 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)]">
            <Image
              src={PROFILE.mark}
              alt={PROFILE.name}
              width={72}
              height={72}
              priority
              className="h-auto w-full object-contain"
            />
          </div>

          <h1
            className="mt-5 text-3xl font-normal tracking-tight text-brand-ink"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {PROFILE.name}
          </h1>
          <p className="mt-1 text-sm font-medium text-brand-gold">
            {PROFILE.handle}
          </p>
          <p className="mt-3 max-w-[22rem] text-[15px] leading-relaxed text-brand-muted">
            {PROFILE.tagline}
          </p>
        </div>

        {/* Links */}
        <div className="mt-9 flex flex-col gap-3">
          {LINKS.map((item) => (
            <LinkButton key={item.label} item={item} />
          ))}
        </div>

        {/* Socials */}
        <div className="mt-9 flex items-center justify-center gap-3">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-line bg-white text-brand-muted transition-colors hover:border-brand-ink hover:text-brand-ink"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-brand-muted">
          © {new Date().getFullYear()} StoryVenue ·{" "}
          <Link href="/" className="underline-offset-2 hover:text-brand-ink hover:underline">
            storyvenue.com
          </Link>
        </p>
      </div>
    </main>
  );
}
