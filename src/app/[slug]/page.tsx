import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { MapPin, ArrowUpRight, Store, Globe, CalendarHeart, Radio, Navigation } from "lucide-react";
import { fetchMinisite, RESERVED_TOP_PATHS, type MinisiteData } from "@/lib/minisite";
import { leadLinkIcon } from "@/lib/lead-link-icons";
import Countdown from "@/components/minisite/Countdown";
import Guestbook from "@/components/minisite/Guestbook";
import Gallery from "@/components/minisite/Gallery";
import RsvpFloating from "@/components/minisite/RsvpFloating";
import AddToCalendar from "@/components/minisite/AddToCalendar";
import LockGate from "@/components/minisite/LockGate";

export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://storyvenue.com"
).replace(/\/$/, "");

interface Props {
  params: Promise<{ slug: string }>;
}

function isBlockedSlug(slug: string): boolean {
  return RESERVED_TOP_PATHS.has(slug) || slug.includes(".");
}

function formatDate(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (isBlockedSlug(slug)) return { title: "StoryVenue", robots: { index: false } };
  const data = await fetchMinisite(slug);
  if (!data) return { title: "Wedding — StoryVenue", robots: { index: false } };
  if (data.locked) {
    return { title: `${data.coupleName} — Private`, robots: { index: false } };
  }

  const dateLine = formatDate(data.weddingDate);
  const title = `${data.coupleName}${dateLine ? ` — ${dateLine}` : " — Our Wedding"}`;
  const description = data.headline || `Join ${data.coupleName} to celebrate their wedding. RSVP, view details, and leave a note.`;
  const canonical = `${SITE_URL}/${slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "StoryVenue",
      images: data.photoUrl ? [{ url: data.photoUrl, width: 1200, height: 630 }] : data.coverUrl ? [{ url: data.coverUrl }] : [],
    },
  };
}

// Inline brand SVGs (lucide dropped brand icons in 0.543+).
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.361-.052.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.966 7.398 6.931 0 4.136-2.608 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

function socialList(data: MinisiteData) {
  const meta: [keyof MinisiteData["socials"], { label: string; Icon: React.ComponentType<{ className?: string }> }][] = [
    ["instagram", { label: "Instagram", Icon: InstagramIcon }],
    ["facebook", { label: "Facebook", Icon: FacebookIcon }],
    ["tiktok", { label: "TikTok", Icon: TikTokIcon }],
    ["pinterest", { label: "Pinterest", Icon: PinterestIcon }],
  ];
  return meta
    .filter(([key]) => typeof data.socials[key] === "string" && /^https?:\/\//i.test(data.socials[key] as string))
    .map(([key, m]) => ({ key, url: data.socials[key] as string, ...m }));
}

export default async function MinisitePage({ params }: Props) {
  const { slug } = await params;
  if (isBlockedSlug(slug)) notFound();

  const cookieStore = await cookies();
  const unlockKey = cookieStore.get(`sv_ms_${slug}`)?.value ?? null;

  const data = await fetchMinisite(slug, unlockKey);
  if (!data) notFound();
  if (data.locked) return <LockGate slug={slug} coupleName={data.coupleName} />;

  const dateLine = formatDate(data.weddingDate);
  const socials = socialList(data);
  const initials = data.coupleName
    .split(/\s*&\s*|\s+/)
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ── Reorderable blocks ────────────────────────────────────────────────────
  const countdownBlock =
    data.showCountdown && data.weddingDate ? (
      <div key="countdown" className="mt-7">
        <Countdown date={data.weddingDate} />
      </div>
    ) : null;

  const storyBlock =
    data.storyHtml || data.story ? (
      <div key="story" className="mt-7">
        {data.storyHtml ? (
          <div
            className="story-content mx-auto max-w-[520px] text-left text-[15px] leading-relaxed text-brand-ink [&_h1]:mb-1 [&_h1]:mt-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-1 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_p]:my-1.5"
            // Sanitized on write in StoryPay (allowlist of formatting tags only).
            dangerouslySetInnerHTML={{ __html: data.storyHtml }}
          />
        ) : (
          <p className="mx-auto max-w-[520px] whitespace-pre-line text-left text-[15px] leading-relaxed text-brand-ink">{data.story}</p>
        )}
      </div>
    ) : null;

  const galleryBlock =
    data.gallery.length > 0 ? (
      <div key="gallery" className="mt-8">
        <Gallery images={data.gallery} coupleName={data.coupleName} />
      </div>
    ) : null;

  const embedBlock = data.embedHtml ? (
    <section key="embed" className="mt-10">
      <h2 className="flex items-center justify-center gap-2 text-center text-lg font-semibold text-brand-ink">
        <Radio className="h-4 w-4" /> {data.embedTitle || "Livestream"}
      </h2>
      <div
        className="relative mt-4 w-full overflow-hidden rounded-[10px] border border-brand-line bg-black shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]"
        style={{ paddingBottom: "56.25%" }}
        // Single https iframe rebuilt server-side by StoryPay (no scripts) — safe.
        dangerouslySetInnerHTML={{ __html: data.embedHtml }}
      />
    </section>
  ) : null;

  // Links block: venue always first (name + address → Google Maps), then custom links.
  const linksBlock =
    data.venue || data.customLinks.length > 0 ? (
      <div key="links" className="mt-8 flex flex-col gap-3">
        {data.venue && (
          <a
            href={data.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-4 rounded-[10px] border border-brand-line bg-white px-5 py-4 text-left shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-ink"
          >
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-ink text-white">
              {data.venue.coverUrl ? (
                <Image src={data.venue.coverUrl} alt="" fill unoptimized sizes="48px" className="object-cover" />
              ) : (
                <Store className="h-5 w-5" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] uppercase tracking-wide text-brand-muted">Our Venue</span>
              <span className="block truncate text-[15px] font-semibold leading-snug text-brand-ink">{data.venue.name}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[13px] text-brand-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{data.venue.address || [data.venue.city, data.venue.state].filter(Boolean).join(", ") || "Get directions"}</span>
              </span>
            </span>
            <Navigation className="h-5 w-5 shrink-0 text-brand-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}
        {data.customLinks.map((l, i) => {
          const Icon = leadLinkIcon(l.icon);
          return (
            <a
              key={`${l.url}-${i}`}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center gap-4 rounded-[10px] border border-brand-line bg-white px-5 py-4 text-left shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-ink"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ink text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold leading-snug text-brand-ink">{l.label}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          );
        })}
      </div>
    ) : null;

  const blockMap: Record<string, React.ReactNode> = {
    countdown: countdownBlock,
    story: storyBlock,
    gallery: galleryBlock,
    links: linksBlock,
    embed: embedBlock,
  };

  return (
    <main className="flex min-h-screen justify-center bg-brand-warm px-4 pt-4 pb-28">
      <div className="w-full max-w-[560px]">
        {/* Cover hero */}
        {data.coverUrl && (
          <div className="relative mb-[-56px] h-52 w-full overflow-hidden rounded-[10px] border border-brand-line shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)] sm:h-60">
            <Image src={data.coverUrl} alt="" fill unoptimized priority sizes="560px" className="object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className={`relative z-10 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)]`}>
            {data.photoUrl ? (
              <Image src={data.photoUrl} alt={data.coupleName} fill priority unoptimized sizes="112px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-brand-ink text-3xl font-semibold text-white">{initials || "♥"}</span>
            )}
          </div>

          <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-3xl italic text-brand-ink">{data.coupleName}</h1>
          {dateLine && (
            <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-brand-muted">
              <CalendarHeart className="h-4 w-4" /> {dateLine}
            </p>
          )}
          {data.headline && <p className="mt-3 max-w-[440px] text-[15px] text-brand-ink">{data.headline}</p>}
          {data.weddingDate && (
            <AddToCalendar
              title={`${data.coupleName} — Wedding`}
              date={data.weddingDate}
              time={data.weddingTime}
              location={
                data.venue
                  ? [data.venue.name, data.venue.address || [data.venue.city, data.venue.state].filter(Boolean).join(", ")].filter(Boolean).join(", ")
                  : null
              }
              details={data.headline || `Celebrate with ${data.coupleName}! RSVP at ${SITE_URL}/${slug}`}
            />
          )}
        </div>

        {/* Socials */}
        {socials.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {socials.map(({ key, url, label, Icon }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white text-brand-muted transition-all hover:-translate-y-0.5 hover:border-brand-ink hover:text-brand-ink"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        )}

        {/* Reorderable blocks, in the couple's chosen order */}
        {data.sectionOrder.map((key) => blockMap[key] ?? null)}

        {/* Guestbook */}
        {data.showGuestbook && <Guestbook slug={slug} />}

        {/* Footer */}
        <p className="mt-12 text-center text-xs text-brand-muted">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline-offset-2 hover:text-brand-ink hover:underline">
            <Globe className="h-3.5 w-3.5" /> Made with StoryVenue
          </Link>
        </p>
      </div>

      {/* Always-present floating RSVP */}
      {data.rsvpEnabled && <RsvpFloating slug={slug} weddingDate={data.weddingDate} />}
    </main>
  );
}
