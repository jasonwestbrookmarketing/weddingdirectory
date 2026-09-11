"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Search, ChevronRight } from "lucide-react";

type Match = { token: string; fullName: string; partySize: number; group: string | null; rsvpStatus: string };
type PartyMeal = { meal: string | null; dietary: string | null };
type GuestData = {
  guest: {
    name: string; partySize: number; rsvpStatus: string;
    mealChoice: string | null; dietaryNotes: string | null; partyMeals: PartyMeal[]; responded: boolean;
  };
  mealOptions: string[];
};

export default function Rsvp({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState("");

  // selected guest form state
  const [token, setToken] = useState<string | null>(null);
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  // One entry per attending person — each picks their own meal + allergies.
  const [attendees, setAttendees] = useState<{ meal: string; dietary: string }[]>([{ meal: "", dietary: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | boolean>(null);

  function setCount(n: number) {
    const size = Math.max(1, Math.min(30, n));
    setAttendees((prev) => {
      const next = prev.slice(0, size);
      while (next.length < size) next.push({ meal: "", dietary: "" });
      return next;
    });
  }
  function updateAttendee(i: number, patch: Partial<{ meal: string; dietary: string }>) {
    setAttendees((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  }

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMatches(null);
    if (name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/minisite/${encodeURIComponent(slug)}/rsvp-lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setMatches(Array.isArray(data.matches) ? data.matches : []);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  async function pick(m: Match) {
    setToken(m.token);
    setGuest(null);
    setDone(null);
    setLoadingGuest(true);
    try {
      const res = await fetch(`/api/minisite/rsvp/${m.token}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not load your invitation.");
        setToken(null);
        return;
      }
      setGuest(data);
      setAttending(data.guest.rsvpStatus === "attending" ? true : data.guest.rsvpStatus === "declined" ? false : null);
      // Seed one row per invited person. Meals prefill from any prior choice;
      // allergies always start empty (never prepopulated).
      const size = Math.max(1, data.guest.partySize || 1);
      const prior: PartyMeal[] = Array.isArray(data.guest.partyMeals) ? data.guest.partyMeals : [];
      setAttendees(Array.from({ length: size }, (_, i) => ({ meal: prior[i]?.meal ?? "", dietary: "" })));
    } finally {
      setLoadingGuest(false);
    }
  }

  async function submit() {
    if (!token || attending === null) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/minisite/rsvp/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attending,
          headcount: attendees.length,
          party: attendees.map((a) => ({ meal: a.meal || null, dietary: a.dietary || null })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save your RSVP.");
        return;
      }
      setDone(attending);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setToken(null);
    setGuest(null);
    setDone(null);
    setAttending(null);
    setAttendees([{ meal: "", dietary: "" }]);
    setMatches(null);
    setName("");
  }

  // ── Thank-you ───────────────────────────────────────────────────────────
  if (done !== null) {
    return (
      <section className="mx-auto mt-4 max-w-[520px] rounded-2xl border border-brand-line bg-white p-6 text-center shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
        <p className="mt-3 text-brand-ink">
          {done ? "You're on the list — can't wait to celebrate with you! 🤍" : "Thanks for letting us know. You'll be missed! 🤍"}
        </p>
        <button onClick={reset} className="mt-4 text-sm font-medium text-brand-muted underline-offset-2 hover:text-brand-ink hover:underline">
          Submit another RSVP
        </button>
      </section>
    );
  }

  // ── Guest form ───────────────────────────────────────────────────────────
  if (token) {
    return (
      <section className="mx-auto mt-4 max-w-[520px] rounded-2xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        {loadingGuest || !guest ? (
          <div className="flex justify-center py-6 text-brand-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <>
            <p className="text-center text-sm font-medium text-brand-ink">Hi {guest.guest.name}!</p>
            <p className="mt-1 text-center text-sm text-brand-muted">Will you be joining us?</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setAttending(true)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${attending === true ? "border-brand-ink bg-brand-ink text-white" : "border-brand-line bg-white text-brand-ink hover:border-brand-ink"}`}
              >
                Joyfully accept
              </button>
              <button
                onClick={() => setAttending(false)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${attending === false ? "border-brand-ink bg-brand-ink text-white" : "border-brand-line bg-white text-brand-ink hover:border-brand-ink"}`}
              >
                Regretfully decline
              </button>
            </div>

            {attending === true && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Number attending</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setCount(attendees.length - 1)} className="h-9 w-9 rounded-lg border border-brand-line text-brand-ink">−</button>
                    <span className="min-w-[2ch] text-center text-lg font-semibold text-brand-ink">{attendees.length}</span>
                    <button onClick={() => setCount(attendees.length + 1)} className="h-9 w-9 rounded-lg border border-brand-line text-brand-ink">+</button>
                    <span className="text-xs text-brand-muted">of {guest.guest.partySize} invited</span>
                  </div>
                </div>

                {attendees.map((a, i) => (
                  <div key={i} className={attendees.length > 1 ? "space-y-3 rounded-xl border border-brand-line p-3" : "space-y-3"}>
                    {attendees.length > 1 && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink">
                        {i === 0 ? guest.guest.name : `Guest ${i + 1}`}
                      </p>
                    )}

                    {guest.mealOptions.length > 0 && (
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Meal choice</label>
                        <select
                          value={a.meal}
                          onChange={(e) => updateAttendee(i, { meal: e.target.value })}
                          className="w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink focus:border-brand-ink focus:outline-none"
                        >
                          <option value="">Select…</option>
                          {guest.mealOptions.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Allergies (optional)</label>
                      <input
                        value={a.dietary}
                        onChange={(e) => updateAttendee(i, { dietary: e.target.value })}
                        maxLength={300}
                        placeholder="Peanuts, dairy, none…"
                        className="w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-ink focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-5 flex items-center justify-between">
              <button onClick={reset} className="text-sm text-brand-muted hover:text-brand-ink">← Back</button>
              <button
                onClick={submit}
                disabled={submitting || attending === null}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Send RSVP
              </button>
            </div>
          </>
        )}
      </section>
    );
  }

  // ── Name lookup ────────────────────────────────────────────────────────
  return (
    <section className="mx-auto mt-4 max-w-[520px]">
      <form onSubmit={search} className="rounded-2xl border border-brand-line bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Find your invitation</label>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={searching}
            className="inline-flex flex-none items-center gap-1.5 rounded-xl bg-brand-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {matches !== null && (
        <div className="mt-3 space-y-2">
          {matches.length === 0 ? (
            <p className="rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm text-brand-muted">
              We couldn&rsquo;t find that name. Double-check the spelling, or reach out to the couple.
            </p>
          ) : (
            matches.map((m) => (
              <button
                key={m.token}
                onClick={() => pick(m)}
                className="flex w-full items-center justify-between rounded-2xl border border-brand-line bg-white px-4 py-3 text-left transition-colors hover:border-brand-ink"
              >
                <span>
                  <span className="block text-sm font-medium text-brand-ink">{m.fullName}</span>
                  {m.group && <span className="block text-xs text-brand-muted">{m.group}</span>}
                </span>
                <ChevronRight className="h-4 w-4 text-brand-muted" />
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}
