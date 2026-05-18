import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Search,
  Inbox,
  Zap,
  CalendarCheck,
  FileSignature,
  BarChart3,
  AlertTriangle,
  Brain,
  CalendarX,
  Wallet,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-static";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

// Meta ads land here. We tag downstream of signup so the dashboard can
// attribute trials back to this page without analytics tooling here.
const TRIAL_HREF = `${STORYPAY_URL}/signup?as=venue&plan=trial&utm_source=meta&utm_medium=paid&utm_campaign=book-more-weddings`;
const LOGIN_HREF = `${STORYPAY_URL}/login?as=venue`;

export const metadata: Metadata = {
  title:
    "Book More Weddings — One Platform for Inquiries, Tours, Proposals & Payments | StoryVenue",
  description:
    "StoryVenue gives wedding venues one platform to capture leads, follow up faster, manage tours, send proposals, collect payments, and book more weddings. Start your 14-day free trial.",
  alternates: { canonical: "/book-more-weddings" },
  openGraph: {
    title: "Fully Book Your Wedding Venue Without Letting Leads Slip Away",
    description:
      "One platform for inquiries, follow-up, tours, proposals, and payments — built for wedding venues. 14-day free trial. No contract.",
    url: "/book-more-weddings",
    siteName: "StoryVenue",
    images: [{ url: "/hero-wedding.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book More Weddings with StoryVenue",
    description:
      "One platform for inquiries, follow-up, tours, proposals, and payments. 14-day free trial.",
    images: ["/hero-wedding.jpg"],
  },
};

const HERO_BULLETS = [
  "Get found by more couples.",
  "Manage every lead, tour, proposal, and payment in one place.",
  "Upgrade into managed ads and concierge follow-up when you are ready.",
] as const;

const PROOF_LOGOS = [
  "Manor",
  "Waterloo Farms",
  "Atlantic Stables",
  "Retreat at Evans Farms",
  "Red Barn Acres",
  "Irongate",
] as const;

const PROOF_RESULTS = [
  { venue: "Manor", result: "Booked 2026 dates in 90 days" },
  { venue: "Waterloo Farms", result: "Booked 2 weddings in 7 days" },
  { venue: "Atlantic Stables", result: "$15,000 booked in 30 days" },
  { venue: "Retreat at Evans Farms", result: "258 leads in 60 days" },
  { venue: "Red Barn Acres", result: "Booked 9 weddings in 4 months" },
  { venue: "Irongate Wedding Venue", result: "131 leads in 60 days" },
] as const;

const PAIN_POINTS = [
  {
    icon: AlertTriangle,
    title: "Leads get missed.",
    body: "Inquiries arrive from your site, IG, Google, The Knot, WeddingWire, email, and texts — and slip through the cracks.",
  },
  {
    icon: Brain,
    title: "Follow-up depends on memory.",
    body: "Your team has no system for who needs a reply, a tour reminder, or a nudge — so couples go cold.",
  },
  {
    icon: CalendarX,
    title: "Tours are hard to track.",
    body: "Holds, chats, appointments, and walk-throughs live in different calendars and inboxes.",
  },
  {
    icon: Wallet,
    title: "Payments and proposals are scattered.",
    body: "Proposals are PDFs, signatures are paper, payments are chased — and the close drags on.",
  },
] as const;

const OUTCOME_CARDS = [
  {
    icon: Search,
    title: "Get Found",
    body: "Create a venue listing couples can discover, review, and inquire from.",
    outcome: "More couples find your venue while they are actively searching.",
  },
  {
    icon: Inbox,
    title: "Capture Leads",
    body: "Use forms, landing pages, and inquiry tools to bring every lead into one system.",
    outcome: "No more scattered inquiries or lost contact details.",
  },
  {
    icon: Zap,
    title: "Follow Up Faster",
    body: "Use email, SMS, workflows, notifications, and AI re-engagement to keep leads moving.",
    outcome: "Fewer silent leads and more couples taking the next step.",
  },
  {
    icon: CalendarCheck,
    title: "Book More Tours",
    body: "Manage chats, tours, appointments, holds, and events from one organized calendar.",
    outcome: "More serious couples make it onto your schedule.",
  },
  {
    icon: FileSignature,
    title: "Close With Proposals",
    body: "Send branded proposals with e-signatures and online payments.",
    outcome: "Couples can say yes, sign, and pay without friction.",
  },
  {
    icon: BarChart3,
    title: "Run the Business",
    body: "Track revenue, payments, reports, conversations, team roles, reviews, and client details.",
    outcome: "Your venue feels organized, professional, and easier to manage.",
  },
] as const;

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "A couple discovers your venue",
    body: "Your listing, website, forms, ads, or landing pages capture the inquiry.",
  },
  {
    step: "02",
    title: "StoryVenue organizes the opportunity",
    body: "Every lead enters your CRM with contact details, wedding info, conversations, and pipeline stage.",
  },
  {
    step: "03",
    title: "Your system helps move them forward",
    body: "Follow-up, conversations, tours, proposals, signatures, and payments all happen in one place.",
  },
  {
    step: "04",
    title: "You upgrade when you want more growth",
    body: "Add managed Meta ads or concierge follow-up when you are ready to scale.",
  },
] as const;

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    tagline: "Get listed. Get paid.",
    body: "Professional listing, online proposals, and built-in payments.",
    features: [
      "Public venue listing",
      "Online proposals",
      "Built-in payments",
    ],
    highlight: false,
    cta: "Start Free",
  },
  {
    name: "Venue Pro",
    price: "$299",
    period: "/mo",
    tagline: "Run your venue like a business.",
    body: "The full SaaS platform for venues that want to book more weddings.",
    features: [
      "CRM, pipeline, and inbox",
      "Calendar, tours, and holds",
      "Proposals, contracts, payments",
      "Workflows, automations, AI follow-up",
      "Reports, reviews, team roles",
    ],
    highlight: true,
    badge: "Most Popular",
    cta: "Start My 14-Day Free Trial",
  },
  {
    name: "Booking System",
    price: "Custom",
    period: "",
    tagline: "Add managed Meta ads.",
    body: "Venue Pro plus done-for-you ads to fill your pipeline.",
    features: [
      "Everything in Venue Pro",
      "Managed Meta ad campaigns",
      "Creative + targeting + reporting",
    ],
    highlight: false,
    cta: "Talk to Sales",
  },
  {
    name: "All-Inclusive",
    price: "Custom",
    period: "",
    tagline: "Add concierge follow-up.",
    body: "We bring in and work the leads alongside your team.",
    features: [
      "Everything in Booking System",
      "Concierge lead follow-up",
      "Booked tours, not just leads",
    ],
    highlight: false,
    cta: "Talk to Sales",
  },
] as const;

const METRICS = [
  {
    value: "14",
    suffix: "-day",
    label: "Free trial",
    note: "No contract. No down payment.",
  },
  {
    value: "1",
    suffix: "",
    label: "Platform",
    note: "Inquiries → tours → proposals → payments.",
  },
  {
    value: "258",
    suffix: "",
    label: "Leads in 60 days",
    note: "Real result from Retreat at Evans Farms.",
  },
  {
    value: "9",
    suffix: "",
    label: "Weddings booked",
    note: "Real result from Red Barn Acres, 4 months.",
  },
] as const;

function PrimaryCTA({
  label = "Start My 14-Day Free Trial",
  size = "lg",
  className = "",
}: {
  label?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm";
  return (
    <a
      href={TRIAL_HREF}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)] ${sizing} ${className}`}
      style={{ fontFamily: "var(--font-open-sans)" }}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export default function BookMoreWeddingsPage() {
  return (
    <>
      {/* ============================================================== */}
      {/*  NAV — clean white, anchor links centered, primary CTA right     */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/70">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
          <Link href="/" aria-label="StoryVenue home" className="shrink-0">
            <Image
              src="/storyvenue-dark-logo.png"
              alt="StoryVenue"
              width={150}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <div
            className="hidden md:flex items-center gap-8 text-sm text-stone-600"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-stone-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={LOGIN_HREF}
              className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Log in
            </a>
            <PrimaryCTA size="md" label="Start Free Trial" />
          </div>
        </nav>
      </header>

      {/* ============================================================== */}
      {/* 1. HERO                                                          */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative looping line — purely cosmetic */}
        <svg
          aria-hidden
          viewBox="0 0 600 600"
          className="hidden lg:block absolute -top-10 right-[38%] w-[600px] h-[600px] opacity-[0.35] pointer-events-none"
          fill="none"
        >
          <path
            d="M50 300 C 50 150, 200 50, 350 80 S 600 250, 500 400 S 200 600, 100 500"
            stroke="#1c1917"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        </svg>
        <div
          aria-hidden
          className="absolute top-24 left-10 w-2 h-2 rounded-full bg-rose-400"
        />
        <div
          aria-hidden
          className="absolute top-48 right-[44%] w-1.5 h-1.5 rounded-full bg-amber-400"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-16 sm:pt-16 sm:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 border border-stone-200/80 px-3.5 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span
                className="text-[11px] font-semibold tracking-[0.18em] uppercase text-stone-700"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Let&apos;s book more weddings
              </span>
            </div>

            <h1
              className="mt-6 text-[40px] sm:text-[56px] md:text-[68px] leading-[1.02] tracking-[-0.02em] text-stone-900 font-bold"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Fully book your{" "}
              <span className="text-stone-900">wedding venue</span>{" "}
              without letting{" "}
              <em
                className="not-italic relative inline-block"
                style={{ fontFamily: "EditorsNote, serif", fontStyle: "italic", fontWeight: 400 }}
              >
                leads slip away
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute left-0 -bottom-1 w-full h-2 text-rose-400"
                >
                  <path
                    d="M2 8 C 60 2, 140 12, 220 4 S 290 8, 298 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </em>
              .
            </h1>

            <p
              className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              StoryVenue gives wedding venues one platform to capture
              inquiries, follow up faster, manage tours, send proposals, collect
              payments, and turn more couples into booked weddings.
            </p>

            {/* CTA row — pill input with embedded button (Banko-style) */}
            <div className="mt-7 max-w-md">
              <a
                href={TRIAL_HREF}
                className="group flex items-center justify-between rounded-full bg-white border border-stone-200 pl-5 pr-1.5 py-1.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_14px_36px_-12px_rgba(0,0,0,0.22)] transition-shadow"
              >
                <span
                  className="text-sm text-stone-500"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Start your 14-day free trial
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 text-white text-sm font-semibold px-5 py-2.5 group-hover:bg-stone-800 transition-colors"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
              <p className="mt-3 text-[12px] text-stone-500">
                No contract. No down payment. No cancellation fees.
              </p>
            </div>

            {/* Hero bullets */}
            <ul className="mt-7 grid sm:grid-cols-3 gap-2 max-w-2xl">
              {HERO_BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-[13px] text-stone-700"
                >
                  <Check className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                  <span style={{ fontFamily: "var(--font-open-sans)" }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* Used By row */}
            <div className="mt-10">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-400">
                Used by:
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                {PROOF_LOGOS.map((name) => (
                  <span
                    key={name}
                    className="text-[13px] font-semibold tracking-wide text-stone-400 hover:text-stone-700 transition-colors"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <PhonePreview />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. HOW IT WORKS — numbered circles, 4 steps                      */}
      {/* ============================================================== */}
      <section
        id="how-it-works"
        className="bg-stone-50/70 py-20 sm:py-24 border-y border-stone-200/60"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — Process
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-stone-900"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              How it works
            </h2>
          </div>

          <div className="relative mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {/* Connector line (desktop) */}
            <div
              aria-hidden
              className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-7 h-px border-t border-dashed border-stone-300"
            />

            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white border border-stone-200 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.15)]">
                  <span
                    className="text-base font-bold text-stone-900"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3
                  className="mt-5 text-base font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-[13.5px] text-stone-500 leading-relaxed max-w-[240px] mx-auto"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SOLUTION — "one app, every booking touchpoint"                */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left — copy + bullets */}
          <div className="lg:col-span-6">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — Benefits
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-stone-900 leading-[1.05]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              StoryVenue, one platform,{" "}
              <span className="relative inline-block">
                every booking touchpoint
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute left-0 -bottom-1 w-full h-2 text-amber-300"
                >
                  <path
                    d="M2 8 C 60 2, 140 12, 220 4 S 290 8, 298 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h2>

            <p
              className="mt-6 text-base text-stone-600 leading-relaxed max-w-xl"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Listing, CRM, pipeline, conversations, automations, calendar,
              proposals, contracts, payments, reviews, and reports — built
              specifically for wedding venues.
            </p>

            <ul className="mt-7 space-y-3.5 max-w-xl">
              {[
                "One inbox for every inquiry, from every source.",
                "Tours, holds, and walk-throughs on one organized calendar.",
                "Branded proposals, e-signatures, and online payments built in.",
                "AI follow-up that keeps cold leads warm without you lifting a finger.",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[14.5px] text-stone-700"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <PrimaryCTA label="Start My 14-Day Free Trial" />
            </div>
          </div>

          {/* Right — phone (inbox/conversation flavor) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <PhoneInboxPreview />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. METRICS — "Why our product is different"                      */}
      {/* ============================================================== */}
      <section id="features" className="bg-stone-50/70 py-20 sm:py-24 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — The difference
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-stone-900 leading-[1.05]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Why our product
              <br />
              is different.
            </h2>
            <p
              className="mt-5 text-stone-600 leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Most venues do not have a lead problem. They have a follow-up and
              booking system problem. StoryVenue closes that gap.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-x-10 gap-y-10 sm:gap-y-12">
            {METRICS.map((m, i) => (
              <div key={m.label} className="flex flex-col">
                <span
                  className="text-[11px] font-semibold tracking-[0.18em] uppercase text-stone-400"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  0{i + 1}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span
                    className="text-5xl sm:text-6xl font-bold tracking-[-0.03em] text-stone-900"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {m.value}
                  </span>
                  <span
                    className="text-2xl font-semibold text-stone-900"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {m.suffix}
                  </span>
                </div>
                <p
                  className="mt-2 text-[15px] font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {m.label}
                </p>
                <p
                  className="mt-1 text-[13px] text-stone-500 leading-relaxed"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {m.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PROBLEM — 4 pain cards                                        */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — The real problem
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-stone-900 leading-[1.05]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              A bride can love your venue and still book somewhere else.
            </h2>
            <p
              className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              That happens when leads come in from different places,
              conversations live in text and email, proposals are sent manually,
              payments have to be chased, and no one knows exactly which couple
              needs the next follow-up.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAIN_POINTS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl bg-stone-50 border border-stone-200/70 p-5 hover:bg-white hover:shadow-[0_12px_30px_-15px_rgba(0,0,0,0.15)] transition-all"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-stone-200 text-rose-600">
                  <Icon className="w-5 h-5" />
                </span>
                <h3
                  className="mt-4 text-base font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {title}
                </h3>
                <p
                  className="mt-2 text-[13.5px] text-stone-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. OUTCOME GRID                                                  */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl text-center mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — What you get
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-stone-900 leading-[1.05]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Everything your venue needs to capture, convert, and book.
            </h2>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OUTCOME_CARDS.map(({ icon: Icon, title, body, outcome }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border border-stone-200/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_-15px_rgba(0,0,0,0.15)] transition-all"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-white">
                  <Icon className="w-5 h-5" />
                </span>
                <h3
                  className="mt-5 text-lg font-bold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {title}
                </h3>
                <p
                  className="mt-2 text-[13.5px] text-stone-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {body}
                </p>
                <p className="mt-4 pt-4 border-t border-stone-100 text-[12.5px] text-stone-500 leading-relaxed">
                  <span className="font-semibold text-stone-900">Outcome.</span>{" "}
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. ALL-IN-ONE DEVICE — laptop dashboard mockup                   */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — Best feature
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-stone-900 leading-[1.05]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Every booking tool, in one device.
            </h2>
            <p
              className="mt-5 text-stone-600 leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              StoryVenue runs everywhere your team works — on the front desk
              laptop and the phone in your venue manager&apos;s pocket.
            </p>
          </div>

          <div className="mt-14">
            <LaptopDashboardPreview />
          </div>

          <div className="mt-10 flex justify-center">
            <PrimaryCTA label="Start My 14-Day Free Trial" />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. PROOF STRIP — venue result cards                              */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-16 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
            Trusted by wedding venues nationwide
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROOF_RESULTS.map((p) => (
              <div
                key={p.venue}
                className="flex items-start gap-3 rounded-xl bg-white border border-stone-200/70 px-4 py-3.5"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p
                    className="text-[14px] font-semibold text-stone-900 truncate"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {p.venue}
                  </p>
                  <p
                    className="text-[13px] text-stone-600 leading-snug"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {p.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. PRICING                                                       */}
      {/* ============================================================== */}
      <section id="pricing" className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — Pricing
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-stone-900 leading-[1.05]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Choose your plan.
            </h2>
            <p
              className="mt-4 text-stone-600 leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Start free. Grow into the system your venue needs. Downgrade if
              needed.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p) => {
              const isDark = p.highlight;
              return (
                <div
                  key={p.name}
                  className={
                    isDark
                      ? "relative rounded-2xl bg-stone-900 text-white p-6 shadow-[0_24px_60px_-25px_rgba(0,0,0,0.55)]"
                      : "relative rounded-2xl bg-white border border-stone-200/80 text-stone-900 p-6"
                  }
                >
                  {isDark && "badge" in p && p.badge && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-rose-500 text-white text-[10.5px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 shadow-sm">
                      {p.badge}
                    </span>
                  )}

                  <p
                    className={`text-[11px] font-semibold tracking-[0.18em] uppercase ${
                      isDark ? "text-white/60" : "text-stone-400"
                    }`}
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {isDark ? "Premium" : p.name === "Free" ? "Basic" : p.name}
                  </p>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold tracking-[-0.02em] ${
                        isDark ? "text-white" : "text-stone-900"
                      }`}
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      {p.price}
                    </span>
                    {p.period && (
                      <span
                        className={`text-sm ${
                          isDark ? "text-white/60" : "text-stone-500"
                        }`}
                      >
                        {p.period}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-3 text-[13.5px] leading-relaxed ${
                      isDark ? "text-white/70" : "text-stone-600"
                    }`}
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {p.body}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2 text-[13px] ${
                          isDark ? "text-white/90" : "text-stone-700"
                        }`}
                        style={{ fontFamily: "var(--font-open-sans)" }}
                      >
                        <Check
                          className={`mt-0.5 w-3.5 h-3.5 shrink-0 ${
                            isDark ? "text-white" : "text-emerald-600"
                          }`}
                          strokeWidth={3}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={TRIAL_HREF}
                    className={
                      isDark
                        ? "mt-6 inline-flex items-center justify-center w-full rounded-full bg-white text-stone-900 font-semibold px-4 py-3 text-sm hover:bg-stone-100 active:scale-[0.98] transition-all"
                        : "mt-6 inline-flex items-center justify-center w-full rounded-full bg-stone-900 text-white font-semibold px-4 py-3 text-sm hover:bg-stone-800 active:scale-[0.98] transition-all"
                    }
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {p.cta}
                  </a>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-stone-500">
            All plans start with a 14-day free trial. No contract. No down
            payment. No cancellation fees.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. TESTIMONIAL / FINAL CTA                                      */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-t border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="rounded-3xl bg-white border border-stone-200/80 p-8 sm:p-12 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.2)] grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex md:block items-center gap-4">
              <div className="relative w-24 h-24 md:w-full md:h-48 rounded-2xl overflow-hidden bg-stone-200 shrink-0">
                <Image
                  src="/hero-wedding.jpg"
                  alt="Wedding venue owner"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100px"
                />
              </div>
              <div className="md:mt-4">
                <p
                  className="text-base font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Wedding venue owners
                </p>
                <p
                  className="text-[13px] text-stone-500"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Booking more weddings with StoryVenue
                </p>
              </div>
            </div>

            <div className="md:col-span-8">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
                — Your next booking
              </p>
              <h2
                className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-stone-900 leading-[1.1]"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Your next booking could start with a better system.
              </h2>
              <p
                className="mt-4 text-stone-600 leading-relaxed"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Brides are already searching, comparing, asking about pricing,
                and choosing venues. StoryVenue helps your venue get organized,
                respond faster, follow up better, send stronger proposals, and
                create a clearer path from inquiry to booked wedding.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <PrimaryCTA />
                <p className="text-[12px] text-stone-500">
                  No contract. No down payment. No cancellation fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

/* ==================================================================== */
/*  Inline visuals                                                      */
/* ==================================================================== */

/**
 * Phone frame in the hero. Shows a dashboard-y summary: balance card,
 * pipeline stat tiles, and an inquiries feed. Built in HTML/CSS so it
 * stays crisp at any size and adds zero image weight.
 */
function PhonePreview() {
  return (
    <div className="relative">
      {/* Decorative floating "Total leads" tile, top-left */}
      <div className="absolute -top-4 -left-4 sm:-left-8 z-20 rounded-2xl bg-white border border-stone-200 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] px-4 py-3 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <TrendingUp className="w-4 h-4" />
        </span>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-stone-500">
            New leads
          </p>
          <p
            className="text-base font-bold text-stone-900 leading-none mt-0.5"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            +42 this wk
          </p>
        </div>
      </div>

      {/* Phone frame */}
      <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] rounded-[40px] bg-stone-900 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl bg-stone-900 z-10" />

        {/* Screen */}
        <div className="relative w-full h-full rounded-[34px] bg-white overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] text-stone-700 font-semibold">
            <span>9:41</span>
            <span className="opacity-60">●●●●○</span>
          </div>

          {/* Header */}
          <div className="px-4 pt-1 pb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-stone-500">Welcome back,</p>
              <p
                className="text-sm font-bold text-stone-900"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                White Pine Manor
              </p>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold">
              WP
            </span>
          </div>

          {/* Hero card — booked revenue (gradient like Banko's mastercard) */}
          <div className="mx-4 rounded-2xl p-4 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 text-white shadow-[0_12px_28px_-10px_rgba(0,0,0,0.45)]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
              Booked this month
            </p>
            <p
              className="mt-1 text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              $28,400
            </p>
            <div className="mt-3 flex items-center justify-between text-[10px] text-white/70">
              <span>+12% vs last month</span>
              <span className="font-semibold tracking-widest">VENUE PRO</span>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "Inquiries", value: "18", tone: "bg-stone-100 text-stone-700" },
              { label: "Tours", value: "7", tone: "bg-amber-50 text-amber-700" },
              { label: "Booked", value: "3", tone: "bg-emerald-50 text-emerald-700" },
            ].map((t) => (
              <div key={t.label} className="rounded-xl bg-stone-50 p-2.5">
                <p className="text-[9px] uppercase tracking-wide text-stone-500 font-semibold">
                  {t.label}
                </p>
                <p
                  className={`mt-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${t.tone}`}
                >
                  {t.value}
                </p>
              </div>
            ))}
          </div>

          {/* Inquiries feed */}
          <div className="mx-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-stone-900">
                Recent inquiries
              </p>
              <span className="text-[10px] text-stone-400">See all</span>
            </div>
            <ul className="mt-2 space-y-2">
              {[
                {
                  who: "Emma + Jordan",
                  what: "Signed proposal",
                  amount: "+$9,800",
                  tone: "text-emerald-600",
                },
                {
                  who: "Lauren + Mark",
                  what: "Tour booked · Sat",
                  amount: "Hold",
                  tone: "text-amber-600",
                },
                {
                  who: "Hannah + Sam",
                  what: "Inquired · Meta ad",
                  amount: "New",
                  tone: "text-rose-600",
                },
                {
                  who: "Sophie + Will",
                  what: "Sent proposal",
                  amount: "Pending",
                  tone: "text-stone-500",
                },
              ].map((row) => (
                <li
                  key={row.who}
                  className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p
                      className="text-[11px] font-semibold text-stone-900 truncate"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      {row.who}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate">
                      {row.what}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold ${row.tone}`}>
                    {row.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decorative floating "Booked" tile, bottom-right */}
      <div className="absolute -bottom-4 -right-2 sm:-right-6 z-20 rounded-2xl bg-white border border-stone-200 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] px-4 py-3 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white">
          <Check className="w-4 h-4" strokeWidth={3} />
        </span>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-stone-500">
            Booked
          </p>
          <p
            className="text-sm font-bold text-stone-900 leading-none mt-0.5"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Emma + Jordan
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Phone showing an inbox/conversation flavor, used in the Solution section
 * so it visually differs from the hero phone.
 */
function PhoneInboxPreview() {
  const THREADS = [
    {
      name: "Hannah + Sam",
      preview: "Hi! Is October 4th still open?",
      time: "2m",
      unread: true,
      source: "Meta",
    },
    {
      name: "Lauren + Mark",
      preview: "We loved the tour — can you send a proposal?",
      time: "1h",
      unread: true,
      source: "Website",
    },
    {
      name: "Emma + Jordan",
      preview: "Signed! Wire goes out tomorrow ✨",
      time: "3h",
      unread: false,
      source: "Email",
    },
    {
      name: "Sophie + Will",
      preview: "What's included in the venue rental?",
      time: "Y'day",
      unread: false,
      source: "The Knot",
    },
    {
      name: "Mia + Jack",
      preview: "Following up on our chat about catering.",
      time: "Mon",
      unread: false,
      source: "IG",
    },
  ];

  return (
    <div className="relative">
      <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] rounded-[40px] bg-stone-900 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl bg-stone-900 z-10" />
        <div className="relative w-full h-full rounded-[34px] bg-white overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] text-stone-700 font-semibold">
            <span>9:41</span>
            <span className="opacity-60">●●●●○</span>
          </div>

          {/* Header */}
          <div className="px-4 pt-1 pb-3 flex items-center justify-between">
            <div>
              <p
                className="text-base font-bold text-stone-900"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Inbox
              </p>
              <p className="text-[10px] text-stone-500">All channels · 2 unread</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1">
              AI on
            </span>
          </div>

          {/* Threads */}
          <ul className="px-2 space-y-1.5">
            {THREADS.map((t) => (
              <li
                key={t.name}
                className={`flex items-start gap-2.5 rounded-xl px-2.5 py-2 ${
                  t.unread ? "bg-stone-50" : ""
                }`}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold">
                  {t.name.split(" ")[0][0]}
                  {t.name.split(" ").at(-1)?.[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[11px] truncate ${
                        t.unread
                          ? "font-bold text-stone-900"
                          : "font-semibold text-stone-700"
                      }`}
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      {t.name}
                    </p>
                    <span className="text-[9px] text-stone-400 shrink-0 ml-2">
                      {t.time}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-stone-500 truncate">
                    {t.preview}
                  </p>
                  <span className="mt-1 inline-flex items-center rounded-md bg-white border border-stone-200 px-1.5 py-0.5 text-[9px] font-semibold text-stone-500">
                    {t.source}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating tile */}
      <div className="absolute -top-3 -right-2 sm:-right-6 z-20 rounded-2xl bg-white border border-stone-200 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] px-3.5 py-2.5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <Zap className="w-3.5 h-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-stone-500">
            AI follow-up
          </p>
          <p
            className="text-[11px] font-bold text-stone-900 leading-none mt-0.5"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            14 nudges sent
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Laptop-framed dashboard mockup for the "Every booking tool, in one
 * device" section. Sized large so it reads as a real product screen.
 */
function LaptopDashboardPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Laptop body */}
      <div className="relative rounded-[28px] bg-stone-900 p-3 sm:p-4 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.45)]">
        {/* Screen */}
        <div className="rounded-[18px] bg-white overflow-hidden border border-stone-200">
          {/* App chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            </div>
            <span className="text-[11px] font-medium text-stone-400 tracking-wide">
              app.storyvenue.com / dashboard
            </span>
            <span className="w-10" />
          </div>

          {/* App body */}
          <div className="grid grid-cols-12 min-h-[380px]">
            {/* Sidebar */}
            <aside className="hidden md:block col-span-3 lg:col-span-2 border-r border-stone-200 p-4 bg-stone-50/40">
              <div className="space-y-1">
                {[
                  { label: "Dashboard", active: true },
                  { label: "Inbox" },
                  { label: "Pipeline" },
                  { label: "Calendar" },
                  { label: "Proposals" },
                  { label: "Payments" },
                  { label: "Reports" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11.5px] ${
                      item.active
                        ? "bg-stone-900 text-white font-semibold"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.active ? "bg-white" : "bg-stone-300"
                      }`}
                    />
                    {item.label}
                  </div>
                ))}
              </div>
            </aside>

            {/* Main */}
            <main className="col-span-12 md:col-span-9 lg:col-span-10 p-5 sm:p-6 bg-white">
              {/* KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "New leads", value: "42", tone: "bg-emerald-50 text-emerald-700", delta: "+18%" },
                  { label: "Tours", value: "11", tone: "bg-amber-50 text-amber-700", delta: "+6" },
                  { label: "Proposals", value: "7", tone: "bg-rose-50 text-rose-700", delta: "+2" },
                  { label: "Booked", value: "$28.4k", tone: "bg-stone-100 text-stone-700", delta: "+12%" },
                ].map((k) => (
                  <div
                    key={k.label}
                    className="rounded-xl border border-stone-200 bg-white p-3.5"
                  >
                    <p className="text-[10px] font-semibold tracking-wide uppercase text-stone-500">
                      {k.label}
                    </p>
                    <p
                      className="mt-1 text-xl font-bold text-stone-900"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      {k.value}
                    </p>
                    <p
                      className={`mt-1 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${k.tone}`}
                    >
                      {k.delta}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pipeline kanban */}
              <div className="mt-5 rounded-xl border border-stone-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-200 bg-stone-50/60">
                  <span className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                    Pipeline · November
                  </span>
                  <span className="text-[11px] text-stone-400">Live</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3">
                  {[
                    {
                      title: "Inquiry",
                      tone: "bg-stone-100 text-stone-700",
                      items: ["Hannah + Sam", "Olivia + Tom", "Megan + Cole"],
                    },
                    {
                      title: "Tour",
                      tone: "bg-amber-50 text-amber-700",
                      items: ["Lauren + Mark", "Ava + Reece"],
                    },
                    {
                      title: "Proposal",
                      tone: "bg-rose-50 text-rose-700",
                      items: ["Sophie + Will", "Mia + Jack"],
                    },
                    {
                      title: "Booked",
                      tone: "bg-emerald-50 text-emerald-700",
                      items: ["Emma + Jordan", "Bella + Alex"],
                    },
                  ].map((col) => (
                    <div
                      key={col.title}
                      className="rounded-lg bg-stone-50/70 border border-stone-200/70 p-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wide uppercase text-stone-500">
                          {col.title}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold ${col.tone}`}
                        >
                          {col.items.length}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {col.items.map((it) => (
                          <li
                            key={it}
                            className="rounded-md bg-white border border-stone-200 px-2 py-1.5 text-[10.5px] font-semibold text-stone-700 truncate"
                          >
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Laptop base */}
      <div
        aria-hidden
        className="mx-auto h-3 w-[88%] rounded-b-[14px] bg-stone-200 shadow-[0_30px_40px_-20px_rgba(0,0,0,0.3)]"
      />
      <div
        aria-hidden
        className="mx-auto h-1.5 w-[28%] rounded-b-md bg-stone-300"
      />
    </div>
  );
}
