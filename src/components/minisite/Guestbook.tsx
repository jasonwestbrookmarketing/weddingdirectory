"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Heart, Send } from "lucide-react";

type Entry = { id: string; guest_name: string; message: string; created_at: string };

/** Always shows date + time, e.g. "4-6-28 9:00pm". */
function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear() % 100;
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${month}-${day}-${year} ${hours}:${minutes}${ampm}`;
}

/** An iMessage-style received bubble that eases in as it scrolls into view. */
function Bubble({ entry }: { entry: Entry }) {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const when = formatWhen(entry.created_at);
  return (
    <li
      ref={ref}
      className={`flex max-w-[85%] flex-col transition-all duration-500 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
    >
      <div className="rounded-2xl rounded-bl-md border border-brand-line bg-white px-4 py-2.5 shadow-[0_6px_18px_-12px_rgba(0,0,0,0.35)]">
        <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-brand-ink [overflow-wrap:anywhere]">{entry.message}</p>
      </div>
      <span className="mt-1 pl-2.5 text-xs text-brand-muted">
        {entry.guest_name}
        {when ? ` · ${when}` : ""}
      </span>
    </li>
  );
}

export default function Guestbook({ slug }: { slug: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"" | "ok" | "moderated">("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/minisite/${encodeURIComponent(slug)}/guestbook`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data.entries)) setEntries(data.entries);
    } catch {
      /* ignore */
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!name.trim() || !message.trim()) {
      setError("Please add your name and a message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/minisite/${encodeURIComponent(slug)}/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_name: name.trim(), message: message.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not post your message.");
        return;
      }
      setName("");
      setMessage("");
      if (data.moderated) {
        setStatus("moderated");
      } else {
        setStatus("ok");
        void load();
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="flex items-center justify-center gap-2 text-center text-lg font-semibold text-brand-ink">
        <Heart className="h-4 w-4 text-rose-400" /> Guestbook
      </h2>

      <form onSubmit={submit} className="mt-4 w-full rounded-[10px] border border-brand-line bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={80}
          className="w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-ink focus:outline-none"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a note for the couple…"
          maxLength={1000}
          className="mt-2 min-h-[80px] w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-ink focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {status === "ok" && <p className="mt-2 text-sm text-emerald-600">Thanks for the love! 🤍</p>}
        {status === "moderated" && (
          <p className="mt-2 text-sm text-emerald-600">Thanks! Your message will appear once the couple approves it.</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Sign the guestbook
        </button>
      </form>

      {entries.length > 0 && (
        // Oldest → newest, like a message thread; each bubble eases in on scroll.
        <ul className="mt-6 flex w-full flex-col gap-3">
          {[...entries].reverse().map((entry) => (
            <Bubble key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}
