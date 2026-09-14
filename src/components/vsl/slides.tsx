"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const Playfair = "font-[family-name:var(--font-playfair)]";

/* ----------------------------------------------------------------------- */
/* Primitives                                                              */
/* ----------------------------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[12px] font-semibold uppercase tracking-[0.28em] text-brand-gold ${className}`}>
      {children}
    </p>
  );
}

function GoldRule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-14 bg-brand-gold ${className}`} />;
}

function Wordmark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <Image src="/storyvenue-dark-logo.png" alt="StoryVenue" width={3000} height={751} priority className={className} />
  );
}

const Gold = ({ children }: { children: ReactNode }) => (
  <span className="text-brand-gold">{children}</span>
);

function Point({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="flex items-start gap-3.5 py-[7px]">
        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-gold" />
        <span className="text-[17px] leading-snug text-brand-ink">{children}</span>
      </div>
    </Reveal>
  );
}

/** Image-forward split. `side` = which side the photo sits on. */
function Frame({
  photo,
  alt,
  side = "right",
  priority = false,
  children,
}: {
  photo: string;
  alt: string;
  side?: "left" | "right";
  priority?: boolean;
  children: ReactNode;
}) {
  const photoEl = (
    <div className="relative h-full w-[55%] shrink-0 overflow-hidden">
      <Image src={photo} alt={alt} fill unoptimized priority={priority} className="object-cover" />
      <div className="absolute inset-0 bg-brand-ink/[0.04]" />
      <div
        className={`absolute inset-y-0 w-40 ${
          side === "right"
            ? "left-0 bg-gradient-to-r from-brand-warm to-transparent"
            : "right-0 bg-gradient-to-l from-brand-warm to-transparent"
        }`}
      />
    </div>
  );
  const contentEl = (
    <div className="flex h-full w-[45%] flex-col justify-center px-14">{children}</div>
  );
  return (
    <div className="flex h-full w-full bg-brand-warm">
      {side === "left" ? (
        <>
          {photoEl}
          {contentEl}
        </>
      ) : (
        <>
          {contentEl}
          {photoEl}
        </>
      )}
    </div>
  );
}

/** Full-width editorial slide on warm bg, with an optional faint photo wash. */
function Editorial({ bg, children }: { bg?: string; children: ReactNode }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-brand-warm px-16 text-center">
      {bg && <Image src={bg} alt="" fill unoptimized className="object-cover opacity-[0.08]" />}
      <div className="relative w-full">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Slides — copy drawn only from the VSL script                            */
/* ----------------------------------------------------------------------- */

// 1 · HOOK
function SlideHook() {
  return (
    <Frame photo="/vsl/photo-01.jpg" alt="A quiet wedding venue at golden hour" side="right" priority>
      <Reveal>
        <Wordmark className="h-8 w-auto" />
      </Reveal>
      <Reveal delay={0.1}>
        <GoldRule className="mt-6" />
      </Reveal>
      <Reveal delay={0.16}>
        <Eyebrow className="mt-6">The Bride Booking System</Eyebrow>
      </Reveal>
      <Reveal delay={0.24}>
        <h1 className={`${Playfair} mt-5 text-[56px] leading-[1.03] text-brand-ink`}>
          Stuck Repeating the Same Year in Business?
        </h1>
      </Reveal>
      <Reveal delay={0.34}>
        <p className="mt-6 max-w-[440px] text-[18px] leading-relaxed text-brand-muted">
          Same half-empty calendar. Same number of bookings. Working harder than
          ever — with nothing to show for it.
        </p>
      </Reveal>
      <Reveal delay={0.44}>
        <p className={`${Playfair} mt-6 max-w-[440px] text-[19px] italic leading-snug text-brand-ink`}>
          Give me the next five minutes. I&apos;ll show you exactly why — and how to
          fix it.
        </p>
      </Reveal>
    </Frame>
  );
}

// 2 · TURN
function SlideTurn() {
  return (
    <Frame photo="/vsl/photo-08.jpg" alt="A venue owner working late" side="left">
      <Reveal>
        <h1 className={`${Playfair} text-[60px] leading-[1] text-brand-ink`}>
          It&apos;s None of Those Things.
        </h1>
      </Reveal>
      <div className="mt-8 max-w-[440px]">
        <Point delay={0.16}>Not the economy.</Point>
        <Point delay={0.26}>Not your pricing.</Point>
        <Point delay={0.36}>Not the competition.</Point>
      </div>
      <Reveal delay={0.5}>
        <p className="mt-6 text-[16px] text-brand-muted">
          It&apos;s not your effort. It&apos;s not your venue.
        </p>
      </Reveal>
      <Reveal delay={0.6}>
        <p className={`${Playfair} mt-4 max-w-[460px] text-[24px] leading-snug text-brand-ink`}>
          You don&apos;t have a system for how brides <Gold>actually book today.</Gold>
        </p>
      </Reveal>
    </Frame>
  );
}

// 3 · IT'S THE COUPLE
function SlideCouple() {
  return (
    <Frame photo="/vsl/photo-09.jpg" alt="A bride on her phone" side="right">
      <Reveal>
        <h1 className={`${Playfair} text-[52px] leading-[1.05] text-brand-ink`}>
          It&apos;s Not the Market — <Gold>It&apos;s the Couple.</Gold>
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-6 max-w-[450px] text-[18px] leading-relaxed text-brand-ink">
          She&apos;s not booking the best venue anymore. She&apos;s booking the one
          that answers first and makes it easy.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <GoldRule className="mt-7" />
      </Reveal>
      <Reveal delay={0.4}>
        <p className="mt-6 max-w-[450px] text-[17px] leading-relaxed text-brand-muted">
          If you&apos;re not first to be seen and first to respond, she doesn&apos;t
          even know you exist.
        </p>
      </Reveal>
    </Frame>
  );
}

// 4 · EVERYTHING YOU WERE TOLD
function SlideTold() {
  return (
    <Editorial bg="/vsl/photo-05.jpg">
      <Reveal>
        <h1 className={`${Playfair} mx-auto max-w-[880px] text-[54px] leading-[1.06] text-brand-ink`}>
          Everything You Were Told Would Work <Gold>Doesn&apos;t.</Gold>
        </h1>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mx-auto mt-6 max-w-[640px] text-[18px] leading-relaxed text-brand-muted">
          You list on the directories. You hire the agencies. You post on social
          media. You try to do it all yourself.
        </p>
      </Reveal>
      <div className="mt-10 flex items-center justify-center gap-4">
        {["Directories", "Agencies", "Social Media"].map((c, i) => (
          <Reveal key={c} delay={0.3 + i * 0.12}>
            <span className="rounded-full border border-brand-ink/20 bg-white/70 px-7 py-3 text-[15px] font-semibold uppercase tracking-[0.14em] text-brand-ink">
              {c}
            </span>
          </Reveal>
        ))}
      </div>
    </Editorial>
  );
}

// 5 · DIRECTORIES
function SlideDirectories() {
  return (
    <Frame photo="/vsl/photo-03.jpg" alt="A couple at a competitor's venue" side="left">
      <Reveal>
        <Eyebrow>Directories</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className={`${Playfair} mt-5 text-[46px] leading-[1.05] text-brand-ink`}>
          It Only Gets You <Gold>Seen.</Gold> Not <Gold>Chosen.</Gold>
        </h1>
      </Reveal>
      <div className="mt-7 max-w-[460px]">
        <Point delay={0.22}>It was never built for you — it was built for the bride.</Point>
        <Point delay={0.32}>You just happen to be the one paying for it.</Point>
        <Point delay={0.42}>A year-long contract, listed next to ten other venues.</Point>
        <Point delay={0.52}>
          You pay for brides to book at your competitor&apos;s instead of yours.
        </Point>
      </div>
    </Frame>
  );
}

// 6 · AGENCIES
function SlideAgencies() {
  return (
    <Frame photo="/vsl/photo-04.jpg" alt="Contracts and paperwork" side="right">
      <Reveal>
        <Eyebrow>Agencies</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className={`${Playfair} mt-5 text-[46px] leading-[1.05] text-brand-ink`}>
          Most Have Never <Gold>Booked a Wedding</Gold> in Their Life.
        </h1>
      </Reveal>
      <div className="mt-7 max-w-[460px]">
        <Point delay={0.22}>They promise you the world, take your money, and get you nothing.</Point>
        <Point delay={0.32}>Arrogant, pushy, gimmicky.</Point>
        <Point delay={0.42}>They sell you a tactic — never a transformation.</Point>
        <Point delay={0.52}>The same generic software every other agency uses.</Point>
      </div>
    </Frame>
  );
}

// 7 · SOCIAL MEDIA
function SlideSocial() {
  return (
    <Frame photo="/vsl/photo-09.jpg" alt="Scrolling a social feed" side="left">
      <Reveal>
        <Eyebrow>Social Media</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className={`${Playfair} mt-5 text-[44px] leading-[1.06] text-brand-ink`}>
          You&apos;re Posting to People Who <Gold>Already Follow You.</Gold>
        </h1>
      </Reveal>
      <div className="mt-7 max-w-[460px]">
        <Point delay={0.22}>Only one or two percent of your community ever sees it.</Point>
        <Point delay={0.32}>The algorithm isn&apos;t built to show all your posts.</Point>
        <Point delay={0.42}>They aren&apos;t newly engaged brides looking for a venue.</Point>
        <Point delay={0.52}>The brides still searching never see you.</Point>
      </div>
    </Frame>
  );
}

// 8 · PROOF
function SlideProof() {
  const cases: { venue: string; big: string; small: string }[] = [
    { venue: "Retreat at Evans Farms", big: "100+", small: "inquiries a month from real brides" },
    { venue: "White Pine Manor", big: "8 + 3", small: "tours and weddings in the last 30 days" },
    { venue: "Atlantic Stables", big: "+$10K", small: "in booked weddings his first month live" },
    { venue: "Magnolia Event Center", big: "48 hrs", small: "to his very first booked tour" },
  ];
  return (
    <Editorial bg="/vsl/photo-11.jpg">
      <Reveal>
        <Eyebrow>This Works — And It Works Fast</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-4 text-[50px] leading-[1.05] text-brand-ink`}>
          Same System, Different Venues, <Gold>Real Bookings.</Gold>
        </h1>
      </Reveal>
      <div className="mx-auto mt-10 grid w-full max-w-[1040px] grid-cols-4 gap-5">
        {cases.map((c, i) => (
          <Reveal key={c.venue} delay={0.26 + i * 0.1}>
            <div className="h-full rounded-2xl border border-brand-line border-t-[3px] border-t-brand-gold bg-white px-5 py-7 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
                {c.venue}
              </p>
              <p className={`${Playfair} mt-4 text-[38px] leading-none text-brand-ink`}>{c.big}</p>
              <p className="mt-3 text-[13px] leading-snug text-brand-muted">{c.small}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Editorial>
  );
}

// 9 · JASON
function SlideJason() {
  return (
    <Frame photo="/vsl/photo-06.jpg" alt="Jason Westbrook, founder of StoryVenue" side="right">
      <Reveal>
        <Eyebrow>Founder · StoryVenue &amp; The Bride Booking System</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-5 text-[54px] leading-[1.03] text-brand-ink`}>
          Hi, I&apos;m Jason Westbrook.
        </h1>
      </Reveal>
      <Reveal delay={0.24}>
        <p className="mt-6 text-[18px] text-brand-ink">
          14 years in the wedding-venue industry. Well over 500 venues served.
        </p>
      </Reveal>
      <Reveal delay={0.34}>
        <GoldRule className="mt-7" />
      </Reveal>
      <Reveal delay={0.44}>
        <p className="mt-6 max-w-[450px] text-[17px] leading-relaxed text-brand-muted">
          I know exactly why a bride chooses one venue and scrolls past another —
          and how to make sure she chooses yours first.
        </p>
      </Reveal>
    </Frame>
  );
}

// 10 · URGENCY
function SlideUrgency() {
  return (
    <Frame photo="/vsl/photo-14.jpg" alt="A wedding venue at sunset" side="left">
      <Reveal>
        <h1 className={`${Playfair} text-[52px] leading-[1.04] text-brand-ink`}>
          Engaged Couples Are Searching in <Gold>Your Area Right Now.</Gold>
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-6 max-w-[460px] text-[18px] leading-relaxed text-brand-ink">
          The only question is whether they find you first — or find your
          competitor.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <GoldRule className="mt-7" />
      </Reveal>
      <Reveal delay={0.4}>
        <p className={`${Playfair} mt-6 max-w-[460px] text-[21px] italic leading-snug text-brand-ink`}>
          The venues booking more tours and more weddings are the ones who decided
          to change. Right now.
        </p>
      </Reveal>
    </Frame>
  );
}

// 11 · THE 6-STAGE SYSTEM
function SlideSystem() {
  const stages: { title: string; sub: string }[] = [
    { title: "Attract the ideal brides in your area", sub: "so you get seen first" },
    { title: "Respond instantly", sub: "so she never waits" },
    { title: "Have real conversations", sub: "so she trusts you early" },
    { title: "Qualify every bride", sub: "ready to book, not just browsing" },
    { title: "Hand her to you", sub: "warm and ready" },
    { title: "You host the tour", sub: "and you book the wedding" },
  ];
  return (
    <Editorial bg="/vsl/photo-01.jpg">
      <Reveal>
        <Eyebrow>The Bride Booking System</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className={`${Playfair} mt-4 mx-auto max-w-[900px] text-[44px] leading-[1.06] text-brand-ink`}>
          One Connected System — From First Click to <Gold>Signed Contract.</Gold>
        </h1>
      </Reveal>
      <div className="mx-auto mt-10 grid w-full max-w-[1080px] grid-cols-6 gap-3">
        {stages.map((s, i) => (
          <Reveal key={i} delay={0.24 + i * 0.09}>
            <div className="flex h-[200px] flex-col items-center rounded-2xl border border-brand-line bg-white/95 px-3 pb-5 pt-6 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]">
              <span className={`${Playfair} flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink text-[16px] text-white`}>
                {i + 1}
              </span>
              <p className={`${Playfair} mt-4 text-center text-[15px] leading-tight text-brand-ink`}>
                {s.title}
              </p>
              <p className="mt-2 text-center text-[12px] leading-snug text-brand-muted">{s.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Editorial>
  );
}

// 12 · VALUE STACK / DIFFERENTIATOR
function SlidePlatform() {
  const features: string[] = [
    "Every lead in one inbox",
    "Branded proposals she can sign and pay a deposit on from her phone",
    "Real venue concierges who follow up with your brides for you",
    "Proof of everything — every click, every lead source, every conversion",
    "A planning hub for the bride: guest list, seating chart, her own wedding website",
    "Our own native mobile apps",
  ];
  return (
    <Editorial>
      <Reveal>
        <Eyebrow>They Have a Tactic. We Have a Platform.</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-4 mx-auto max-w-[860px] text-[46px] leading-[1.06] text-brand-ink`}>
          A Complete Platform to Run Your <Gold>Entire Venue.</Gold>
        </h1>
      </Reveal>
      <div className="mx-auto mt-9 grid w-full max-w-[960px] grid-cols-2 gap-x-8 gap-y-3 text-left">
        {features.map((f, i) => (
          <Reveal key={i} delay={0.24 + i * 0.07}>
            <div className="flex items-start gap-3 rounded-xl border border-brand-line bg-white px-5 py-4">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-gold" />
              <span className="text-[14px] leading-snug text-brand-ink">{f}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.75}>
        <p className="mx-auto mt-8 max-w-[720px] text-[15px] text-brand-muted">
          Everyone else rents the same generic software.{" "}
          <span className="font-semibold text-brand-ink">
            We built our own — for wedding venues, by wedding venue people.
          </span>
        </p>
      </Reveal>
    </Editorial>
  );
}

// 13 · GUARANTEE
function SlideGuarantee() {
  return (
    <Frame photo="/vsl/photo-13.jpg" alt="A bride celebrating with her bridesmaids" side="right">
      <Reveal>
        <Eyebrow>Our Guarantee</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-5 text-[46px] leading-[1.04] text-brand-ink`}>
          Try It Free for 30 Days. <Gold>Results Guaranteed</Gold> — or You Don&apos;t
          Pay.
        </h1>
      </Reveal>
      <div className="mt-7 max-w-[460px]">
        <Point delay={0.24}>Your whole system built and live in as little as 7–10 business days.</Point>
        <Point delay={0.34}>No contracts. No cancellation fees.</Point>
        <Point delay={0.44}>
          It pays for itself in as little as 1 or 2 booked weddings for the year.
        </Point>
      </div>
    </Frame>
  );
}

// 14 · CLOSE + CTA
function SlideCTA() {
  return (
    <Frame photo="/vsl/photo-11.jpg" alt="A fully booked venue celebration" side="left">
      <Reveal>
        <Wordmark className="h-7 w-auto" />
      </Reveal>
      <Reveal delay={0.1}>
        <GoldRule className="mt-6" />
      </Reveal>
      <Reveal delay={0.18}>
        <h1 className={`${Playfair} mt-6 text-[48px] leading-[1.05] text-brand-ink`}>
          Break the Cycle and Keep Your Calendar <Gold>Fully Booked.</Gold>
        </h1>
      </Reveal>
      <Reveal delay={0.3}>
        <p className="mt-6 max-w-[450px] text-[17px] leading-relaxed text-brand-muted">
          See if your venue qualifies. If it&apos;s a fit, we&apos;ll build your
          custom plan together on a free strategy call.
        </p>
      </Reveal>
      <Reveal delay={0.42}>
        <a
          href="/strategy-call"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          See If Your Venue Qualifies
          <ArrowRight className="h-4 w-4" />
        </a>
      </Reveal>
    </Frame>
  );
}

/* ----------------------------------------------------------------------- */

export interface SlideDef {
  id: string;
  title: string;
  node: ReactNode;
}

export const SLIDES: SlideDef[] = [
  { id: "hook", title: "Stuck Repeating the Same Year?", node: <SlideHook /> },
  { id: "turn", title: "It's None of Those Things", node: <SlideTurn /> },
  { id: "couple", title: "It's the Couple", node: <SlideCouple /> },
  { id: "told", title: "Everything You Were Told", node: <SlideTold /> },
  { id: "directories", title: "Directories", node: <SlideDirectories /> },
  { id: "agencies", title: "Agencies", node: <SlideAgencies /> },
  { id: "social", title: "Social Media", node: <SlideSocial /> },
  { id: "proof", title: "Real Bookings", node: <SlideProof /> },
  { id: "jason", title: "Meet Jason", node: <SlideJason /> },
  { id: "urgency", title: "Right Now", node: <SlideUrgency /> },
  { id: "system", title: "The 6-Stage System", node: <SlideSystem /> },
  { id: "platform", title: "A Platform, Not a Tactic", node: <SlidePlatform /> },
  { id: "guarantee", title: "The Guarantee", node: <SlideGuarantee /> },
  { id: "cta", title: "See If Your Venue Qualifies", node: <SlideCTA /> },
];

/** All slide imagery, for eager preloading so navigation is instant. */
export const SLIDE_IMAGES: string[] = [
  "/vsl/photo-01.jpg",
  "/vsl/photo-08.jpg",
  "/vsl/photo-09.jpg",
  "/vsl/photo-05.jpg",
  "/vsl/photo-03.jpg",
  "/vsl/photo-04.jpg",
  "/vsl/photo-11.jpg",
  "/vsl/photo-06.jpg",
  "/vsl/photo-14.jpg",
  "/vsl/photo-13.jpg",
];
