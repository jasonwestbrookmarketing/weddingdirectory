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
  Check,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import HighlighterText from "@/components/marketing/HighlighterText";
import LossStack from "@/components/marketing/LossStack";
import DashboardMockup from "@/components/marketing/DashboardMockup";
import ProcessTimeline from "@/components/marketing/ProcessTimeline";
import PhonePreview from "@/components/marketing/PhonePreview";

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
      {/* STICKY SHELL — ticker + nav scroll together as one unit         */}
      {/* ============================================================== */}
      <div className="sticky top-0 z-40">
        {/* TICKER — matches deck.storyvenuemarketing.com exactly */}
        <div className="w-full overflow-hidden shrink-0 py-2 bg-[#1c1c1c]">
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

        {/* NAV */}
        <header className="bg-white/75 backdrop-blur-md border-b border-white/20">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
            <Link href="/" aria-label="StoryVenue home" className="shrink-0">
              <Image
                src="/storyvenue-dark-logo.png"
                alt="StoryVenue"
                width={185}
                height={44}
                className="h-11 w-auto object-contain"
                priority
              />
            </Link>
            <PrimaryCTA size="md" label="Start Free Trial" />
          </nav>
        </header>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO                                                         */}
      {/* ============================================================== */}
      {/*
        * Hero — 3:2 image (4992×3744) displayed with object-cover object-center.
        * Two gradient overlays fade the left and right edges to white so text
        * and phone graphic stay crisp on both sides.
        */}
      <section
        className="relative overflow-hidden flex items-center -mt-[92px]"
        style={{ height: "min(56.25vw, 1080px)", minHeight: "520px" }}
      >
        <Image
          src="/hero-wedding-couple.jpg"
          alt=""
          aria-hidden
          fill
          priority
          unoptimized
          placeholder="empty"
          className="absolute inset-0 object-cover object-center"
          sizes="100vw"
        />
        {/* Left fade — white to transparent */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 pointer-events-none z-[1]"
          style={{ background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0) 100%)" }}
        />
        {/* Right fade — transparent to white */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 pointer-events-none z-[1]"
          style={{ background: "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0) 100%)" }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-36 pb-16 sm:pb-20 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7">
            <h1
              className="text-[32px] sm:text-[40px] md:text-[46px] lg:text-[50px] leading-[1.08] text-stone-900 whitespace-nowrap"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              <span className="block">Fully Book Your Wedding Venue</span>
              <span className="block">Without Empty Weekends</span>
            </h1>

            <p
              className="mt-5 text-base sm:text-[17px] text-stone-700 leading-relaxed max-w-md"
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
                No contracts. No down payments. No cancelation fees.
              </p>

              {/* Google Reviews social proof */}
              <div className="mt-5 flex items-center gap-3">
                {/* Overlapping avatar circles */}
                <div className="flex -space-x-2.5 shrink-0">
                  {["/avatars/av1.jpg", "/avatars/av2.jpg", "/avatars/av3.jpg"].map((src, i) => (
                    <div key={i} className="relative w-9 h-9 rounded-full border-2 border-white overflow-hidden" style={{ zIndex: 3 - i }}>
                      <Image src={src} alt="" fill unoptimized placeholder="empty" className="object-cover object-top" sizes="36px" />
                    </div>
                  ))}
                </div>
                {/* Stars + label */}
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="#1c1917"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5" style={{ fontFamily: "var(--font-open-sans)" }}>Google Reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — phone mockup over the image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end lg:items-end">
            <PhonePreview />
          </div>
        </div>
      </section>


      {/* ============================================================== */}
      {/* 1b. LOGO STRIP — social proof                                  */}
      {/* ============================================================== */}
      <div className="bg-stone-50/70 py-6 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between gap-6 flex-nowrap">
            {[
              { src: "/logos/arbor.png",       alt: "Arbor at the Port",          h: 36 },
              { src: "/logos/vista.png",       alt: "Vista on the Docks",         h: 34 },
              { src: "/logos/bogart.png",      alt: "Bogart House",               h: 52 },
              { src: "/logos/pinetree.png",    alt: "The Pinetree",               h: 44 },
              { src: "/logos/rachel.png",      alt: "Rachel Marie Events & Co.",  h: 44 },
              { src: "/logos/waterloo.png",    alt: "Waterloo Farms",             h: 48 },
              { src: "/logos/white-pine.png",  alt: "White Pine Manor",           h: 48 },
              { src: "/logos/willowcreek.png", alt: "Willow Creek",               h: 40 },
              { src: "/logos/atlantic.png",    alt: "Atlantic Stables",           h: 44 },
            ].map(({ src, alt, h }) => (
              <div key={src} className="shrink-0 flex items-center justify-center">
                <Image
                  src={src}
                  alt={alt}
                  width={160}
                  height={h}
                  unoptimized
                  placeholder="empty"
                  className="w-auto object-contain"
                  style={{
                    height: h,
                    maxWidth: 140,
                    filter: "brightness(0) invert(0) sepia(0) saturate(0) hue-rotate(0deg) brightness(0.11)",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

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
            <HighlighterText>Booking System Problem</HighlighterText>.
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
      <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left — copy */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
                — Meet StoryVenue
              </p>
              <h2
                className="mt-4 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                The First And Only All-In-One Directory, Booking System, And Marketing Platform Built For Wedding Venues.
              </h2>

              <div
                className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
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

            {/* Right — dashboard mockup */}
            <div className="pr-4">
              <DashboardMockup />
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. HOW IT WORKS — horizontal snake timeline                   */}
      {/* ============================================================== */}
      <section id="how-it-works" className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mb-14">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              — Process
            </p>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              How StoryVenue Turns Brides Into Booked Weddings.
            </h2>
            <p
              className="mt-5 text-base text-stone-500 leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Seven steps. One connected system. From first click to signed contract.
            </p>
          </div>

          <ProcessTimeline />

          <div className="mt-14 flex justify-center">
            <PrimaryCTA />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FEATURE SPOTLIGHTS — alternating layout                     */}
      {/* ============================================================== */}
      <div id="features">
        {/* Section heading */}
        <div className="bg-stone-50/70 border-y border-stone-200/60 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">
              What you get
            </p>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Everything Your Venue Needs In One Place.
            </h2>
          </div>
        </div>

        {/* 1. Directory — text left, phone right */}
        <section className="bg-white py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">— Directory</p>
              <h3
                className="mt-4 text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Get Found by Couples Searching for Venues
              </h3>
              <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed" style={{ fontFamily: "var(--font-open-sans)" }}>
                Get your venue in front of couples actively searching for their perfect wedding venue. Your StoryVenue Directory listing helps brides discover your space, view your photos, see your reviews, check your details, and inquire directly.
              </p>
              <p className="mt-5 text-[15px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>
                More visibility. More inquiries. More chances to book the wedding.
              </p>
              <div className="mt-7">
                <PrimaryCTA label="Start Free Trial" size="md" />
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <PhonePreview
                screenshotSrc="/phone-directory-listing.png"
                trimBottom={36}
                badgeLabel="New inquiry received"
                badgeDetail="Red Barn Acres · Just now"
              />
            </div>
          </div>
        </section>

        {/* 2. Proposals + Payments — phone left, text right */}
        <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
          <div className="max-w-5xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <PhonePreview
                screenshotSrc="/phone-proposals.png"
                badgeLabel="Proposal sent"
                badgeDetail="Sophie + Will · Signed ✓"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">— Proposals + Payments</p>
              <h3
                className="mt-4 text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Send Proposals and Get Paid Online
              </h3>
              <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed" style={{ fontFamily: "var(--font-open-sans)" }}>
                Send branded proposals couples can review, sign, and pay from any device. Collect deposits, invoices, balances, and payment plans online while keeping the booking process simple, professional, and easy to complete.
              </p>
              <p className="mt-5 text-[15px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>
                Faster signatures. Faster deposits. Less chasing payments.
              </p>
              <div className="mt-7">
                <PrimaryCTA label="Start Free Trial" size="md" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Leads Into Tours — text left, phone right */}
        <section className="bg-white py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">— Leads Into Tours</p>
              <h3
                className="mt-4 text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Turn More Inquiries Into Booked Tours
              </h3>
              <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed" style={{ fontFamily: "var(--font-open-sans)" }}>
                Every inquiry goes into a clear booking process with follow-up, pipeline tracking, SMS, email, AI Concierge, and organized conversations so more brides move from interested to tour booked.
              </p>
              <p className="mt-5 text-[15px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>
                Fewer missed leads. More conversations. More tours on your calendar.
              </p>
              <div className="mt-7">
                <PrimaryCTA label="Start Free Trial" size="md" />
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <PhonePreview
                screenshotSrc="/phone-leads.png"
                badgeLabel="New lead added"
                badgeDetail="Jonathan Bodnar · Just now"
              />
            </div>
          </div>
        </section>

        {/* 4. Run Venue From One Place — phone left, text right */}
        <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
          <div className="max-w-5xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <PhonePreview
                screenshotSrc="/phone-venue.png"
                badgeLabel="Venue live"
                badgeDetail="All systems running ✓"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">— Venue Management</p>
              <h3
                className="mt-4 text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Run Your Venue From One Place
              </h3>
              <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed" style={{ fontFamily: "var(--font-open-sans)" }}>
                Manage leads, conversations, tours, calendars, proposals, payments, documents, reports, and your team inside one connected system built specifically for wedding venues.
              </p>
              <p className="mt-5 text-[15px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>
                Less chaos. More control. One system for your entire booking process.
              </p>
              <div className="mt-7">
                <PrimaryCTA label="Start Free Trial" size="md" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature cards grid */}
        <section className="bg-white py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-2xl mb-12">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-500">— Full feature list</p>
              <h2
                className="mt-4 text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Every Tool Your Venue Needs, Built Into One Platform.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {FEATURE_CARDS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group rounded-2xl bg-stone-50 border border-stone-200/80 p-5 hover:shadow-[0_14px_32px_-15px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>
                    {title}
                  </h3>
                  <p className="mt-2 text-[13px] text-stone-600 leading-relaxed" style={{ fontFamily: "var(--font-open-sans)" }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================== */}
      {/* 7. NOT JUST SOFTWARE                                            */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden text-white">
        {/* Background image — rendered raw, no overlay, no optimization */}
        <Image
          src="/not-just-software-bg.png"
          alt=""
          aria-hidden
          fill
          unoptimized
          placeholder="empty"
          className="absolute inset-0 object-cover object-center"
          sizes="100vw"
        />

        {/* Content — sits as a separate layer above the image */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-10 py-24 sm:py-32">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="block h-px w-8 bg-white/40" />
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/60">
              The Bigger Picture
            </p>
            <span className="block h-px w-8 bg-white/40" />
          </div>

          {/* Heading */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl leading-[1.06] max-w-3xl"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            This Is Not Just Software.
          </h2>

          {/* Body — max-w-sm forces exactly 3 lines */}
          <p
            className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl text-center"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            StoryVenue is a complete growth system for wedding venues. It helps venues get seen by more brides, follow up faster, book more tours, and turn more inquiries into booked weddings.
          </p>

          {/* CTA */}
          <div className="mt-9">
            <a
              href={TRIAL_HREF}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-stone-900 font-semibold px-7 py-3.5 text-[15px] hover:bg-stone-100 active:scale-[0.98] transition-all shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Start My 14-Day Free Trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Four benefit pills */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: Users,         label: "More Brides"      },
              { icon: MessageSquare, label: "Faster Follow-Up" },
              { icon: CalendarDays,  label: "More Tours"       },
              { icon: CalendarCheck, label: "More Bookings"    },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <Icon className="w-3.5 h-3.5 text-white/70" />
                <span className="text-[13px] text-white/90 font-medium">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. PRICING PLANS                                               */}
      {/* ============================================================== */}
      <section id="pricing" className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* Heading */}
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              StoryVenue Plans
            </h2>
            <p className="mt-3 text-[14px] text-stone-500" style={{ fontFamily: "var(--font-open-sans)" }}>
              14-day free trial. No down payment. No contracts. No cancellation fees.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">

            {/* All-Inclusive — MOST POPULAR */}
            <div className="relative rounded-2xl border-2 border-stone-900 bg-white p-7 flex flex-col shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25),0_8px_24px_-8px_rgba(0,0,0,0.15)] -translate-y-1">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-stone-900 text-white text-[10px] font-bold tracking-[0.16em] uppercase px-3 py-1" style={{ fontFamily: "var(--font-open-sans)" }}>
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mt-2" style={{ fontFamily: "var(--font-open-sans)" }}>All-Inclusive</h3>
              <p className="text-[13px] text-stone-500 mt-0.5 italic" style={{ fontFamily: "var(--font-open-sans)" }}>We fill your calendar. You host.</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>$1,499</span>
                <span className="text-[13px] text-stone-500" style={{ fontFamily: "var(--font-open-sans)" }}>/mo</span>
              </div>
              <ul className="mt-5 space-y-2.5 flex-1" style={{ fontFamily: "var(--font-open-sans)" }}>
                {[
                  { text: "Everything in Booking System, plus:", bold: true },
                  { text: "Venue Concierge: our team personally works your leads" },
                  { text: "Every bride followed up without you lifting a finger" },
                  { text: "Leads re-engaged for months automatically" },
                  { text: "Nothing falls through the cracks. Ever." },
                  { text: "Verified and Sponsored badges included" },
                ].map(({ text, bold }, i) => (
                  <li key={i} className={`flex items-start gap-2 text-[13px] leading-snug ${bold ? "font-semibold text-stone-900" : "text-stone-600"}`}>
                    <Check className="mt-[1px] shrink-0 w-3.5 h-3.5" style={{ color: "#10b981" }} strokeWidth={2.5} />
                    {text}
                  </li>
                ))}
              </ul>
              <a
                href={TRIAL_HREF}
                className="mt-7 w-full inline-flex items-center justify-center rounded-xl bg-stone-900 text-white text-[14px] font-semibold px-5 py-3 hover:bg-stone-800 transition-colors"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Start 14-day trial
              </a>
            </div>

            {/* Booking System */}
            <div className="rounded-2xl border border-stone-200 bg-white px-7 py-5 flex flex-col my-4">
              <h3 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>Booking System</h3>
              <p className="text-[13px] text-stone-500 mt-0.5 italic" style={{ fontFamily: "var(--font-open-sans)" }}>We bring the brides. You close them.</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>$999</span>
                <span className="text-[13px] text-stone-500" style={{ fontFamily: "var(--font-open-sans)" }}>/mo</span>
              </div>
              <ul className="mt-5 space-y-2.5 flex-1" style={{ fontFamily: "var(--font-open-sans)" }}>
                {[
                  { text: "Everything in Venue Pro, plus:", bold: true },
                  { text: "Managed Meta ads so brides come to you" },
                  { text: "Tour-ready leads in your pipeline daily" },
                  { text: "Verified badge included" },
                  { text: "You handle the follow-up" },
                ].map(({ text, bold }, i) => (
                  <li key={i} className={`flex items-start gap-2 text-[13px] leading-snug ${bold ? "font-semibold text-stone-900" : "text-stone-600"}`}>
                    <Check className="mt-[1px] shrink-0 w-3.5 h-3.5" style={{ color: "#10b981" }} strokeWidth={2.5} />
                    {text}
                  </li>
                ))}
              </ul>
              <a
                href={TRIAL_HREF}
                className="mt-7 w-full inline-flex items-center justify-center rounded-xl border border-stone-300 text-stone-900 text-[14px] font-semibold px-5 py-3 hover:bg-stone-50 transition-colors"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Start 14-day trial
              </a>
            </div>

            {/* Venue Pro */}
            <div className="rounded-2xl border border-stone-200 bg-white px-7 py-5 flex flex-col my-4">
              <h3 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>Venue Pro</h3>
              <p className="text-[13px] text-stone-500 mt-0.5 italic" style={{ fontFamily: "var(--font-open-sans)" }}>Run your venue like a business.</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>$299</span>
                <span className="text-[13px] text-stone-500" style={{ fontFamily: "var(--font-open-sans)" }}>/mo</span>
              </div>
              <ul className="mt-5 space-y-2.5 flex-1" style={{ fontFamily: "var(--font-open-sans)" }}>
                {[
                  { text: "Everything in Free, plus:", bold: true },
                  { text: "Full lead pipeline so no inquiry gets lost" },
                  { text: "Marketing Automations so follow-up runs without you" },
                  { text: "Every message in one inbox" },
                  { text: "Calendar with conflict detection so you never double-book" },
                  { text: "Revenue reports so you know where you stand" },
                ].map(({ text, bold }, i) => (
                  <li key={i} className={`flex items-start gap-2 text-[13px] leading-snug ${bold ? "font-semibold text-stone-900" : "text-stone-600"}`}>
                    <Check className="mt-[1px] shrink-0 w-3.5 h-3.5" style={{ color: "#10b981" }} strokeWidth={2.5} />
                    {text}
                  </li>
                ))}
              </ul>
              <a
                href={TRIAL_HREF}
                className="mt-7 w-full inline-flex items-center justify-center rounded-xl border border-stone-300 text-stone-900 text-[14px] font-semibold px-5 py-3 hover:bg-stone-50 transition-colors"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Start 14-day trial
              </a>
            </div>

            {/* Free */}
            <div className="rounded-2xl border border-stone-200 bg-white px-7 py-5 flex flex-col my-4">
              <h3 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>Free</h3>
              <p className="text-[13px] text-stone-500 mt-0.5 italic" style={{ fontFamily: "var(--font-open-sans)" }}>Get listed. Get paid.</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>$0</span>
                <span className="text-[13px] text-stone-500" style={{ fontFamily: "var(--font-open-sans)" }}>/mo</span>
              </div>
              <ul className="mt-5 space-y-2.5 flex-1" style={{ fontFamily: "var(--font-open-sans)" }}>
                {[
                  "Directory listing couples actually find",
                  "Proposals with e-signatures built in",
                  "Built-in payments. 0% processing fees. You keep 100%.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-stone-600 leading-snug">
                    <Check className="mt-[1px] shrink-0 w-3.5 h-3.5" style={{ color: "#10b981" }} strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={TRIAL_HREF}
                className="mt-7 w-full inline-flex items-center justify-center rounded-xl border border-stone-300 text-stone-900 text-[14px] font-semibold px-5 py-3 hover:bg-stone-50 transition-colors"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Start for free
              </a>
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
        {/* Background image — rendered raw, no opacity, no gradient on top */}
        <Image
          src="/your-next-step-bg.png"
          alt=""
          aria-hidden
          fill
          unoptimized
          placeholder="empty"
          className="absolute inset-0 object-cover object-center"
          sizes="100vw"
        />

        {/* Content layer above the image */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pt-52 pb-24 sm:pt-64 sm:pb-32 text-center">
          <h2
            className="text-3xl sm:text-5xl md:text-6xl leading-[1.05] whitespace-nowrap"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Stop Letting Brides Slip Through The Cracks
          </h2>
          <p
            className="mt-5 text-lg sm:text-xl font-semibold text-white"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Try StoryVenue Free for 14 Days
          </p>
          <p
            className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            StoryVenue helps your venue get found by more brides, capture more inquiries, follow up faster, book more tours, send proposals, collect payments, and manage the entire booking process from one place.
          </p>

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
            No contracts. No down payments. No cancellation fees.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

/* ==================================================================== */
/*  PhonePreview is now in @/components/marketing/PhonePreview.tsx       */
/* ==================================================================== */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _deletedPhonePreview() {
  const notifications = [
    {
      type: "booked",
      icon: CalendarCheck,
      iconBg: "bg-emerald-500",
      title: "Wedding Booked!",
      body: "Emma + Jordan · Oct 12, 2026",
      detail: "$9,800 deposit received",
      time: "Just now",
      badge: "BOOKED",
      badgeTone: "bg-emerald-50 text-emerald-700",
    },
    {
      type: "tour",
      icon: CalendarDays,
      iconBg: "bg-amber-500",
      title: "Tour Confirmed",
      body: "Lauren + Mark · Sat, Nov 8",
      detail: "2:00 PM · White barn tour",
      time: "3m ago",
      badge: "TOUR",
      badgeTone: "bg-amber-50 text-amber-700",
    },
    {
      type: "signed",
      icon: FileSignature,
      iconBg: "bg-emerald-500",
      title: "Proposal Signed",
      body: "Sophie + Will · Sept 20, 2026",
      detail: "$12,400 · Contract signed",
      time: "11m ago",
      badge: "SIGNED",
      badgeTone: "bg-emerald-50 text-emerald-700",
    },
    {
      type: "payment",
      icon: CreditCard,
      iconBg: "bg-stone-900",
      title: "Deposit Received",
      body: "Mia + Jack · Aug 14, 2026",
      detail: "$2,500 · Final payment pending",
      time: "28m ago",
      badge: "PAID",
      badgeTone: "bg-stone-100 text-stone-700",
    },
    {
      type: "booked",
      icon: CalendarCheck,
      iconBg: "bg-emerald-500",
      title: "Wedding Booked!",
      body: "Olivia + Ryan · July 19, 2026",
      detail: "$11,200 · All dates confirmed",
      time: "1h ago",
      badge: "BOOKED",
      badgeTone: "bg-emerald-50 text-emerald-700",
    },
    {
      type: "tour",
      icon: CalendarDays,
      iconBg: "bg-amber-500",
      title: "Tour Confirmed",
      body: "Hannah + Cole · Sun, Nov 9",
      detail: "11:00 AM · Private tour",
      time: "2h ago",
      badge: "TOUR",
      badgeTone: "bg-amber-50 text-amber-700",
    },
    {
      type: "signed",
      icon: FileSignature,
      iconBg: "bg-emerald-500",
      title: "Proposal Signed",
      body: "Bella + Alex · June 7, 2026",
      detail: "$8,900 · E-signature complete",
      time: "3h ago",
      badge: "SIGNED",
      badgeTone: "bg-emerald-50 text-emerald-700",
    },
    {
      type: "booked",
      icon: CalendarCheck,
      iconBg: "bg-emerald-500",
      title: "Wedding Booked!",
      body: "Ava + James · May 2, 2026",
      detail: "$13,500 · Fully confirmed",
      time: "5h ago",
      badge: "BOOKED",
      badgeTone: "bg-emerald-50 text-emerald-700",
    },
  ] as const;

  return (
    <div className="relative flex justify-center">
      {/* Floating tile — top left */}
      <div className="absolute -top-3 -left-4 sm:-left-8 z-20 rounded-2xl bg-white border border-stone-200 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.22)] px-3.5 py-2.5 flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CalendarCheck className="w-4 h-4" />
        </span>
        <div>
          <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-stone-500">Weekend booked</p>
          <p className="text-[12px] font-bold text-stone-900 leading-none mt-0.5" style={{ fontFamily: "var(--font-open-sans)" }}>
            Oct 12, 2026 ✓
          </p>
        </div>
      </div>

      {/* Phone shell — iPhone 15 Pro aspect ratio (390 × 844) */}
      <div
        className="relative rounded-[44px] bg-stone-900 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.55)]"
        style={{ width: "300px", aspectRatio: "390/844", padding: "10px" }}
      >
        {/* Dynamic island */}
        <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-[80px] h-[24px] rounded-full bg-stone-900 z-10" />

        {/* Screen — fills full phone height */}
        <div className="absolute inset-[10px] rounded-[36px] bg-[#f5f5f4] overflow-hidden flex flex-col">

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-1 text-[10px] font-semibold text-stone-800 shrink-0">
            <span>9:41</span>
            <span className="text-[9px] tracking-wide opacity-50">●●●●○</span>
          </div>

          {/* Screen header */}
          <div className="px-4 pt-1 pb-2 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[15px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "var(--font-open-sans)" }}>
                Activity
              </p>
              <p className="text-[10px] text-stone-500">The Barn at New Albany · Live</p>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_2px_rgba(16,185,129,0.4)]" />
          </div>

          {/* Revenue banner */}
          <div className="mx-3 mb-2.5 rounded-2xl bg-stone-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[8px] uppercase tracking-[0.16em] text-white/60">Booked Revenue</p>
              <p className="text-[19px] font-bold leading-tight" style={{ fontFamily: "var(--font-open-sans)" }}>$128,400</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-white/60">Weekends filled</p>
              <p className="text-[17px] font-bold" style={{ fontFamily: "var(--font-open-sans)" }}>34 / 36</p>
            </div>
          </div>

          {/* Notification feed — fills remaining height, cards clip at bottom */}
          <div className="px-3 pb-3 space-y-2 flex-1 overflow-hidden">
            {notifications.map((n, i) => {
              const Icon = n.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-2xl bg-white border border-stone-200/60 px-3 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
                >
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.iconBg}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] font-bold text-stone-900 truncate" style={{ fontFamily: "var(--font-open-sans)" }}>
                        {n.title}
                      </p>
                      <span className="text-[9px] text-stone-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-stone-700 truncate">{n.body}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[8px] font-bold tracking-wide ${n.badgeTone}`}>
                        {n.badge}
                      </span>
                      <p className="text-[10px] text-stone-500 truncate">{n.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

