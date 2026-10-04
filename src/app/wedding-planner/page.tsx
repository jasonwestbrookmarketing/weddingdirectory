import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowDown,
  CalendarHeart,
  Check,
  ChevronDown,
  ClipboardList,
  Globe,
  HeartHandshake,
  ListChecks,
  Lock,
  MailQuestion,
  PiggyBank,
  Sparkles,
  StickyNote,
  Users,
  Wallet,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-static";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";
const SIGNUP_HREF = `${STORYPAY_URL}/signup?as=couple&utm_source=directory&utm_campaign=wedding-planner`;
const OG_IMAGE = "/og-wedding-planner.jpg";

export const metadata: Metadata = {
  metadataBase: new URL("https://storyvenue.com"),
  title: "Free Wedding Planner — Budget, Guest List, Seating & Website | StoryVenue",
  description:
    "Plan your whole wedding from one place, free: budget tracker, guest list with RSVPs, seating chart, checklist, timeline, vendors, and a free wedding website. No credit card, no vendor spam.",
  alternates: { canonical: "/wedding-planner" },
  openGraph: {
    title: "Plan your whole wedding from one beautiful place, free",
    description:
      "Budget, guest list, RSVPs, seating chart, checklist, timeline, vendors, and a free wedding website. Everything in one tab instead of eleven.",
    url: "/wedding-planner",
    siteName: "StoryVenue",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "The StoryVenue Wedding Planner" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The free StoryVenue Wedding Planner",
    description:
      "Budget, guest list, RSVPs, seating, checklist, timeline and a free wedding website, all in one place.",
    images: [OG_IMAGE],
  },
};

/* -------------------------------------------------------------------- */
/*  Copy                                                                  */
/* -------------------------------------------------------------------- */

const PAINS: Array<{ icon: React.ComponentType<{ className?: string }>; text: string }> = [
  { icon: ClipboardList, text: "The guest list lives in a spreadsheet. Well, three versions of a spreadsheet." },
  { icon: MailQuestion, text: "RSVPs arrive by text, DM, email, and through your mom." },
  { icon: Wallet, text: "The budget is a note on your phone that stopped being true in March." },
  { icon: StickyNote, text: "The seating chart is sticky notes on a poster board that the cat found." },
  { icon: Users, text: "Vendor quotes are buried in screenshots, inboxes and one napkin." },
  { icon: Sparkles, text: "And the “free” planning apps? Vendor ads the second you sign up." },
];

const STEPS: Array<{ n: string; title: string; text: string }> = [
  { n: "1", title: "Create your free planner", text: "Two minutes. An email and a password. No credit card, and no “pick a plan.”" },
  { n: "2", title: "Put in the big three", text: "Your date, your people, your number. That’s the skeleton of every wedding plan." },
  { n: "3", title: "Plan from one hub", text: "RSVPs land on the guest list. The guest list fills the seating chart. The checklist knows what’s next. Nothing to reconcile, ever." },
];

const FEATURES: Array<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  points: string[];
  img: { src: string; width: number; height: number; alt: string };
  phone?: boolean;
}> = [
  {
    icon: CalendarHeart,
    title: "One hub for the whole wedding",
    text: "Open one page and know exactly where everything stands: the countdown, RSVPs in, budget spent, to-dos done, and what to do next.",
    points: ["Your next steps, in order", "Every number at a glance", "Your cover photo themes it all"],
    img: { src: "/wedding-planner/hub-laptop.webp", width: 1800, height: 1119, alt: "The Wedding Planner hub with countdown, RSVPs, budget and next steps" },
  },
  {
    icon: PiggyBank,
    title: "A budget that tells the truth",
    text: "Target, estimated, actually spent, and what’s left, per category, marked paid as you go. No formulas to break.",
    points: ["14 wedding categories built in", "Paid vs. still-owed at a glance", "Private to you. Even your venue can’t see it"],
    img: { src: "/wedding-planner/budget-phone.webp", width: 760, height: 1451, alt: "The wedding budget on a phone" },
    phone: true,
  },
  {
    icon: Users,
    title: "Guest list & RSVPs that run themselves",
    text: "Track households, not rows: parties, groups, meals and replies in one list. RSVPs from your wedding website land here on their own.",
    points: ["Invites, meals & replies per party", "“Who hasn’t answered?” in one glance", "17 yes · 2 no · 3 waiting, always current"],
    img: { src: "/wedding-planner/guests-desktop.webp", width: 1700, height: 1163, alt: "The guest list with RSVP tracking" },
  },
  {
    icon: HeartHandshake,
    title: "A seating chart without scissors",
    text: "Add tables, drop in each party, and watch seats fill by party size. When it’s done, your venue can see the layout for day-of setup.",
    points: ["Seats count themselves", "Deleting a table un-seats guests, never deletes them", "Room layout view included"],
    img: { src: "/wedding-planner/seating-desktop.webp", width: 1700, height: 1163, alt: "The seating chart with tables and seated guests" },
  },
  {
    icon: ListChecks,
    title: "The checklist & day-of timeline",
    text: "Every task with a due date, from “book the venue” to “final guest count.” Then a minute-by-minute timeline for the day itself.",
    points: ["Know what’s next without thinking", "Hair & makeup to sparkler send-off", "Share the timeline with anyone who asks"],
    img: { src: "/wedding-planner/checklist-phone.webp", width: 760, height: 1451, alt: "The wedding checklist on a phone" },
    phone: true,
  },
  {
    icon: Globe,
    title: "A free wedding website",
    text: "Your story, your photos, your details, with built-in RSVP, an optional password, and a guestbook your people will actually sign.",
    points: ["RSVPs flow straight into your guest list", "Password-protect it if you like", "Your planner’s cover photo is the website’s cover"],
    img: { src: "/wedding-planner/hub-phone.webp", width: 760, height: 1451, alt: "The Wedding Planner on a phone" },
    phone: true,
  },
];

const GUARANTEES: string[] = [
  "No credit card. Not now, not later, not for the planner.",
  "No vendor spam. Your guest list is nobody’s mailing list.",
  "Private by default. Your budget is visible to exactly one couple: you.",
  "Yours with any venue, or before you’ve picked one at all.",
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is it really free?",
    a: "Yes. Wedding venues pay StoryVenue for their booking software; that’s the business. The Wedding Planner is the couple’s side of the platform, and it’s free for couples. No trial clock, no credit card, no locked “pro” version of your own wedding.",
  },
  {
    q: "Does my venue need to be on StoryVenue?",
    a: "No. The planner works with any venue, or before you’ve chosen one. If your venue does happen to run on StoryVenue, it gets better: your messages and payments to them appear right inside your planner too.",
  },
  {
    q: "Can my partner and my mom help plan?",
    a: "Yes. Invite collaborators to plan with you. They can see and help with the plan, while your budget stays visible to you alone.",
  },
  {
    q: "Is a wedding website included?",
    a: "Yes, free: your story, photos, details and a built-in RSVP form that feeds your guest list automatically. Add a password to keep it just for invited guests, and a guestbook for the notes you’ll keep forever.",
  },
  {
    q: "What happens to my guests’ information?",
    a: "It stays yours. We don’t sell it, we don’t hand it to vendors, and nobody markets to your guest list. The planner is private by default.",
  },
  {
    q: "We already started in spreadsheets. Is switching painful?",
    a: "Put in the big three (date, guest list, budget) and you’re moved in. Most couples do it in an evening with a show on in the background, and never open the spreadsheet again.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/* -------------------------------------------------------------------- */
/*  Small pieces                                                          */
/* -------------------------------------------------------------------- */

function CTAButton({ dark = false, children }: { dark?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={SIGNUP_HREF}
      className={
        dark
          ? "inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[#1b1b1b] shadow-sm transition hover:bg-stone-100"
          : "inline-flex items-center gap-2 rounded-full bg-[#1b1b1b] px-8 py-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-black"
      }
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function Reassurance({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`text-[13px] tracking-wide ${dark ? "text-stone-400" : "text-stone-500"}`}>
      Free forever &middot; No credit card &middot; Set up in 2 minutes
    </p>
  );
}

/** Main headings: EditorsNote Light, like the rest of the site's heroes. */
const editors = { fontFamily: "EditorsNote, serif", fontWeight: 300 } as const;

/* -------------------------------------------------------------------- */
/*  Page                                                                  */
/* -------------------------------------------------------------------- */

export default function WeddingPlannerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/storyvenue-dark-logo.png" alt="StoryVenue" width={150} height={28} className="h-6 w-auto" />
            <span className="hidden rounded-full bg-[#1b1b1b] px-2.5 py-1 text-[11px] font-semibold text-white sm:inline">
              Wedding Planner
            </span>
          </Link>
          <a
            href={SIGNUP_HREF}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1b1b1b] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-black"
          >
            Start planning free
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main className="bg-white text-[#1b1b1b]">
        {/* ============================================================ */}
        {/* PROMISE — hero                                                */}
        {/* ============================================================ */}
        <section className="overflow-hidden bg-stone-50">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:px-6 lg:pt-24">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8a7448]">
              The free StoryVenue Wedding Planner
            </p>
            <h1
              style={editors}
              className="mx-auto mt-4 max-w-3xl text-balance text-[2.75rem] leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Plan your whole wedding from <em className="italic">one beautiful place</em>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-stone-600">
              Budget, guest list, RSVPs, seating chart, checklist, timeline, vendors, and a free
              wedding website. Everything that lives in eleven tabs right now, in one tab
              by&nbsp;tonight.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <CTAButton>Start planning free</CTAButton>
              <Reassurance />
              <a href="#features" className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-800">
                See everything you get <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* the product, exactly as couples see it */}
          <div className="relative mx-auto max-w-6xl px-4 pb-4 sm:px-6">
            <div className="relative">
              <Image
                src="/wedding-planner/hub-laptop.webp"
                alt="The Wedding Planner hub: Emma & Ryan's countdown, RSVPs, budget and next steps"
                width={1800}
                height={1119}
                priority
                className="mx-auto w-full max-w-4xl"
              />
              <Image
                src="/wedding-planner/budget-phone.webp"
                alt="The wedding budget on a phone"
                width={760}
                height={1451}
                priority
                className="absolute -bottom-6 right-0 hidden w-44 md:block lg:right-6 lg:w-52"
              />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PAIN                                                          */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 style={editors} className="mx-auto max-w-2xl text-balance text-center text-4xl tracking-tight sm:text-5xl">
            Sound <em className="italic">familiar?</em>
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PAINS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-5">
                <span className="mt-0.5 rounded-full bg-stone-100 p-2">
                  <Icon className="h-4 w-4 text-stone-600" />
                </span>
                <p className="text-pretty text-[15px] leading-relaxed text-stone-700">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* AGITATE                                                       */}
        {/* ============================================================ */}
        <section className="bg-[#1b1b1b] py-20 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#d4c4ad]">
              The real problem isn&rsquo;t the wedding
            </p>
            <h2 style={editors} className="mt-4 text-balance text-4xl leading-snug tracking-tight sm:text-5xl">
              None of it is hard on its own.{" "}
              <em className="italic text-[#d4c4ad]">It&rsquo;s hard because it&rsquo;s scattered.</em>
            </h2>
            <div className="mt-7 space-y-5 text-left text-[17px] leading-relaxed text-stone-300 sm:text-center">
              <p className="text-pretty">
                Scattered is how a deposit gets paid twice. How the photographer you loved gets booked
                by another couple while you hunt for her quote in three inboxes. How Aunt Dana ends up
                with no seat and the caterer with the wrong&nbsp;count.
              </p>
              <p className="text-pretty">
                Scattered is planning the happiest day of your life with the back of your mind
                permanently whispering, <em style={editors} className="italic text-stone-200">you&rsquo;re forgetting something.</em>
              </p>
              <p className="text-pretty font-medium text-white">
                You didn&rsquo;t get engaged to run a logistics operation out of six apps. There&rsquo;s a
                simpler way to do&nbsp;this.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SOLUTION — the plan                                           */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 style={editors} className="text-balance text-4xl tracking-tight sm:text-5xl">
              One home for the whole plan. <em className="italic">Here&rsquo;s how it works:</em>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-stone-200 bg-stone-50 p-7">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b1b1b] text-sm font-semibold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-pretty text-[15px] leading-relaxed text-stone-600">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-pretty text-center text-[15px] leading-relaxed text-stone-500">
            Built by StoryVenue, the platform wedding venues run their bookings on. We built the
            venue side. This is the couple side, and it&rsquo;s yours&nbsp;free.
          </p>
        </section>

        {/* ============================================================ */}
        {/* FEATURES                                                      */}
        {/* ============================================================ */}
        <section id="features" className="bg-stone-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8a7448]">
                Everything you get, free
              </p>
              <h2 style={editors} className="mt-3 text-balance text-4xl tracking-tight sm:text-5xl">
                Six tools. <em className="italic">One plan.</em>
              </h2>
            </div>

            <div className="mt-14 space-y-16">
              {FEATURES.map(({ icon: Icon, title, text, points, img, phone }, i) => (
                <div
                  key={title}
                  className={`flex flex-col items-center gap-8 lg:gap-14 ${i % 2 ? "lg:flex-row-reverse" : "lg:flex-row"}`}
                >
                  <div className="w-full lg:w-1/2">
                    <span className="inline-flex rounded-full bg-white p-2.5 shadow-sm ring-1 ring-stone-200">
                      <Icon className="h-5 w-5 text-[#8a7448]" />
                    </span>
                    <h3 style={editors} className="mt-4 text-balance text-3xl tracking-tight">
                      {title}
                    </h3>
                    <p className="mt-3 text-pretty text-[16px] leading-relaxed text-stone-600">{text}</p>
                    <ul className="mt-5 space-y-2.5">
                      {points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-pretty text-[15px] text-stone-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`w-full lg:w-1/2 ${phone ? "flex justify-center" : ""}`}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      className={phone ? "w-56 sm:w-64" : "w-full"}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-14 flex max-w-xl items-center justify-center gap-2.5 rounded-full border border-stone-200 bg-white px-6 py-3.5 text-center text-[14px] text-stone-600">
              <Users className="h-4 w-4 shrink-0 text-[#8a7448]" />
              Plan it together. Invite your partner or your mom; your budget stays yours&nbsp;alone.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* GUARANTEE                                                     */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-12">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 p-2.5">
                <Lock className="h-5 w-5 text-emerald-700" />
              </span>
              <h2 style={editors} className="text-3xl tracking-tight sm:text-4xl">
                Free. <em className="italic">Actually free.</em>
              </h2>
            </div>
            <p className="mt-4 text-pretty text-[16px] leading-relaxed text-stone-600">
              Here&rsquo;s the whole deal, in plain words: venues pay StoryVenue for their booking
              software. That&rsquo;s the business. The Wedding Planner is how we make their couples&rsquo;
              lives easier, so for couples it&rsquo;s simply&nbsp;free.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {GUARANTEES.map((g) => (
                <li key={g} className="flex items-start gap-2.5 text-pretty text-[15px] leading-relaxed text-stone-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {g}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-3">
              <CTAButton>Start planning free</CTAButton>
              <Reassurance />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FAQ                                                           */}
        {/* ============================================================ */}
        <section className="bg-stone-50 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 style={editors} className="text-balance text-center text-4xl tracking-tight sm:text-5xl">
              Questions, <em className="italic">answered.</em>
            </h2>
            <div className="mt-10 space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-stone-200 bg-white px-6 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium">
                    {f.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-stone-400 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-pretty text-[15px] leading-relaxed text-stone-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CTA                                                           */}
        {/* ============================================================ */}
        <section className="bg-[#1b1b1b] py-24 text-center text-white">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 style={editors} className="text-balance text-4xl leading-tight tracking-tight sm:text-6xl">
              Your wedding, <em className="italic text-[#d4c4ad]">organized by tonight.</em>
            </h2>
            <p className="mt-5 text-pretty text-[17px] leading-relaxed text-stone-300">
              Two minutes to start, on your laptop or your phone. And the next time someone asks
              &ldquo;how&rsquo;s planning going?&rdquo; you&rsquo;ll just&nbsp;smile.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <CTAButton dark>Start planning free</CTAButton>
              <Reassurance dark />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
