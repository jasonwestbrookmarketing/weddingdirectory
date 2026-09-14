const PROOF: { venue: string; stat: string }[] = [
  { venue: "White Pine Manor", stat: "2026 Dates Booked in 90 Days" },
  { venue: "Waterloo Farms", stat: "2 Weddings Booked in 7 Days" },
  { venue: "Atlantic Stables", stat: "$15,000 in Booked Weddings in 30 Days" },
  { venue: "Retreat at Evans Farms", stat: "258 Leads in 60 Days" },
  { venue: "Magnolia Event Center", stat: "First Tour Booked in 48 Hours" },
  { venue: "White Pine Manor", stat: "8 Tours + 3 Weddings in 30 Days" },
];

function Segment() {
  return (
    <div className="flex shrink-0 items-center">
      {PROOF.map((p, i) => (
        <div key={i} className="flex items-center whitespace-nowrap px-6 text-[12px]">
          <span className="text-white/60">{p.venue}</span>
          <span className="ml-2 font-semibold text-brand-cream">{p.stat}</span>
          <span className="ml-6 text-white/20">•</span>
        </div>
      ))}
    </div>
  );
}

/** Dark, auto-scrolling proof bar pinned to the top of every slide. */
export default function ProofTicker() {
  return (
    <div className="relative z-20 flex h-9 w-full items-center overflow-hidden bg-brand-ink">
      <div
        className="flex w-max items-center"
        style={{ animation: "ticker 42s linear infinite" }}
      >
        <Segment />
        <Segment />
      </div>
    </div>
  );
}
