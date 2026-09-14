"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  Clock,
  Check,
  Search,
  Users,
  Smartphone,
  Zap,
  Heart,
  Send,
  MessageSquare,
  FileSignature,
  Gem,
  Calendar,
  X,
  Star,
  Utensils,
  Wine,
  Inbox,
  BadgeCheck,
  Sparkles,
  Building2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

const EASE = [0.22, 1, 0.36, 1] as const;

/* ----------------------------------------------------------------------- */
/* Shared primitives                                                       */
/* ----------------------------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  y = 16,
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
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({
  children,
  gold = false,
  className = "",
}: {
  children: ReactNode;
  gold?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-[12px] font-semibold uppercase tracking-[0.28em] ${
        gold ? "text-brand-gold" : "text-brand-muted"
      } ${className}`}
    >
      {children}
    </p>
  );
}

function GoldRule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-16 bg-brand-gold ${className}`} />;
}

const Playfair = "font-[family-name:var(--font-playfair)]";

function Wordmark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/storyvenue-dark-logo.png"
      alt="StoryVenue"
      width={3000}
      height={751}
      priority
      className={className}
    />
  );
}

function PhotoPanel({
  src,
  alt,
  width = "46%",
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  width?: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="relative h-full shrink-0" style={{ width }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="600px"
        className="object-cover"
      />
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-brand-warm to-transparent" />
      {children}
    </div>
  );
}

function SplitSlide({
  photo,
  alt,
  photoWidth = "46%",
  priority = false,
  children,
}: {
  photo: string;
  alt: string;
  photoWidth?: string;
  priority?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full w-full bg-brand-warm">
      <div
        className="flex h-full flex-col justify-center px-16"
        style={{ width: `calc(100% - ${photoWidth})` }}
      >
        {children}
      </div>
      <PhotoPanel src={photo} alt={alt} width={photoWidth} priority={priority} />
    </div>
  );
}

function BulletRow({
  icon: Icon,
  children,
  divider = true,
  delay = 0,
}: {
  icon: IconType;
  children: ReactNode;
  divider?: boolean;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        className={`flex items-center gap-4 py-2.5 ${
          divider ? "border-b border-brand-line" : ""
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 text-brand-gold">
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
        </span>
        <span className="text-[17px] leading-snug text-brand-ink">{children}</span>
      </div>
    </Reveal>
  );
}

function StatRow({
  items,
  delay = 0.5,
}: {
  items: { big: string; small: string }[];
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex divide-x divide-brand-line">
        {items.map((s, i) => (
          <div key={i} className="px-6 first:pl-0">
            <p className={`${Playfair} text-[26px] leading-none text-brand-ink`}>
              {s.big}
            </p>
            <p className="mt-1.5 max-w-[130px] text-[11px] leading-tight text-brand-muted">
              {s.small}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

const Gold = ({ children }: { children: ReactNode }) => (
  <span className="text-brand-gold">{children}</span>
);

/* ----------------------------------------------------------------------- */
/* Slides                                                                   */
/* ----------------------------------------------------------------------- */

// 1 — Cover / Hook
function SlideCover() {
  return (
    <SplitSlide photo="/vsl/photo-01.jpg" alt="Wedding venue at golden hour" priority>
      <Reveal>
        <Wordmark className="h-9 w-auto" />
      </Reveal>
      <Reveal delay={0.1}>
        <GoldRule className="mt-6" />
      </Reveal>
      <Reveal delay={0.18}>
        <Eyebrow className="mt-6">The Bride Booking System™ for Wedding Venues</Eyebrow>
      </Reveal>
      <Reveal delay={0.26}>
        <h1 className={`${Playfair} mt-6 text-[56px] leading-[1.04] text-brand-ink`}>
          Fully Book Your Wedding Venue Without Empty Weekends.
        </h1>
      </Reveal>
      <Reveal delay={0.36}>
        <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-brand-muted">
          The one connected system helping wedding venues find more brides, host
          more tours, and book more weddings.
        </p>
      </Reveal>
      <div className="mt-9">
        <StatRow
          delay={0.5}
          items={[
            { big: "14+", small: "Years in the wedding-venue industry" },
            { big: "500+", small: "Venues served nationwide" },
            { big: "Millions", small: "In booked weddings generated" },
          ]}
        />
      </div>
    </SplitSlide>
  );
}

// 2 — The Trap
function SlideTrap() {
  return (
    <SplitSlide photo="/vsl/photo-02.jpg" alt="Quiet venue office at dusk">
      <Reveal>
        <h1 className={`${Playfair} text-[64px] leading-[1] text-brand-ink`}>
          Another Year. The Same Result.
        </h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-4 text-[18px] text-brand-muted">
          Working harder than ever — with nothing to show for it.
        </p>
      </Reveal>
      <div className="mt-8 max-w-[520px]">
        <BulletRow icon={Clock} delay={0.22}>
          The same half-empty calendar
        </BulletRow>
        <BulletRow icon={Clock} delay={0.32}>
          The same number of bookings
        </BulletRow>
        <BulletRow icon={Clock} delay={0.42}>
          Waiting for brides to find you
        </BulletRow>
        <BulletRow icon={Clock} delay={0.52} divider={false}>
          Waiting for the phone to ring
        </BulletRow>
      </div>
      <Reveal delay={0.64}>
        <p className={`${Playfair} mt-7 text-[22px] italic text-brand-ink`}>
          That&apos;s not a system. That&apos;s waiting.
        </p>
      </Reveal>
    </SplitSlide>
  );
}

// 3 — What changed: Found vs Chosen
function SlideFoundChosen() {
  return (
    <SplitSlide photo="/vsl/photo-03.jpg" alt="Couple at their wedding ceremony">
      <Reveal>
        <h1 className={`${Playfair} text-[58px] leading-[1.05] text-brand-ink`}>
          Being <Gold>Found</Gold> and Being <Gold>Chosen</Gold> are two different
          things.
        </h1>
      </Reveal>
      <Reveal delay={0.18}>
        <p className="mt-6 text-[19px] text-brand-ink">
          Visibility gets you seen. A system gets you <Gold>selected.</Gold>
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <GoldRule className="mt-7" />
      </Reveal>
      <Reveal delay={0.4}>
        <p className="mt-6 max-w-[500px] text-[17px] leading-relaxed text-brand-muted">
          It isn&apos;t the market — it&apos;s the couple. She books the venue that
          answers first and makes it easy, not the &ldquo;best&rdquo; one.
        </p>
      </Reveal>
    </SplitSlide>
  );
}

// 4 — Everything you were told would work
function SlideTold() {
  const cards: { icon: IconType; title: string; line: string }[] = [
    { icon: Search, title: "Directories", line: "Get you seen — never chosen." },
    { icon: Building2, title: "Agencies", line: "Sell a tactic, not a transformation." },
    { icon: Smartphone, title: "Social Media", line: "Preaches only to who already follows you." },
  ];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-brand-warm px-16 text-center">
      <Reveal>
        <Eyebrow gold>Why It Isn&apos;t Working</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-5 max-w-[900px] text-[54px] leading-[1.06] text-brand-ink`}>
          Everything You Were Told Would Work… <Gold>Doesn&apos;t.</Gold>
        </h1>
      </Reveal>
      <div className="mt-12 grid w-full max-w-[960px] grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={0.28 + i * 0.12}>
            <div className="flex h-full flex-col items-center rounded-2xl border border-brand-line bg-white px-6 py-8 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/45 text-brand-gold">
                <c.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className={`${Playfair} mt-5 text-[24px] text-brand-ink`}>{c.title}</p>
              <p className="mt-2 text-[15px] leading-snug text-brand-muted">{c.line}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// 5 — Directories teardown (comparison)
function MockListingRow() {
  return (
    <div className="flex items-center gap-3 border-b border-brand-line/70 py-2 last:border-0">
      <div className="h-8 w-10 rounded bg-brand-line" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2 w-3/4 rounded bg-brand-line" />
        <div className="h-2 w-1/2 rounded bg-brand-line/70" />
      </div>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((s) => (
          <Star key={s} className="h-3 w-3 fill-brand-cream text-brand-cream" />
        ))}
      </div>
    </div>
  );
}

function CompareStep({
  icon: Icon,
  children,
  tone,
}: {
  icon: IconType;
  children: ReactNode;
  tone: "muted" | "gold";
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
          tone === "gold"
            ? "border-brand-gold/50 text-brand-gold"
            : "border-brand-line text-brand-muted"
        }`}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      <span className="text-[13px] text-brand-ink">{children}</span>
    </div>
  );
}

function SlideDirectories() {
  return (
    <div className="flex h-full w-full items-center bg-brand-warm px-16">
      <div className="w-[38%] pr-8">
        <Reveal>
          <Eyebrow gold>Mistake #1 · The Directory Trap</Eyebrow>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 className={`${Playfair} mt-5 text-[46px] leading-[1.05] text-brand-ink`}>
            A Directory Gets You <Gold>Seen.</Gold> Not <Gold>Chosen.</Gold>
          </h1>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-5 text-[15px] leading-relaxed text-brand-muted">
            It was built for the bride — you just pay to be listed beside ten
            competitors.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-1 items-center justify-center gap-4">
        {/* Directory card */}
        <Reveal delay={0.3} className="w-[290px]">
          <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]">
            <p className={`${Playfair} text-[18px] text-brand-ink`}>Wedding Directory</p>
            <div className="mt-3">
              <MockListingRow />
              <MockListingRow />
              <MockListingRow />
              <MockListingRow />
            </div>
            <div className="mt-4 space-y-2.5">
              <CompareStep icon={Search} tone="muted">
                Helps her find venues
              </CompareStep>
              <CompareStep icon={Users} tone="muted">
                Hands her to 10 venues
              </CompareStep>
              <CompareStep icon={X} tone="muted">
                Its job ends at the click
              </CompareStep>
            </div>
          </div>
        </Reveal>

        {/* VS */}
        <Reveal delay={0.44}>
          <span className={`${Playfair} flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold text-[13px] font-bold text-white`}>
            VS
          </span>
        </Reveal>

        {/* Bride Booking System card */}
        <Reveal delay={0.56} className="w-[290px]">
          <div className="rounded-2xl border border-brand-ink/15 bg-brand-ink p-5 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)]">
            <p className={`${Playfair} text-[18px]`}>Bride Booking System™</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-cream/40 text-brand-cream">
                  <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                <span className="text-[13px]">Sends her only to you</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-cream/40 text-brand-cream">
                  <Zap className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                <span className="text-[13px]">Helps her choose you</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-cream/40 text-brand-cream">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                <span className="text-[13px]">Its job starts at the click</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-gold py-2.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-white">
              <Heart className="h-3.5 w-3.5 fill-white" /> Booked Wedding
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// 6 — Agencies teardown
function SlideAgencies() {
  return (
    <SplitSlide photo="/vsl/photo-08.jpg" alt="Frustrated venue owner at a laptop">
      <Reveal>
        <Eyebrow gold>Mistake #2 · The Agency Trap</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-5 text-[52px] leading-[1.05] text-brand-ink`}>
          Most Agencies Have Never <Gold>Booked a Wedding.</Gold>
        </h1>
      </Reveal>
      <div className="mt-8 max-w-[520px]">
        <BulletRow icon={X} delay={0.24}>
          They sell a tactic — never a transformation
        </BulletRow>
        <BulletRow icon={X} delay={0.34}>
          The same generic software every agency resells
        </BulletRow>
        <BulletRow icon={X} delay={0.44}>
          Big promises, then impossible to reach
        </BulletRow>
        <BulletRow icon={X} delay={0.54} divider={false}>
          They don&apos;t know how a bride actually books
        </BulletRow>
      </div>
    </SplitSlide>
  );
}

// 7 — Social teardown
function SlideSocial() {
  return (
    <SplitSlide photo="/vsl/photo-09.jpg" alt="Bride scrolling on her phone">
      <Reveal>
        <Eyebrow gold>Mistake #3 · The Social Media Trap</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-5 text-[50px] leading-[1.05] text-brand-ink`}>
          You&apos;re Posting to People Who <Gold>Already Follow You.</Gold>
        </h1>
      </Reveal>
      <div className="mt-8 max-w-[520px]">
        <BulletRow icon={Smartphone} delay={0.24}>
          Only 1–2% ever see your posts
        </BulletRow>
        <BulletRow icon={Smartphone} delay={0.34}>
          They&apos;re not newly-engaged brides
        </BulletRow>
        <BulletRow icon={Smartphone} delay={0.44}>
          The brides still searching never find you
        </BulletRow>
        <BulletRow icon={Smartphone} delay={0.54} divider={false}>
          Effort in — no bookings out
        </BulletRow>
      </div>
    </SplitSlide>
  );
}

// 8 — Proof / Case studies
function SlideProof() {
  const cases: { venue: string; big: string; small: string }[] = [
    { venue: "Retreat at Evans Farms", big: "100+", small: "Inquiries a month from real brides" },
    { venue: "White Pine Manor", big: "8 · 3", small: "Tours & weddings in the last 30 days" },
    { venue: "Atlantic Stables", big: "+$10K", small: "In booked weddings, first month live" },
    { venue: "Magnolia Event Center", big: "48 hrs", small: "To their very first booked tour" },
  ];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-brand-warm px-16 text-center">
      <Reveal>
        <Eyebrow gold>Case Studies</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-4 text-[52px] leading-[1.05] text-brand-ink`}>
          Real Venues. Real Results.
        </h1>
      </Reveal>
      <div className="mt-11 grid w-full max-w-[1040px] grid-cols-4 gap-5">
        {cases.map((c, i) => (
          <Reveal key={c.venue} delay={0.26 + i * 0.1}>
            <div className="h-full rounded-2xl border border-brand-line border-t-[3px] border-t-brand-gold bg-white px-5 py-7 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
                {c.venue}
              </p>
              <p className={`${Playfair} mt-4 text-[40px] leading-none text-brand-ink`}>
                {c.big}
              </p>
              <p className="mt-3 text-[13px] leading-snug text-brand-muted">{c.small}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// 9 — Jason
function SlideJason() {
  return (
    <SplitSlide photo="/vsl/photo-06.jpg" alt="Jason Westbrook, founder of StoryVenue">
      <Reveal>
        <h1 className={`${Playfair} text-[52px] leading-[1.06] text-brand-ink`}>
          Hi, I&apos;m Jason Westbrook, Founder of <Gold>StoryVenue.</Gold>
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-6 max-w-[500px] text-[17px] leading-relaxed text-brand-muted">
          14 years in the wedding-venue industry, 500+ venues served. I know
          exactly why a bride chooses one venue and scrolls past another — and how
          to make sure she chooses yours.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <GoldRule className="mt-8" />
      </Reveal>
      <div className="mt-8">
        <StatRow
          delay={0.4}
          items={[
            { big: "14+", small: "Years in the industry" },
            { big: "500+", small: "Venues served" },
            { big: "Millions", small: "In booked weddings" },
          ]}
        />
      </div>
    </SplitSlide>
  );
}

// 10 — Urgency
function SlideUrgency() {
  return (
    <SplitSlide photo="/vsl/photo-11.jpg" alt="Couple celebrating with guests">
      <Reveal>
        <h1 className={`${Playfair} text-[56px] leading-[1.04] text-brand-ink`}>
          Right Now, Couples Are Searching in <Gold>Your Area.</Gold>
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-6 max-w-[500px] text-[19px] leading-relaxed text-brand-ink">
          The only question is whether they find you — or your competitor.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <GoldRule className="mt-8" />
      </Reveal>
      <Reveal delay={0.4}>
        <p className={`${Playfair} mt-7 max-w-[500px] text-[22px] italic leading-snug text-brand-ink`}>
          The venues booking more weddings are the ones who decided to change.
          Right now.
        </p>
      </Reveal>
    </SplitSlide>
  );
}

// 11 — The 6-Stage Bride Booking System
function SlideSystem() {
  const stages: { icon: IconType; title: string; sub: string }[] = [
    { icon: Gem, title: "Attract Ideal Brides", sub: "So you're seen first" },
    { icon: Zap, title: "Instant Response", sub: "So she never waits" },
    { icon: MessageSquare, title: "Real Conversations", sub: "So she trusts you early" },
    { icon: Heart, title: "Qualify Every Bride", sub: "Ready to book, not browse" },
    { icon: Send, title: "Handed To You", sub: "Warm and ready" },
    { icon: FileSignature, title: "Tour & Book", sub: "You host, you book" },
  ];
  return (
    <div className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-brand-warm px-14">
      <Image
        src="/vsl/photo-01.jpg"
        alt=""
        fill
        sizes="1280px"
        className="object-cover opacity-[0.10]"
      />
      <div className="relative">
        <Reveal className="text-center">
          <h1 className={`${Playfair} text-[46px] leading-none text-brand-ink`}>
            The <span className="italic">Bride</span> Booking System™
          </h1>
        </Reveal>
        <Reveal delay={0.1} className="text-center">
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.28em] text-brand-muted">
            One connected system, so no bride goes unanswered
          </p>
        </Reveal>

        <div className="mt-10 flex items-stretch justify-center gap-2">
          {stages.map((s, i) => (
            <div key={s.title} className="flex items-center">
              <Reveal delay={0.24 + i * 0.1}>
                <div className="relative flex h-[210px] w-[168px] flex-col items-center rounded-2xl border border-brand-line bg-white/95 px-4 pb-5 pt-7 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]">
                  <span className="absolute -top-3 flex h-7 w-7 items-center justify-center rounded-md bg-brand-ink text-[13px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/45 text-brand-gold">
                    <s.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <p className={`${Playfair} mt-4 text-center text-[17px] leading-tight text-brand-ink`}>
                    {s.title}
                  </p>
                  <p className="mt-2 text-center text-[12px] leading-snug text-brand-muted">
                    {s.sub}
                  </p>
                </div>
              </Reveal>
              {i < stages.length - 1 && (
                <Reveal delay={0.3 + i * 0.1}>
                  <ArrowRight className="mx-0.5 h-4 w-4 text-brand-gold/60" />
                </Reveal>
              )}
            </div>
          ))}
        </div>

        <Reveal delay={1.0}>
          <div className="mx-auto mt-8 grid w-full max-w-[1060px] grid-cols-6 gap-2">
            <div className="col-span-5 flex justify-center">
              <span className="rounded-full bg-brand-ink px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                StoryVenue Team
              </span>
            </div>
            <div className="col-span-1 flex justify-center">
              <span className="rounded-full bg-brand-gold px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                Venue Team
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// 12 — Platform / Differentiator
function SlidePlatform() {
  const features: { icon: IconType; label: string }[] = [
    { icon: Inbox, label: "Every lead in one inbox" },
    { icon: FileSignature, label: "Branded proposals she can sign & pay on" },
    { icon: Users, label: "Real venue concierges follow up for you" },
    { icon: BadgeCheck, label: "Full attribution — proof of every dollar" },
    { icon: Heart, label: "A planning hub built for the bride" },
    { icon: Smartphone, label: "Our own native mobile apps" },
  ];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-brand-warm px-16 text-center">
      <Reveal>
        <Eyebrow gold>The Difference</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-4 max-w-[880px] text-[50px] leading-[1.06] text-brand-ink`}>
          They Have a Tactic. We Have a <Gold>Platform.</Gold>
        </h1>
      </Reveal>
      <div className="mt-10 grid w-full max-w-[960px] grid-cols-3 gap-4">
        {features.map((f, i) => (
          <Reveal key={f.label} delay={0.24 + i * 0.08}>
            <div className="flex h-full items-center gap-3 rounded-2xl border border-brand-line bg-white px-5 py-5 text-left shadow-[0_16px_36px_-30px_rgba(0,0,0,0.5)]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 text-brand-gold">
                <f.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="text-[14px] leading-snug text-brand-ink">{f.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.8}>
        <p className="mt-9 flex items-center gap-2 text-[15px] text-brand-muted">
          <Sparkles className="h-4 w-4 text-brand-gold" />
          Everyone else rents the same generic software.{" "}
          <span className="font-semibold text-brand-ink">We built our own.</span>
        </p>
      </Reveal>
    </div>
  );
}

// 13 — Guarantee
function SlideGuarantee() {
  return (
    <SplitSlide photo="/vsl/photo-04.jpg" alt="Venue schedule book">
      <Reveal>
        <Eyebrow gold>Our Guarantee</Eyebrow>
      </Reveal>
      <Reveal delay={0.12}>
        <h1 className={`${Playfair} mt-5 text-[54px] leading-[1.04] text-brand-ink`}>
          Try It Free. <Gold>Results Guaranteed.</Gold>
        </h1>
      </Reveal>
      <div className="mt-8 max-w-[520px]">
        <BulletRow icon={ShieldCheck} delay={0.24}>
          30 days free, risk-free — or you don&apos;t pay
        </BulletRow>
        <BulletRow icon={Check} delay={0.34}>
          Built and live in as little as 7–10 business days
        </BulletRow>
        <BulletRow icon={Check} delay={0.44}>
          No contracts, no cancellation fees
        </BulletRow>
        <BulletRow icon={Check} delay={0.54} divider={false}>
          Pays for itself in 1–2 booked weddings
        </BulletRow>
      </div>
    </SplitSlide>
  );
}

// 14 — The ripple / close
function SlideClose() {
  const items: { icon: IconType; label: string }[] = [
    { icon: Users, label: "The next bride, sitting in her audience" },
    { icon: Utensils, label: "Catering revenue" },
    { icon: Wine, label: "Bar revenue" },
    { icon: Heart, label: "Vendor relationships" },
    { icon: Star, label: "Future referrals" },
  ];
  return (
    <SplitSlide photo="/vsl/photo-13.jpg" alt="Bride and bridesmaids celebrating">
      <Reveal>
        <h1 className={`${Playfair} text-[46px] leading-[1.06] text-brand-ink`}>
          Every Bride Who Doesn&apos;t Book Isn&apos;t Just One <Gold>Lost Wedding.</Gold>
        </h1>
      </Reveal>
      <Reveal delay={0.14}>
        <p className={`${Playfair} mt-4 text-[22px] italic text-brand-gold`}>
          She&apos;s also…
        </p>
      </Reveal>
      <div className="mt-5 max-w-[520px]">
        {items.map((it, i) => (
          <BulletRow
            key={it.label}
            icon={it.icon}
            delay={0.26 + i * 0.09}
            divider={i < items.length - 1}
          >
            {it.label}
          </BulletRow>
        ))}
      </div>
    </SplitSlide>
  );
}

// 15 — CTA
function SlideCTA() {
  return (
    <SplitSlide photo="/vsl/photo-14.jpg" alt="Wedding venue at sunset">
      <Reveal>
        <Wordmark className="h-8 w-auto" />
      </Reveal>
      <Reveal delay={0.1}>
        <GoldRule className="mt-6" />
      </Reveal>
      <Reveal delay={0.16}>
        <Eyebrow className="mt-6">The Bride Booking System™ for Wedding Venues</Eyebrow>
      </Reveal>
      <Reveal delay={0.24}>
        <h1 className={`${Playfair} mt-5 text-[52px] leading-[1.04] text-brand-ink`}>
          Book Your Free Venue Growth <Gold>Strategy Call.</Gold>
        </h1>
      </Reveal>
      <Reveal delay={0.34}>
        <p className="mt-5 text-[15px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
          In 30 minutes you&apos;ll discover:
        </p>
      </Reveal>
      <div className="mt-4 max-w-[500px]">
        <BulletRow icon={Check} delay={0.42} divider={false}>
          Where you&apos;re losing brides right now
        </BulletRow>
        <BulletRow icon={Check} delay={0.5} divider={false}>
          What&apos;s preventing more booked tours
        </BulletRow>
        <BulletRow icon={Check} delay={0.58} divider={false}>
          Your single biggest opportunity for growth
        </BulletRow>
      </div>
      <Reveal delay={0.7}>
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
    </SplitSlide>
  );
}

/* ----------------------------------------------------------------------- */

export interface SlideDef {
  id: string;
  title: string;
  node: ReactNode;
}

export const SLIDES: SlideDef[] = [
  { id: "cover", title: "Fully Book Your Venue", node: <SlideCover /> },
  { id: "trap", title: "The Trap", node: <SlideTrap /> },
  { id: "found-chosen", title: "Found vs Chosen", node: <SlideFoundChosen /> },
  { id: "told", title: "What You Were Told", node: <SlideTold /> },
  { id: "directories", title: "The Directory Trap", node: <SlideDirectories /> },
  { id: "agencies", title: "The Agency Trap", node: <SlideAgencies /> },
  { id: "social", title: "The Social Media Trap", node: <SlideSocial /> },
  { id: "proof", title: "Real Venues, Real Results", node: <SlideProof /> },
  { id: "jason", title: "Meet Jason", node: <SlideJason /> },
  { id: "urgency", title: "Right Now", node: <SlideUrgency /> },
  { id: "system", title: "The 6-Stage System", node: <SlideSystem /> },
  { id: "platform", title: "A Platform, Not a Tactic", node: <SlidePlatform /> },
  { id: "guarantee", title: "The Guarantee", node: <SlideGuarantee /> },
  { id: "close", title: "One Lost Wedding", node: <SlideClose /> },
  { id: "cta", title: "Book Your Strategy Call", node: <SlideCTA /> },
];
