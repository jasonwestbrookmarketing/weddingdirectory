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
  Star,
  Sparkles,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-static";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

// Meta ads land here. We append a campaign tag downstream of signup so the
// dashboard can attribute the trial back to this page without us having to
// own analytics here.
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

const PROOF_RESULTS: Array<{ venue: string; result: string }> = [
  { venue: "Manor", result: "Booked 2026 dates in 90 days" },
  { venue: "Waterloo Farms", result: "Booked 2 weddings in 7 days" },
  { venue: "Atlantic Stables", result: "$15,000 booked in 30 days" },
  { venue: "Retreat at Evans Farms", result: "258 leads in 60 days" },
  { venue: "Red Barn Acres", result: "Booked 9 weddings in 4 months" },
  { venue: "Irongate Wedding Venue", result: "131 leads in 60 days" },
];

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
    title: "A couple discovers your venue.",
    body: "Your listing, website, forms, ads, or landing pages capture the inquiry.",
  },
  {
    step: "02",
    title: "StoryVenue organizes the opportunity.",
    body: "Every lead enters your CRM with contact details, wedding info, conversations, pipeline stage, and next steps.",
  },
  {
    step: "03",
    title: "Your system helps move them forward.",
    body: "Follow-up, conversations, tours, proposals, signatures, and payments all happen in one place.",
  },
  {
    step: "04",
    title: "You upgrade when you want more growth support.",
    body: "Add managed Meta ads or concierge follow-up when you are ready for StoryVenue to help bring in and work more leads.",
  },
] as const;

const PLANS = [
  {
    name: "Free",
    tagline: "Get listed. Get paid.",
    body: "Best for venues that want a professional listing, online proposals, and built-in payments.",
    highlight: false,
  },
  {
    name: "Venue Pro",
    tagline: "Run your venue like a business.",
    body: "The full SaaS platform: CRM, pipeline, automations, inbox, calendar, reports, proposals, payments, and booking tools.",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Booking System",
    tagline: "Add managed Meta ads.",
    body: "Best for venues that want more brides coming into their pipeline.",
    highlight: false,
  },
  {
    name: "All-Inclusive",
    tagline: "Add concierge follow-up.",
    body: "Best for venues that want StoryVenue helping follow up and move leads toward chats and tours.",
    highlight: false,
  },
] as const;

function PrimaryCTA({
  size = "lg",
  label = "Start My 14-Day Free Trial",
  className = "",
}: {
  size?: "md" | "lg";
  label?: string;
  className?: string;
}) {
  const sizing =
    size === "lg"
      ? "px-7 py-4 text-base sm:text-[15px]"
      : "px-6 py-3 text-sm";
  return (
    <a
      href={TRIAL_HREF}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white font-semibold shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] hover:bg-stone-800 active:scale-[0.98] transition-all ${sizing} ${className}`}
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
      {/* Top utility nav — sober, dashboard-style. Two pixels of accent so the
          page reads as part of the SaaS, not the consumer directory. */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/70">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
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
      {/* 1. HERO                                                         */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white">
        {/* Soft decorative blooms */}
        <div
          aria-hidden
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-rose-100/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -top-20 right-[-10%] w-[480px] h-[480px] rounded-full bg-amber-100/40 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-20 sm:pt-20 sm:pb-28 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-stone-200 px-3.5 py-1.5 text-xs font-medium text-stone-600 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Built for wedding venues</span>
            </div>

            <h1
              className="mt-6 text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-stone-900"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Fully Book Your Wedding Venue{" "}
              <em
                className="italic text-stone-900/95"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Without Letting Leads Slip Away
              </em>
            </h1>

            <p
              className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              StoryVenue gives wedding venues one platform to capture
              inquiries, follow up faster, manage tours, send proposals, collect
              payments, and turn more couples into booked weddings.
            </p>

            <p className="mt-3 text-sm text-stone-500">
              Start your 14-day free trial today. No contract. No down payment.
              No cancellation fees.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
              <PrimaryCTA />
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-stone-700 hover:text-stone-900 px-2 py-3"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                See how it works
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <ul className="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl">
              {HERO_BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-sm text-stone-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span style={{ fontFamily: "var(--font-open-sans)" }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — dashboard mockup. Built from rendered cards so it stays
              crisp at any size and visually mirrors the actual SaaS UI
              without us needing to ship a screenshot. */}
          <div className="lg:col-span-5">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PROOF STRIP                                                  */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <p className="text-center text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">
            Trusted by wedding venues nationwide
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {PROOF_RESULTS.map((p) => (
              <div
                key={p.venue}
                className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-3"
              >
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Star className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold text-stone-900 truncate"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {p.venue}
                  </p>
                  <p className="text-[13px] text-stone-600 leading-snug">
                    {p.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. PROBLEM                                                      */}
      {/* ============================================================== */}
      <section className="bg-stone-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">
              The real problem
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-stone-900"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Most venues do not have a lead problem. They have a{" "}
              <em
                className="italic"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                follow-up and booking system
              </em>{" "}
              problem.
            </h2>
            <div
              className="mt-6 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <p>
                A bride can love your venue and still book somewhere else if
                your process feels slow, confusing, or scattered.
              </p>
              <p>
                That happens when leads come in from different places,
                conversations live in text and email, proposals are sent
                manually, payments have to be chased, and no one knows exactly
                which couple needs the next follow-up.
              </p>
              <p className="text-stone-900 font-medium">
                StoryVenue helps you fix the gap between &ldquo;she
                inquired&rdquo; and &ldquo;she booked.&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAIN_POINTS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border border-stone-200 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Icon className="w-5 h-5" />
                </span>
                <h3
                  className="mt-4 text-base font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {title}
                </h3>
                <p className="mt-1.5 text-[14px] text-stone-600 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SOLUTION                                                     */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">
              The solution
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-stone-900"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              One platform for the full{" "}
              <em
                className="italic"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                wedding booking journey
              </em>
              .
            </h2>
            <div
              className="mt-6 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <p>
                StoryVenue brings your venue listing, CRM, pipeline,
                conversations, automations, calendar, proposals, contracts,
                payments, reviews, and reports into one system built
                specifically for wedding venues.
              </p>
              <p>
                So instead of duct-taping together forms, spreadsheets,
                inboxes, PDFs, payment links, and calendars, your team has one
                place to manage every opportunity from first inquiry to booked
                wedding.
              </p>
            </div>
            <div className="mt-7">
              <PrimaryCTA />
            </div>
          </div>

          {/* Visual: stack of pipeline tiles */}
          <div className="lg:col-span-6">
            <PipelinePreview />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. OUTCOME FEATURE GRID                                         */}
      {/* ============================================================== */}
      <section className="bg-stone-900 py-20 sm:py-28 text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0px, transparent 1px), radial-gradient(circle at 80% 60%, white 0px, transparent 1px)",
            backgroundSize: "32px 32px, 48px 48px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-white/50">
              What you get
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Everything your venue needs to{" "}
              <em
                className="italic text-white"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                capture, convert, and book
              </em>
              .
            </h2>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OUTCOME_CARDS.map(({ icon: Icon, title, body, outcome }) => (
              <div
                key={title}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-stone-900">
                  <Icon className="w-5 h-5" />
                </span>
                <h3
                  className="mt-5 text-lg font-semibold"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-[14px] text-white/70 leading-relaxed">
                  {body}
                </p>
                <p className="mt-4 pt-4 border-t border-white/10 text-[13px] text-white/85">
                  <span className="font-semibold text-white">Outcome:</span>{" "}
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. HOW IT WORKS                                                 */}
      {/* ============================================================== */}
      <section id="how-it-works" className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">
              How it works
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-stone-900"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              From inquiry to{" "}
              <em
                className="italic"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                booked wedding
              </em>
              .
            </h2>
          </div>

          <ol className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <li
                key={step.step}
                className="relative rounded-2xl border border-stone-200 bg-stone-50/60 p-6"
              >
                <span
                  className="text-[44px] leading-none text-stone-300 font-light"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {step.step}
                </span>
                <h3
                  className="mt-4 text-base font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] text-stone-600 leading-relaxed">
                  {step.body}
                </p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ArrowRight
                    aria-hidden
                    className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. PLAN PATH                                                    */}
      {/* ============================================================== */}
      <section className="bg-stone-50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">
              Plans &amp; pricing
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-stone-900"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Start free.{" "}
              <em
                className="italic"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Grow into the system your venue needs.
              </em>
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={
                  p.highlight
                    ? "relative rounded-2xl bg-stone-900 text-white p-6 shadow-[0_18px_45px_-18px_rgba(0,0,0,0.45)] ring-1 ring-stone-900"
                    : "relative rounded-2xl bg-white border border-stone-200 text-stone-900 p-6"
                }
              >
                {p.highlight && "badge" in p && p.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-rose-500 text-white text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 shadow-sm">
                    {p.badge}
                  </span>
                )}
                <h3
                  className={`text-xl font-semibold ${
                    p.highlight ? "text-white" : "text-stone-900"
                  }`}
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {p.name}
                </h3>
                <p
                  className={`mt-1 text-sm font-medium ${
                    p.highlight ? "text-white/80" : "text-stone-500"
                  }`}
                >
                  {p.tagline}
                </p>
                <p
                  className={`mt-4 text-[14px] leading-relaxed ${
                    p.highlight ? "text-white/75" : "text-stone-600"
                  }`}
                >
                  {p.body}
                </p>
                <a
                  href={TRIAL_HREF}
                  className={
                    p.highlight
                      ? "mt-6 inline-flex items-center justify-center w-full rounded-full bg-white text-stone-900 font-semibold px-4 py-3 text-sm hover:bg-stone-100 active:scale-[0.98] transition-all"
                      : "mt-6 inline-flex items-center justify-center w-full rounded-full bg-stone-900 text-white font-semibold px-4 py-3 text-sm hover:bg-stone-800 active:scale-[0.98] transition-all"
                  }
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Start My 14-Day Free Trial
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-stone-500">
            Start free. Upgrade when you are ready. Downgrade if needed.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FINAL CTA                                                    */}
      {/* ============================================================== */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <Image
          src="/hero-wedding.jpg"
          alt=""
          fill
          aria-hidden
          className="absolute inset-0 object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/85 via-stone-900/90 to-stone-900" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-24 sm:py-32 text-center">
          <h2
            className="text-3xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your next booking could start with a{" "}
            <em
              className="italic"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              better system
            </em>
            .
          </h2>
          <p
            className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Brides are already searching, comparing, asking about pricing, and
            choosing venues. StoryVenue helps your venue get organized, respond
            faster, follow up better, send stronger proposals, collect
            payments, and create a clearer path from inquiry to booked
            wedding.
          </p>
          <p className="mt-5 text-sm text-white/70">
            Start your 14-day free trial today.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={TRIAL_HREF}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-stone-900 font-semibold px-7 py-4 text-base shadow-[0_18px_45px_-12px_rgba(0,0,0,0.6)] hover:bg-stone-100 active:scale-[0.98] transition-all"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Start My 14-Day Free Trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <p className="mt-5 text-xs text-white/55">
            No contract. No down payment. No cancellation fees.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

/* -------------------------------------------------------------------- */
/* Inline visual components                                              */
/* -------------------------------------------------------------------- */

/**
 * Stylized dashboard preview. Rendered with HTML/CSS so the page stays
 * fast (no extra image weight), and matches the SaaS dashboard palette
 * without us needing to ship a screenshot.
 */
function DashboardPreview() {
  return (
    <div className="relative">
      {/* Drop shadow + tilt-free presentation */}
      <div className="relative rounded-3xl bg-white border border-stone-200 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          </div>
          <span className="text-[11px] font-medium text-stone-400 tracking-wide">
            app.storyvenue.com
          </span>
          <span className="w-10" />
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 grid grid-cols-3 gap-4 bg-white">
          {/* Stat cards */}
          <StatCard label="New leads" value="42" delta="+18%" tone="emerald" />
          <StatCard label="Tours booked" value="11" delta="+6" tone="amber" />
          <StatCard
            label="Booked revenue"
            value="$28,400"
            delta="+12%"
            tone="rose"
          />

          {/* Pipeline preview */}
          <div className="col-span-3 mt-1 rounded-xl border border-stone-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-200 bg-stone-50/60">
              <span className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                Pipeline
              </span>
              <span className="text-[11px] text-stone-400">This week</span>
            </div>
            <div className="grid grid-cols-4 gap-2 p-3">
              {[
                { name: "Inquiry", count: 18, tone: "bg-stone-100 text-stone-700" },
                { name: "Tour", count: 7, tone: "bg-amber-50 text-amber-700" },
                {
                  name: "Proposal",
                  count: 4,
                  tone: "bg-rose-50 text-rose-700",
                },
                {
                  name: "Booked",
                  count: 3,
                  tone: "bg-emerald-50 text-emerald-700",
                },
              ].map((col) => (
                <div key={col.name} className="rounded-lg bg-stone-50/70 p-2.5">
                  <p className="text-[10px] font-semibold tracking-wide uppercase text-stone-500">
                    {col.name}
                  </p>
                  <p
                    className={`mt-1 inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${col.tone}`}
                  >
                    {col.count}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-1.5 rounded-full bg-stone-200" />
                    <div className="h-1.5 rounded-full bg-stone-200/70 w-4/5" />
                    <div className="h-1.5 rounded-full bg-stone-200/50 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity row */}
          <div className="col-span-3 rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-200 bg-stone-50/60">
              <span className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                Recent activity
              </span>
              <span className="text-[11px] text-stone-400">Live</span>
            </div>
            <ul className="divide-y divide-stone-100">
              {[
                {
                  who: "Emma + Jordan",
                  what: "Signed proposal",
                  when: "2m",
                  tone: "bg-emerald-500",
                },
                {
                  who: "Lauren + Mark",
                  what: "Booked tour for Saturday",
                  when: "12m",
                  tone: "bg-amber-500",
                },
                {
                  who: "Hannah + Sam",
                  what: "Inquired via Meta ad",
                  when: "1h",
                  tone: "bg-rose-500",
                },
              ].map((row) => (
                <li
                  key={row.who}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`h-2 w-2 rounded-full ${row.tone} shrink-0`}
                    />
                    <p className="text-[12px] text-stone-700 truncate">
                      <span className="font-semibold text-stone-900">
                        {row.who}
                      </span>{" "}
                      — {row.what}
                    </p>
                  </div>
                  <span className="text-[11px] text-stone-400 shrink-0 ml-3">
                    {row.when}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -bottom-5 -left-3 sm:-left-6 max-w-[260px] rounded-2xl bg-white border border-stone-200 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.25)] p-3.5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
          <Check className="w-4 h-4" strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-stone-900 truncate">
            New booking confirmed
          </p>
          <p className="text-[11px] text-stone-500 truncate">
            Emma + Jordan · $9,800
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "emerald" | "amber" | "rose";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700"
      : "bg-rose-50 text-rose-700";
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3.5">
      <p className="text-[10px] font-semibold tracking-wide uppercase text-stone-500">
        {label}
      </p>
      <p
        className="mt-1 text-xl font-semibold text-stone-900"
        style={{ fontFamily: "var(--font-open-sans)" }}
      >
        {value}
      </p>
      <p
        className={`mt-1 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${toneClass}`}
      >
        {delta}
      </p>
    </div>
  );
}

/**
 * Pipeline preview shown in the Solution section. Lighter, broader layout
 * than DashboardPreview so the two visuals do not feel duplicated.
 */
function PipelinePreview() {
  const STAGES = [
    {
      title: "Inquiry",
      color: "bg-stone-100 text-stone-700",
      items: [
        { name: "Hannah + Sam", note: "via Meta ad" },
        { name: "Olivia + Tom", note: "via The Knot" },
        { name: "Megan + Cole", note: "via website" },
      ],
    },
    {
      title: "Tour",
      color: "bg-amber-50 text-amber-700",
      items: [
        { name: "Lauren + Mark", note: "Sat 2:00 PM" },
        { name: "Ava + Reece", note: "Sun 10:30 AM" },
      ],
    },
    {
      title: "Proposal",
      color: "bg-rose-50 text-rose-700",
      items: [
        { name: "Sophie + Will", note: "Sent · awaiting sig" },
        { name: "Mia + Jack", note: "Signed · invoice sent" },
      ],
    },
    {
      title: "Booked",
      color: "bg-emerald-50 text-emerald-700",
      items: [
        { name: "Emma + Jordan", note: "$9,800 · 2026" },
        { name: "Bella + Alex", note: "$12,400 · 2026" },
      ],
    },
  ];

  return (
    <div className="rounded-3xl bg-white border border-stone-200 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] p-4 sm:p-5">
      <div className="flex items-center justify-between px-1 pb-3">
        <span className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
          Lead pipeline
        </span>
        <span className="text-[11px] text-stone-400">November</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES.map((stage) => (
          <div
            key={stage.title}
            className="rounded-xl bg-stone-50/70 border border-stone-200/70 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-stone-500">
                {stage.title}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${stage.color}`}
              >
                {stage.items.length}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {stage.items.map((it) => (
                <li
                  key={it.name}
                  className="rounded-lg bg-white border border-stone-200 px-2.5 py-2"
                >
                  <p className="text-[12px] font-semibold text-stone-900 truncate">
                    {it.name}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">
                    {it.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
