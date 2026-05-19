export default function PhoneMockup() {
  const activities = [
    {
      type: "booked",
      title: "Wedding Booked!",
      names: "Emma + Jordan",
      date: "Oct 12, 2026",
      detail: "BOOKED · 8:02PM · Deposit received",
      time: "Just now",
    },
    {
      type: "tour",
      title: "Tour Confirmed",
      names: "Lauren + Mark",
      date: "Sat, Nov 8",
      detail: "TOUR · 2:06 PM · Whole barn tour",
      time: "3m ago",
    },
    {
      type: "signed",
      title: "Proposal Signed",
      names: "Sophie + Will",
      date: "Aug 20, 2026",
      detail: "SIGNED · $12,400 · Contract signed",
      time: "1m ago",
    },
    {
      type: "paid",
      title: "Deposit Received",
      names: "Mia + Jack",
      date: "Aug 14, 2026",
      detail: "PAID · $2,500 · Final payment pending",
      time: "28m ago",
    },
    {
      type: "booked",
      title: "Wedding Booked!",
      names: "Olivia + Ryan",
      date: "July 19, 2026",
      detail: "BOOKED · $11,200 · All dates confirmed",
      time: "1h ago",
    },
    {
      type: "tour",
      title: "Tour Confirmed",
      names: "Hannah + Cole",
      date: "Sun, Nov 9",
      detail: "TOUR · 11:00 AM · Private tour",
      time: "2h ago",
    },
  ];

  const iconColors: Record<string, string> = {
    booked: "bg-emerald-500",
    tour: "bg-orange-400",
    signed: "bg-amber-400",
    paid: "bg-emerald-400",
  };

  const iconSymbols: Record<string, string> = {
    booked: "✓",
    tour: "📅",
    signed: "✍",
    paid: "$",
  };

  return (
    <div className="relative w-[280px] sm:w-[300px] lg:w-[320px] mx-auto">
      {/* Phone frame */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-stone-900/20 border border-stone-200 overflow-hidden">
        {/* Status bar */}
        <div className="bg-stone-900 px-5 pt-3 pb-2 flex justify-between items-center">
          <span className="text-white/60 text-[10px]">9:41</span>
          <div className="w-20 h-4 bg-stone-900 rounded-full" />
          <div className="flex gap-1.5 items-center">
            <div className="w-3 h-2 border border-white/40 rounded-[2px]" />
          </div>
        </div>

        {/* App header */}
        <div className="bg-stone-900 px-4 pb-4 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Wedding Booked!
            </span>
            <span className="text-white/60 text-[9px]">Oct 12, 2026 ✓</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white px-4 py-3">
          {/* Section header */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-stone-900 font-semibold text-xs">Activity</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-stone-400">Live</span>
            </div>
          </div>
          <p className="text-[9px] text-stone-400 mb-3">The Barncat Noe Albury</p>

          {/* Stats row */}
          <div className="flex gap-2 mb-3 bg-stone-50 rounded-xl p-2.5">
            <div className="flex-1">
              <p className="text-[8px] text-stone-400 uppercase tracking-wide mb-0.5">
                Booked Revenue
              </p>
              <p className="text-sm font-bold text-stone-900 leading-none">$128,400</p>
            </div>
            <div className="w-px bg-stone-200" />
            <div className="flex-1 pl-2">
              <p className="text-[8px] text-stone-400 uppercase tracking-wide mb-0.5">
                Weekends Filled
              </p>
              <p className="text-sm font-bold text-stone-900 leading-none">34/36</p>
            </div>
          </div>

          {/* Activity list */}
          <div className="flex flex-col gap-2.5">
            {activities.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className={`w-5 h-5 rounded-full ${iconColors[item.type]} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <span className="text-white text-[8px] font-bold">
                    {item.type === "booked" ? "✓" : item.type === "tour" ? "T" : item.type === "signed" ? "S" : "$"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold text-stone-800 truncate">{item.title}</p>
                    <span className="text-[8px] text-stone-400 shrink-0 ml-1">{item.time}</span>
                  </div>
                  <p className="text-[9px] text-stone-500">{item.names} · {item.date}</p>
                  <p className="text-[8px] text-stone-400 truncate">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-white border-t border-stone-100 px-6 py-2 flex justify-around">
          {["⊞", "♡", "✉", "◎"].map((icon, i) => (
            <div key={i} className={`w-6 h-1 rounded-full ${i === 0 ? "bg-stone-900" : "bg-stone-200"}`} />
          ))}
        </div>
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-emerald-100/40 to-stone-100/20 rounded-[3rem] -z-10 blur-2xl" />
    </div>
  );
}
