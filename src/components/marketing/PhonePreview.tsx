import Image from "next/image";
import {
  CalendarCheck,
  CalendarDays,
  FileSignature,
  CreditCard,
} from "lucide-react";

const notifications = [
  {
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

interface PhonePreviewProps {
  screenshotSrc?: string;
  /** Natural pixel width of the screenshot (used for aspect ratio) */
  screenshotW?: number;
  /** Natural pixel height of the screenshot (used for aspect ratio) */
  screenshotH?: number;
  badgeLabel?: string;
  badgeDetail?: string;
}

export default function PhonePreview({
  screenshotSrc,
  screenshotW = 644,
  screenshotH = 1024,
  badgeLabel = "Weekend booked",
  badgeDetail = "Oct 12, 2026 ✓",
}: PhonePreviewProps) {
  return (
    <div className="relative flex justify-center">
      {/* Floating badge */}
      <div className="absolute -top-3 -left-4 sm:-left-8 z-20 rounded-2xl bg-white border border-stone-200 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.22)] px-3.5 py-2.5 flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CalendarCheck className="w-4 h-4" />
        </span>
        <div>
          <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-stone-500">{badgeLabel}</p>
          <p className="text-[12px] font-bold text-stone-900 leading-none mt-0.5" style={{ fontFamily: "var(--font-open-sans)" }}>
            {badgeDetail}
          </p>
        </div>
      </div>

      {screenshotSrc ? (
        /*
         * Screenshot mode — phone height is determined by the image's natural
         * aspect ratio so nothing is ever cropped or side-clipped.
         * Bezel: 10px sides, 48px top (room for dynamic island), 20px bottom.
         */
        <div
          className="relative rounded-[44px] bg-stone-900 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.55)]"
          style={{ width: "280px", padding: "48px 10px 20px" }}
        >
          {/* Dynamic island */}
          <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-[80px] h-[24px] rounded-full bg-stone-900 z-10" />

          {/* Screen — image fills at natural aspect ratio, zero crop */}
          <div className="rounded-[28px] overflow-hidden bg-white">
            <Image
              src={screenshotSrc}
              alt=""
              width={screenshotW}
              height={screenshotH}
              unoptimized
              placeholder="empty"
              className="w-full h-auto block"
              sizes="260px"
            />
          </div>

          {/* Home indicator */}
          <div className="mt-3 flex justify-center">
            <div className="w-20 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      ) : (
        /*
         * Activity-feed mode — original fixed aspect-ratio phone shell.
         */
        <div
          className="relative rounded-[44px] bg-stone-900 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.55)]"
          style={{ width: "300px", aspectRatio: "390/844", padding: "10px" }}
        >
          {/* Dynamic island */}
          <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-[80px] h-[24px] rounded-full bg-stone-900 z-10" />

          {/* Screen */}
          <div className="absolute inset-[10px] rounded-[36px] overflow-hidden flex flex-col bg-[#f5f5f4]">
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

            {/* Notification feed */}
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
      )}
    </div>
  );
}
