"use client";

import { useEffect, useRef, useState } from "react";
import {
  TrendingUp, CalendarCheck, Users,
  Sparkles, LayoutDashboard, MessageSquare, Calendar,
  Inbox, Image as ImageIcon, BarChart3, Zap, HelpCircle,
  Building2, CreditCard, Megaphone, Settings, CircleUser,
  LifeBuoy, LogOut, ChevronDown,
} from "lucide-react";

const BADGES = [
  { icon: CalendarCheck, iconColor: "text-emerald-600", iconBg: "bg-emerald-50", label: "Weddings Booked", value: "34", sub: "Last 90 days", delay: 480 },
  { icon: TrendingUp,    iconColor: "text-violet-600",  iconBg: "bg-violet-50",  label: "Revenue Growth",  value: "+654%", sub: "vs prior period", delay: 680 },
  { icon: Users,         iconColor: "text-amber-600",   iconBg: "bg-amber-50",   label: "Leads Captured",  value: "258",   sub: "In 60 days",      delay: 880 },
] as const;

export default function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { setActive(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0)" : "translateX(48px)",
        transition: "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity, transform",
      }}
    >
      {/* Browser chrome */}
      <div className="rounded-xl overflow-hidden shadow-[0_40px_100px_-24px_rgba(0,0,0,0.22)] border border-stone-200/80">
        <div className="bg-stone-50 border-b border-stone-200/80 px-3 py-1.5 flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white border border-stone-200/80 rounded-md px-2.5 py-0.5 flex items-center gap-1.5 w-44">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[10px] text-stone-400 truncate" style={{ fontFamily: "ui-monospace, monospace" }}>
                app.storyvenue.com
              </span>
            </div>
          </div>
        </div>
        {/* 16:9 clipping wrapper */}
        <div className="aspect-video overflow-hidden">
          <DashboardScreen />
        </div>
      </div>

      {/* Floating stat badges */}
      {BADGES.map((badge, i) => {
        const Icon = badge.icon;
        const positions = ["absolute -top-4 -right-5", "absolute top-1/2 -right-7 -translate-y-1/2", "absolute -bottom-4 -right-5"];
        return (
          <div
            key={badge.label}
            className={`${positions[i]} bg-white rounded-2xl border border-stone-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] px-3 py-2 flex items-center gap-2 min-w-[136px]`}
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateX(0) scale(1)" : "translateX(16px) scale(0.9)",
              transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.34,1.56,0.64,1)",
              transitionDelay: `${badge.delay}ms`,
              willChange: "opacity, transform",
            }}
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${badge.iconBg}`}>
              <Icon className={`w-3.5 h-3.5 ${badge.iconColor}`} />
            </span>
            <div>
              <p className="text-[9px] text-stone-500 leading-none">{badge.label}</p>
              <p className="text-[14px] font-bold text-stone-900 leading-tight mt-0.5" style={{ fontFamily: "var(--font-open-sans)" }}>{badge.value}</p>
              <p className="text-[8px] text-stone-400 leading-none mt-0.5">{badge.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard screen — 16:9, full sidebar matching the real app        */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { icon: Sparkles,         label: "Ask AI" },
  { icon: LayoutDashboard,  label: "Home",          active: true },
  { icon: Users,            label: "Contacts" },
  { icon: MessageSquare,    label: "Conversations" },
  { icon: Calendar,         label: "Calendar" },
  { icon: Inbox,            label: "Leads" },
  { icon: ImageIcon,        label: "Media" },
  { icon: BarChart3,        label: "Reports" },
  { icon: Zap,              label: "What's New" },
  { icon: HelpCircle,       label: "Help Center" },
  { icon: Building2,        label: "Venue listing", expandable: true },
  { icon: CreditCard,       label: "Payments",      expandable: true },
  { icon: Megaphone,        label: "Marketing",     expandable: true },
  { icon: Settings,         label: "Settings",      expandable: true },
] as const;

const BOTTOM_ITEMS = [
  { icon: CircleUser, label: "My Profile" },
  { icon: LifeBuoy,   label: "Support" },
  { icon: LogOut,     label: "Logout" },
] as const;

function DashboardScreen() {
  const stats = [
    { label: "LEADS",           value: "47",       trend: "+312%", color: "#ec4899" },
    { label: "TOURS BOOKED",    value: "18",       trend: "+180%", color: "#6366f1" },
    { label: "PROPOSALS",       value: "12",       trend: "+240%", color: "#3b82f6" },
    { label: "WEDDINGS BOOKED", value: "34",       trend: "+225%", color: "#f43f5e" },
    { label: "REVENUE",         value: "$142,800", trend: "+654%", color: "#22c55e" },
  ];

  const proposals = [
    { name: "Sarah & Michael Thompson", email: "sarah.thompson@gmail.com", status: "Paid",   sColor: "#22c55e", sBg: "#f0fdf4", amount: "$10,000" },
    { name: "Emily & James Hartwell",   email: "emily.hartwell@gmail.com", status: "Signed", sColor: "#6366f1", sBg: "#eef2ff", amount: "$9,800" },
    { name: "Madison & Connor Wright",  email: "madison.wright@gmail.com", status: "Sent",   sColor: "#3b82f6", sBg: "#eff6ff", amount: "$11,200" },
  ];

  const chartW = 360; const chartH = 72;
  const pts = [[0,chartH],[chartW*.15,chartH*.82],[chartW*.35,chartH*.56],[chartW*.55,chartH*.32],[chartW*.78,chartH*.12],[chartW,0]];
  const line = pts.map(([x,y],i) => `${i===0?"M":"L"} ${x} ${y}`).join(" ");
  const area = line + ` L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div className="bg-white flex h-full w-full" style={{ fontFamily: "var(--font-open-sans)", fontSize: "10px" }}>

      {/* Sidebar */}
      <div className="w-[108px] shrink-0 border-r border-stone-100 bg-white flex flex-col justify-between py-2 overflow-hidden">
        <div>
          {/* Logo */}
          <div className="px-2.5 mb-2">
            <p className="text-[10px] font-bold text-stone-900">StoryVenue™</p>
          </div>
          {/* Nav items */}
          <div className="flex flex-col gap-px px-1.5">
            {NAV_ITEMS.map((navItem) => {
              const Icon = navItem.icon;
              const isActive = "active" in navItem && navItem.active;
              const isExpandable = "expandable" in navItem && navItem.expandable;
              return (
                <div
                  key={navItem.label}
                  className={`flex items-center justify-between gap-1.5 px-1.5 py-[3px] rounded-md ${isActive ? "bg-stone-900" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-[11px] h-[11px] shrink-0 ${isActive ? "text-white" : "text-stone-400"}`} />
                    <span className={`text-[9px] truncate ${isActive ? "font-semibold text-white" : "text-stone-500"}`}>{navItem.label}</span>
                  </div>
                  {isExpandable && <ChevronDown className="w-[8px] h-[8px] text-stone-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom items */}
        <div className="flex flex-col gap-px px-1.5 pb-1">
          <div className="border-t border-stone-100 mb-1" />
          {BOTTOM_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-1.5 py-[3px] rounded-md text-stone-500">
              <Icon className="w-[11px] h-[11px] shrink-0 text-stone-400" />
              <span className="text-[9px] truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-3 py-2 overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[11px] font-bold text-stone-900 leading-none">Home</p>
            <p className="text-[8.5px] text-stone-400 mt-0.5">Your venue payment dashboard</p>
          </div>
          <div className="border border-stone-200 rounded px-1.5 py-0.5 text-[8px] text-stone-500 flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5" /> Last 30 days <ChevronDown className="w-2 h-2" />
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-5 gap-1.5 mb-2.5">
          {stats.map((s) => (
            <div key={s.label} className="border border-stone-100 rounded-lg p-1.5">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[7px] font-semibold tracking-wide text-stone-400 uppercase leading-none truncate">{s.label}</p>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
              </div>
              <p className="text-[11px] font-bold text-stone-900 leading-none">{s.value}</p>
              <p className="text-[7px] text-stone-400 mt-0.5">vs prior</p>
              <p className="text-[7px] font-semibold text-emerald-600 mt-0.5">↗ {s.trend}</p>
            </div>
          ))}
        </div>

        {/* Chart + Proposal status */}
        <div className="grid grid-cols-[3fr_2fr] gap-1.5 mb-2.5">
          <div className="border border-stone-100 rounded-lg p-2">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-[7px] font-semibold tracking-wide text-stone-400 uppercase">Revenue</p>
                <p className="text-[12px] font-bold text-stone-900">$142,800</p>
              </div>
              <span className="text-[7px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-full whitespace-nowrap">↗ +654% vs prior</span>
            </div>
            <svg viewBox={`0 0 ${chartW} ${chartH + 4}`} className="w-full h-14" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fill2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1c1917" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="#1c1917" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#fill2)" />
              <path d={line} fill="none" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex justify-between mt-0.5">
              <span className="text-[7px] text-stone-400">Jan</span>
              <span className="text-[7px] text-stone-400">May</span>
            </div>
          </div>

          <div className="border border-stone-100 rounded-lg p-2">
            <p className="text-[7px] font-semibold tracking-wide text-stone-400 uppercase mb-1.5">Proposal Status</p>
            <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div className="bg-emerald-500" style={{ width: "42%" }} />
              <div className="bg-indigo-500" style={{ width: "33%" }} />
              <div className="bg-blue-400" style={{ width: "16%" }} />
              <div className="bg-amber-400" style={{ width: "9%" }} />
            </div>
            {[
              { label: "Paid",   count: 5,  color: "#22c55e" },
              { label: "Signed", count: 4,  color: "#6366f1" },
              { label: "Sent",   count: 2,  color: "#60a5fa" },
              { label: "Opened", count: 1,  color: "#fbbf24" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.color }} />
                  <span className="text-[8px] text-stone-600">{r.label}</span>
                </div>
                <span className="text-[8px] font-semibold text-stone-900">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent proposals */}
        <div className="border border-stone-100 rounded-lg p-2">
          <p className="text-[9px] font-bold text-stone-800 mb-1.5">Recent Proposals</p>
          <div className="grid grid-cols-[2fr_72px_64px] gap-x-2 pb-1 border-b border-stone-100 mb-1">
            {["CUSTOMER","STATUS","AMOUNT"].map((h) => (
              <p key={h} className="text-[7px] font-semibold tracking-wide text-stone-400 uppercase">{h}</p>
            ))}
          </div>
          {proposals.map((p) => (
            <div key={p.name} className="grid grid-cols-[2fr_72px_64px] gap-x-2 py-1 border-b border-stone-50 last:border-0 items-center">
              <div>
                <p className="text-[8.5px] font-semibold text-stone-800 leading-none truncate">{p.name}</p>
                <p className="text-[7px] text-stone-400 mt-0.5 truncate">{p.email}</p>
              </div>
              <span className="text-[7px] font-semibold px-1.5 py-0.5 rounded-full w-fit" style={{ color: p.sColor, background: p.sBg }}>
                {p.status}
              </span>
              <p className="text-[8.5px] font-bold text-stone-800">{p.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
