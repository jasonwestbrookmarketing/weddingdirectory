import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Search,
  Inbox,
  Zap,
  CalendarCheck,
  FileSignature,
  BarChart3,
  Wallet,
  Sparkles,
  TrendingUp,
  BookOpen,
  Megaphone,
  LayoutTemplate,
  ClipboardList,
  BrainCircuit,
  Users,
  Star,
  CreditCard,
  CalendarDays,
  MessageSquare,
  Shield,
  ChevronDown,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-static";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const TRIAL_HREF = `${STORYPAY_URL}/signup?as=venue&plan=trial&utm_source=meta&utm_medium=paid&utm_campaign=book-more-weddings`;

export const metadata: Metadata = {
  title:
    "Book More Weddings — The All-In-One Directory, Booking System & Marketing Platform | StoryVenue",
  description:
    "StoryVenue combines a wedding venue directory, booking system, CRM, payments, proposals, Meta ads, concierge follow-up, and AI intelligence into one simple platform. Start your 14-day free trial.",
  alternates: { canonical: "/book-more-weddings" },
  openGraph: {
    title: "Fully Book Your Wedding Venue Without Empty Weekends",
    description:
      "The first and only all-in-one directory, booking system, and marketing platform for wedding venues. 14-day free trial. No contract.",
    url: "/book-more-weddings",
    siteName: "StoryVenue",
    images: [{ url: "/hero-wedding.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fully Book Your Wedding Venue Without Empty Weekends | StoryVenue",
    description:
      "Directory + booking system + CRM + Meta ads + concierge follow-up in one platform. 14-day free trial.",
    images: ["/hero-wedding.jpg"],
  },
};

/* -------------------------------------------------------------------- */
/*  Data                                                                  */
/* -------------------------------------------------------------------- */

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Brides Find You First",
    body: "Your venue is promoted through targeted Meta ads and your StoryVenue directory presence, so you show up while brides are actively dreaming, searching, and comparing options.",
  },
  {
    step: "02",
    title: "Clicks Turn Into Qualified Inquiries",
    body: "Instead of sending traffic to a confusing homepage, brides land on a focused page built to capture their interest and learn what matters most to them. They can request your Pricing and Availability Guide, share their wedding date, and answer simple qualifying questions that reveal how serious they are.",
  },
  {
    step: "03",
    title: "Pricing And Availability Are Delivered Instantly",
    body: "The moment she inquires, your venue details, pricing, photos, and next steps are sent by email and SMS. She does not have to wait. She does not have to guess. She gets clarity immediately.",
  },
  {
    step: "04",
    title: "Your Team Is Notified Immediately",
    body: "You and the StoryVenue Concierge team receive her details within seconds, including her name, number, wedding date, what matters most, and where she is in the search process. Now you know who she is, what she cares about, and how ready she is.",
  },
  {
    step: "05",
    title: "StoryVenue Concierge Follows Up Personally",
    body: "Our Concierge team begins personal SMS follow-up right away. They answer questions, build trust, and work to book the bride into a 5-minute chat or tour.",
  },
  {
    step: "06",
    title: "AI Concierge Keeps Silent Leads Alive",
    body: "If a lead goes quiet, the AI Concierge can continue reaching out every 1 to 3 days with personalized messages designed to get couples to reply. The moment they respond, the AI turns off and the venue concierge and venue teams take over.",
  },
  {
    step: "07",
    title: "You Host The Tour",
    body: "By the time she books a tour, she already knows your pricing, understands your venue, and feels more confident about choosing you. You are not chasing. You are not convincing. You are welcoming a bride who is already interested.",
  },
] as const;

const FEATURE_CARDS: Array<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}> = [
  {
    icon: Search,
    title: "Directory Listing",
    description:
      "Get your venue in front of couples actively searching for their perfect wedding venue, without relying only on crowded directories or word of mouth.",
  },
  {
    icon: Megaphone,
    title: "Meta Ads",
    description:
      "Show up while brides are dreaming, searching, and comparing venues, so your venue gets seen before your competitors.",
  },
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    description:
      "Turn ad clicks into real inquiries with focused pages built to capture interest, collect details, and move brides toward the next step.",
  },
  {
    icon: ClipboardList,
    title: "Lead Capture Forms",
    description:
      "Capture every inquiry from your website, ads, social bio, or directory listing and send new leads directly into your booking system.",
  },
  {
    icon: BookOpen,
    title: "Pricing and Availability Guide",
    description:
      "Give brides the two answers they want most, pricing and availability, instantly so they feel clear, confident, and ready to take the next step.",
  },
  {
    icon: Users,
    title: "CRM",
    description:
      "Keep every bride, conversation, note, payment, proposal, and booking detail in one place so no lead or opportunity gets lost.",
  },
  {
    icon: TrendingUp,
    title: "Sales Pipeline",
    description:
      "See exactly where every bride stands, from new inquiry to booked wedding, and know what needs to happen next.",
  },
  {
    icon: MessageSquare,
    title: "Email and SMS Follow-Up",
    description:
      "Follow up with every lead automatically so brides stay engaged, conversations continue, and fewer opportunities go cold.",
  },
  {
    icon: Sparkles,
    title: "StoryVenue Concierge",
    description:
      "Let our team personally follow up with leads, answer questions, build trust, and help book 5-minute chats or tours on your behalf.",
  },
  {
    icon: BrainCircuit,
    title: "AI Concierge",
    description:
      "Re-engage silent leads with personalized follow-up every 1 to 3 days until they reply, so no bride is forgotten.",
  },
  {
    icon: CalendarDays,
    title: "Calendar and Tour Scheduling",
    description:
      "Manage tours, events, meetings, holds, and booked dates in one calendar so your team stays organized and avoids double-bookings.",
  },
  {
    icon: Inbox,
    title: "Unified Inbox",
    description:
      "Keep every email and text conversation in one thread so your team can respond faster and never lose context.",
  },
  {
    icon: FileSignature,
    title: "Proposals With E-Signatures",
    description:
      "Send professional proposals brides can review, sign, and pay from any device, helping you close bookings faster.",
  },
  {
    icon: CreditCard,
    title: "Online Payments",
    description:
      "Collect deposits, balances, add-ons, and invoices online so couples can pay instantly and you can stop chasing checks.",
  },
  {
    icon: Wallet,
    title: "Payment Plans",
    description:
      "Make it easier for couples to say yes by offering automatic installment plans without manually tracking or chasing payments.",
  },
  {
    icon: Star,
    title: "Reviews",
    description:
      "Build trust with social proof by collecting, managing, and displaying reviews where future brides are already comparing venues.",
  },
  {
    icon: BarChart3,
    title: "Reporting",
    description:
      "See revenue, payments, outstanding balances, proposal activity, and booking performance clearly so you know where your business stands.",
  },
  {
    icon: Zap,
    title: "Marketing Automations",
    description:
      "Run follow-up, email sequences, SMS messages, lead nurturing, reminders, and internal notifications automatically.",
  },
  {
    icon: CalendarCheck,
    title: "Team Tools",
    description:
      "Give your team the access, notes, permissions, and notifications they need to stay aligned without giving everyone full control.",
  },
  {
    icon: Shield,
    title: "Client Portal",
    description:
      "Give couples one professional place to view proposals, sign documents, make payments, and stay connected with your venue.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is StoryVenue just another venue directory?",
    a: "No. StoryVenue is more than a directory.\n\nMost directories list your venue next to every competitor in your market and leave you to figure out the rest. StoryVenue gives your venue a full growth system: directory presence, Meta ads, landing pages, lead capture, CRM, SMS and email follow-up, Venue Concierge Team, AI Concierge, proposals, payments, calendar, reviews, and reporting. It is built to help you get found, book tours, and turn more inquiries into signed weddings.",
  },
  {
    q: "Is this just a CRM?",
    a: "No. A CRM helps you organize leads.\n\nStoryVenue helps you create leads, capture them, follow up with them, book tours, send proposals, collect payments, and manage the entire booking process from one place. It is not just where leads are stored. It is the system that helps move them forward.",
  },
  {
    q: "Do I need to be good at marketing to use StoryVenue?",
    a: "No. That is the point.\n\nYou did not open a wedding venue so you could become a full-time marketer. StoryVenue helps handle the marketing system around your venue, including ads, landing pages, guide delivery, follow-up, and lead management.\n\nYour job is simple: Be available when couples are ready to talk. Host great tours. Book more weddings.",
  },
  {
    q: "What makes StoryVenue different from hiring a marketing agency?",
    a: "Most agencies focus on traffic, ads, or content. StoryVenue focuses on the full booking journey. That means we do not just help get attention. We help turn that attention into inquiries, follow-up, tours, proposals, payments, and booked weddings. More leads only matter if the system behind them can convert.",
  },
  {
    q: "What happens when a bride submits an inquiry?",
    a: "The system immediately delivers your Pricing and Availability Guide by email and SMS. You and the StoryVenue Concierge team are notified with her name, number, wedding date, what matters most to her, and where she is in her search. Then follow-up begins so she does not go cold.",
  },
  {
    q: "Does StoryVenue follow up with leads for me?",
    a: "Yes, depending on your plan.\n\nWith the All-Inclusive plan, the StoryVenue Concierge team personally follows up with brides by SMS for up to 14 days to answer questions, build trust, and work to book a 5-minute chat or tour.\n\nIf a lead goes silent, the AI Concierge can continue reaching out every 1 to 3 days until she replies or opts out.",
  },
  {
    q: "Does the AI Concierge talk to brides for me?",
    a: "No. The AI Concierge is designed for outbound follow-up only. Its job is to re-engage silent leads and get them to reply. The moment a bride responds, the AI turns off and notifies your team or the StoryVenue Concierge team to take over. It does not replace real human conversation. It makes sure no lead is forgotten.",
  },
  {
    q: "Will this replace my current tools?",
    a: "For many venues, yes.\n\nStoryVenue can replace or reduce the need for separate tools for your CRM, proposals, payments, follow-up, lead forms, automations, calendar, reviews, and reporting.\n\nInstead of duct-taping multiple platforms together, your venue can manage the full booking process in one place.",
  },
  {
    q: "How fast can we go live?",
    a: "You can sign up and publish your StoryVenue listing instantly. Your listing, proposals, and payment tools can be live right away.\n\nIf your plan includes managed marketing, ads, landing pages, guide setup, Concierge follow-up, or deeper onboarding, setup typically takes 1 to 2 weeks depending on your plan and venue assets.\n\nThe goal is simple: Get your venue visible fast, then install the right booking and marketing system to help turn that visibility into inquiries, tours, and booked weddings.",
  },
  {
    q: "What do I have to do as the venue owner?",
    a: "Your role is simple. Make 2 to 3 outbound call attempts within the first 48 to 72 hours when a strong lead comes in. Be available for 5-minute chats and tours. Give brides a great experience when they are ready to talk.\n\nStoryVenue handles the heavy lifting around the marketing, automation, follow-up, and system.",
  },
  {
    q: "Is there a contract?",
    a: "No long-term contract. No cancellation fees. StoryVenue is designed to earn your business through results, not lock you into something you do not want.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. StoryVenue offers a 14-day free trial.",
  },
  {
    q: "What if it does not work for my venue?",
    a: "StoryVenue includes a 14-day results guarantee after going live.\n\nIf we do not deliver the results we agreed to, you do not pay.",
  },
  {
    q: "How many extra weddings do I need for this to pay for itself?",
    a: "For many venues, just 1 to 2 extra weddings can cover the system for the entire year.\n\nThat is why the first goal is simple: Help you make your investment back as quickly as possible.",
  },
] as const;

/* -------------------------------------------------------------------- */
/*  Shared CTA component                                                  */
/* -------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------- */
/*  Page                                                                  */
/* -------------------------------------------------------------------- */

export default function BookMoreWeddingsPage() {
  return (
    <>
      {/* ============================================================== */}
      {/* TICKER — matches deck.storyvenuemarketing.com exactly           */}
      {/* charcoal bg (#1c1c1c), cream/80 text, subtle separator          */}
      {/* ============================================================== */}
      <div className="w-full overflow-hidden shrink-0 py-2 relative z-50 bg-[#1c1c1c]">
        <div className="flex animate-[announcement-ticker_60s_linear_infinite] whitespace-nowrap">
          {[
            { venue: "Manor", result: "2026 Dates Booked in 90 Days" },
            { venue: "Waterloo Farms", result: "2 Weddings Booked in 7 Days" },
            { venue: "Atlantic Stables", result: "$15,000 in Booked Weddings in 30 Days" },
            { venue: "Retreat at Evans Farms", result: "258 Leads in 60 Days" },
            { venue: "Red Barn Acres", result: "9 Weddings Booked in 4 Months" },
            { venue: "Irongate Wedding Venue", result: "131 Leads in 60 Days" },
            { venue: "Manor", result: "2026 Dates Booked in 90 Days" },
            { venue: "Waterloo Farms", result: "2 Weddings Booked in 7 Days" },
            { venue: "Atlantic Stables", result: "$15,000 in Booked Weddings in 30 Days" },
            { venue: "Retreat at Evans Farms", result: "258 Leads in 60 Days" },
            { venue: "Red Barn Acres", result: "9 Weddings Booked in 4 Months" },
            { venue: "Irongate Wedding Venue", result: "131 Leads in 60 Days" },
          ].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center text-xs tracking-wide text-[rgba(250,250,250,0.8)]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <span>{item.venue}</span>
              <span className="font-bold ml-1.5">{item.result}</span>
              <span className="mx-4 text-[rgba(250,250,250,0.35)] select-none">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* NAV                                                             */}
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
          <PrimaryCTA size="md" label="Start Free Trial" />
        </nav>
      </header>

      {/* ============================================================== */}
      {/* 1. HERO                                                         */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-white">
        {/* Background — bride & groom in white barn venue, very light so
            text stays readable but the venue atmosphere comes through */}
        <Image
          src="/hero-wedding.jpg"
          alt=""
          aria-hidden
          fill
          priority
          className="absolute inset-0 object-cover object-center"
          sizes="100vw"
        />
        {/* Layered overlay: near-white left half (behind text), fades right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40" />
        {/* Gentle top-to-bottom vignette keeps everything clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-16 sm:pt-16 sm:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-6">

            {/* Hero pre-heading badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 border border-stone-200/80 px-3.5 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span
                className="text-[11px] font-semibold text-stone-700"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                The First And Only All-In-One Directory, Booking System, And Marketing Platform For Wedding Venues
              </span>
            </div>

            <h1
              className="mt-6 text-[38px] sm:text-[52px] md:text-[60px] leading-[1.05] text-stone-900"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Fully Book Your Wedding Venue<br />
              Without Empty Weekends.
            </h1>

            <p
              className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              StoryVenue combines a wedding venue directory, booking system, CRM, payments, proposals, Meta ads, concierge follow-up, and AI intelligence into one simple platform built to help venues find more couples, host more tours, and book more weddings.
            </p>

            {/* Pill-style CTA */}
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
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
              <p
                className="mt-3 text-[12px] text-stone-500 text-center"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                No contract. No down payment. No cancellation fees.
              </p>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <PhonePreview />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PAIN SECTION                                                 */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
            — The real problem
          </p>
          <h2
            className="mt-4 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Most Wedding Venues Do Not Have A Lead Problem. They Have A{" "}
            <span className="relative inline-block">
              Booking System Problem
              <svg
                aria-hidden
                viewBox="0 0 380 12"
                preserveAspectRatio="none"
                className="absolute left-0 -bottom-1 w-full h-2 text-rose-400"
              >
                <path
                  d="M2 8 C 80 2, 190 12, 290 4 S 370 8, 378 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h2>
          <div
            className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <p>
              You can have a beautiful venue, great photos, strong reviews, and still watch weekends sit empty. Not because brides are not looking. Because the moment they find you, the process starts leaking. They click your ad and land on a website that gives them too many options.
            </p>
            <p>
              They ask for pricing and wait too long for a response. They inquire, but nobody follows up enough. They tour, but never get a clear next step. They go quiet, and eventually book somewhere else. Most venues are trying to fix this by getting more leads. But more leads do not fix a broken booking process. They just create more missed opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. AGITATE SECTION                                              */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — The cost of doing nothing
            </p>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Every Bride Who Slips Away Is More Than A Missed Inquiry.
            </h2>
            <div
              className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <p>
                It is a missed tour. A missed proposal. A missed deposit. A missed wedding. A missed weekend on your calendar that you may never get back.
              </p>
              <p>
                And the hardest part is that most of these brides do not tell you why they disappeared. They just stop replying. They keep searching. They book a tour somewhere else.
              </p>
              <p className="font-medium text-stone-900">
                Then they sign with the venue that made the process feel easier, faster, and more personal. Not always the better venue. Not always the cheaper venue. The venue that followed up first, answered clearly, and made her feel confident.
              </p>
            </div>
          </div>

          {/* Visual: loss stack */}
          <div className="lg:col-span-5">
            <LossStack />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SOLUTION SECTION                                             */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
            — Meet StoryVenue
          </p>
          <h2
            className="mt-4 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08] max-w-4xl"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            The First And Only All-In-One Directory, Booking System, And Marketing Platform Built For Wedding Venues.
          </h2>

          <div
            className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <p>
              StoryVenue gives your venue one connected system to get found, capture inquiries, follow up fast, book tours, send proposals, collect payments, and manage every lead from first click to signed contract.
            </p>
            <p>
              No more disconnected tools. No more missed follow-ups. No more wondering where the lead went. No more relying on directories that send brides to every venue in your market.
            </p>
            <p className="font-semibold text-stone-900">
              StoryVenue was built for one thing: Helping wedding venues turn more brides into booked weddings.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. HOW IT WORKS — 7 numbered steps                             */}
      {/* ============================================================== */}
      <section id="how-it-works" className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — Process
            </p>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              How StoryVenue Turns Brides Into Booked Weddings.
            </h2>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_IT_WORKS_STEPS.map((s, i) => (
              <div
                key={s.step}
                className={`relative rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_-15px_rgba(0,0,0,0.14)] transition-all ${
                  i === 6 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span
                  className="text-[44px] leading-none text-stone-200 font-bold select-none"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {s.step}
                </span>
                <h3
                  className="mt-3 text-base font-bold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-[13.5px] text-stone-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <PrimaryCTA />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FEATURE CARDS                                                */}
      {/* ============================================================== */}
      <section id="features" className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl text-center mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — What you get
            </p>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Everything Your Venue Needs In One Place.
            </h2>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURE_CARDS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl bg-white border border-stone-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_32px_-15px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
                  <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </span>
                <h3
                  className="mt-4 text-[15px] font-bold text-stone-900"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {title}
                </h3>
                <p
                  className="mt-2 text-[13px] text-stone-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. NOT JUST SOFTWARE                                            */}
      {/* ============================================================== */}
      <section className="bg-stone-900 text-white py-20 sm:py-28 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, white 0px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 md:px-10 text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/50">
            — The bigger picture
          </p>
          <h2
            className="mt-4 text-3xl sm:text-4xl md:text-5xl leading-[1.08]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            This Is Not Just Software.
          </h2>
          <p
            className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            StoryVenue is a complete growth system for wedding venues. It helps your venue get seen by more brides. It helps every inquiry get followed up. It helps your team respond faster. It helps silent leads come back. It helps tours turn into signed weddings. And it helps your venue stop losing revenue in the gaps.
          </p>
          <div className="mt-8">
            <a
              href={TRIAL_HREF}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-stone-900 font-semibold px-6 py-3.5 text-[15px] hover:bg-stone-100 active:scale-[0.98] transition-all shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Start My 14-Day Free Trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. GUARANTEE SECTION                                            */}
      {/* ============================================================== */}
      <section id="guarantee" className="bg-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-8 sm:p-12 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="max-w-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 text-white mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
                — Risk free
              </p>
              <h2
                className="mt-4 text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Try StoryVenue Risk Free for 14-Days.
              </h2>
            </div>

            <div
              className="mt-8 space-y-4 text-stone-600 text-base leading-relaxed max-w-3xl"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <p>
                You should not have to gamble on another marketing tool, directory, agency, or software platform. You have probably already paid for things that promised more visibility, more leads, or more bookings. But visibility does not matter if the lead is not followed up. Leads do not matter if they never turn into tours. Tours do not matter if they never turn into signed weddings.
              </p>
              <p>
                StoryVenue was built to connect the full path from first click to booked wedding. That is why we back it with a simple guarantee. Go live with StoryVenue. Follow the process. Let us help you generate leads, follow up, and book more tours.
              </p>
              <p className="font-semibold text-stone-900">
                If we do not deliver the results we agreed to within your first 14 days, you do not pay.
              </p>
              <p>
                No long-term contract. No cancellation fees. No complicated fine print.
              </p>
              <p>Just a system built to help your venue book more weddings.</p>
            </div>

            <div className="mt-10 pt-10 border-t border-stone-200">
              <h3
                className="text-xl text-stone-900"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Our First Goal Is Simple.
              </h3>
              <div
                className="mt-4 space-y-3 text-stone-600 text-base leading-relaxed max-w-3xl"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <p>
                  Help you make your investment back. For many venues, just 1 to 2 extra weddings can cover the system for the entire year. That means the question is not: &ldquo;Can I afford StoryVenue?&rdquo;
                </p>
                <p className="font-semibold text-stone-900">
                  The better question is: &ldquo;How many more empty weekends can I afford without it?&rdquo;
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <PrimaryCTA />
                <p className="text-[13px] text-stone-500">
                  No contract. No down payment. No cancellation fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. FAQ SECTION                                                  */}
      {/* ============================================================== */}
      <section id="faq" className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — Frequently asked
            </p>
            <h2
              className="mt-4 text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="mt-12 divide-y divide-stone-200">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary
                  className="flex cursor-pointer items-start justify-between gap-4 list-none"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  <span className="text-[15px] font-semibold text-stone-900">
                    {item.q}
                  </span>
                  <ChevronDown className="mt-0.5 w-5 h-5 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
                </summary>
                <div
                  className="mt-4 text-[14px] text-stone-600 leading-relaxed space-y-3"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {item.a.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. FINAL CTA                                                   */}
      {/* ============================================================== */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <Image
          src="/hero-wedding.jpg"
          alt=""
          fill
          aria-hidden
          className="absolute inset-0 object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/90 via-stone-900/95 to-stone-900" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-10 py-24 sm:py-32 text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/50">
            — Your next step
          </p>
          <h2
            className="mt-4 text-3xl sm:text-5xl md:text-6xl leading-[1.05]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Stop Letting Brides Slip Through The Cracks.
          </h2>
          <div
            className="mt-7 space-y-4 text-white/75 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <p>
              You do not need another tool to manage. You need one system built to help your venue grow.
            </p>
            <p>
              StoryVenue helps your venue get found by more brides, capture more inquiries, follow up faster, book more tours, send proposals, collect payments, and manage the entire booking process from one place.
            </p>
            <p>
              Your listing can go live instantly. Your proposals and payment tools can be ready right away.
            </p>
            <p>
              And if your plan includes managed marketing, ads, landing pages, guide setup, or Concierge follow-up, our team will help install the full system behind your venue.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href={TRIAL_HREF}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-stone-900 font-semibold px-7 py-4 text-base shadow-[0_18px_45px_-12px_rgba(0,0,0,0.6)] hover:bg-stone-100 active:scale-[0.98] transition-all"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Start My 14-Day Free Trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <p className="mt-5 text-[12px] text-white/50">
            No contract. No down payment. No cancellation fees.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

/* ==================================================================== */
/*  Inline visual components                                             */
/* ==================================================================== */

/**
 * Phone preview that faithfully recreates the actual StoryVenue mobile
 * dashboard: header, 3 stat tiles, Quick Actions 2×4 grid, More list,
 * and bottom navigation — matching the provided app screenshot.
 */
function PhonePreview() {
  const quickActions = [
    { icon: Users, label: "Add Contact" },
    { icon: MessageSquare, label: "Make a Call" },
    { icon: Inbox, label: "New Message" },
    { icon: CreditCard, label: "New Payment" },
    { icon: FileSignature, label: "New Proposal" },
    { icon: CalendarDays, label: "Book Event" },
    { icon: Search, label: "Venue Listing" },
    { icon: Sparkles, label: "Ask AI" },
  ] as const;

  const moreItems = [
    { icon: BarChart3, label: "Marketing Analytics" },
    { icon: MessageSquare, label: "Help Center" },
    { icon: Shield, label: "Settings" },
  ] as const;

  return (
    <div className="relative flex justify-center">
      {/* Phone shell — proportioned to match real phone screenshot */}
      <div className="relative w-[300px] sm:w-[340px] rounded-[46px] bg-stone-900 p-[10px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)]">
        {/* Dynamic island */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[90px] h-[26px] rounded-full bg-stone-900 z-10" />

        {/* Screen */}
        <div className="relative w-full rounded-[38px] bg-[#f5f5f4] overflow-hidden">

          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-4 pb-1 text-[10px] font-semibold text-stone-800">
            <span>9:41</span>
            <span className="text-[9px] tracking-wide opacity-50">●●●●○</span>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#f5f5f4]">
            <Image
              src="/storyvenue-dark-logo.png"
              alt="StoryVenue"
              width={110}
              height={26}
              className="h-5 w-auto object-contain"
            />
            <div className="flex items-center gap-3">
              <ArrowRight className="w-4 h-4 text-stone-600 rotate-[0deg]" />
              <div className="flex flex-col gap-[3px]">
                <span className="block w-4 h-[1.5px] bg-stone-800 rounded" />
                <span className="block w-4 h-[1.5px] bg-stone-800 rounded" />
                <span className="block w-4 h-[1.5px] bg-stone-800 rounded" />
              </div>
            </div>
          </div>

          {/* Greeting */}
          <div className="px-5 pb-3 bg-[#f5f5f4]">
            <h2 className="text-[22px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "var(--font-open-sans)" }}>
              Good day
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">Here&apos;s what&apos;s happening at your venue.</p>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-2 px-4 pb-4 bg-[#f5f5f4]">
            {[
              { icon: "✉", value: "0", label: "UNREAD", iconBg: "bg-rose-100", iconColor: "text-rose-500" },
              { icon: "✉", value: "0", label: "NEW LEADS", iconBg: "bg-orange-100", iconColor: "text-orange-500" },
              { icon: "▦", value: "0", label: "TODAY", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
            ].map((t) => (
              <div key={t.label} className="rounded-2xl bg-white border border-stone-200/60 p-3 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full ${t.iconBg}`}>
                  <span className={`text-sm ${t.iconColor}`}>{t.icon}</span>
                </div>
                <p className="text-[16px] font-bold text-stone-900 leading-none" style={{ fontFamily: "var(--font-open-sans)" }}>{t.value}</p>
                <p className="mt-0.5 text-[8px] font-semibold tracking-[0.14em] text-stone-400 uppercase">{t.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-5 pb-4 bg-white">
            <p className="pt-4 pb-3 text-[13px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>
              Quick Actions
            </p>
            <div className="grid grid-cols-4 gap-y-4">
              {quickActions.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 border border-stone-200/80">
                    <Icon className="w-5 h-5 text-stone-700" />
                  </div>
                  <span className="text-center text-[9px] text-stone-600 leading-tight max-w-[52px]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* More section */}
          <div className="px-5 pb-4 bg-white border-t border-stone-100">
            <p className="pt-4 pb-2 text-[13px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>More</p>
            <div className="rounded-2xl bg-stone-50 border border-stone-200/60 divide-y divide-stone-200/60 overflow-hidden">
              {moreItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-stone-500" />
                    <span className="text-[12px] font-medium text-stone-800">{label}</span>
                  </div>
                  <ChevronDown className="-rotate-90 w-3.5 h-3.5 text-stone-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="bg-white border-t border-stone-200/80 grid grid-cols-5 px-2 pt-2 pb-4">
            {[
              { icon: "⌂", label: "Home", active: true },
              { icon: "◯", label: "Messages" },
              { icon: "⬡", label: "Leads" },
              { icon: "▦", label: "Calendar" },
              { icon: "▭", label: "Payments" },
            ].map((n) => (
              <div key={n.label} className="flex flex-col items-center gap-0.5">
                <span className={`text-sm ${n.active ? "text-stone-900" : "text-stone-400"}`}>{n.icon}</span>
                <span className={`text-[9px] ${n.active ? "font-bold text-stone-900" : "text-stone-400"}`}>{n.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating + FAB that shows in the screenshot */}
      <div className="absolute bottom-[52px] right-[-8px] sm:right-[-16px] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white text-xl font-light shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]">
        +
      </div>
    </div>
  );
}

/**
 * Visual for the Agitate section — a stack of "missed" event tiles
 * showing the compounding cost of a dropped lead.
 */
function LossStack() {
  const items = [
    { label: "Missed inquiry", sub: "She never got a reply", tone: "border-stone-200 bg-white" },
    { label: "Missed tour", sub: "She booked with a competitor", tone: "border-rose-100 bg-rose-50/70" },
    { label: "Missed proposal", sub: "$12,000 never sent", tone: "border-rose-200 bg-rose-50" },
    { label: "Missed deposit", sub: "Weekend still open", tone: "border-rose-300 bg-rose-100/80" },
    { label: "Empty weekend", sub: "Revenue gone", tone: "border-rose-400 bg-rose-100" },
  ];

  return (
    <div className="relative flex flex-col gap-3 max-w-xs mx-auto">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${item.tone}`}
          style={{ marginLeft: `${i * 6}px` }}
        >
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-stone-200">
            <span className="text-[11px] font-bold text-stone-400">{i + 1}</span>
          </span>
          <div>
            <p className="text-[13px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>
              {item.label}
            </p>
            <p className="text-[12px] text-stone-500">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
