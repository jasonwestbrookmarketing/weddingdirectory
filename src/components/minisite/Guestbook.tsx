"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Heart, Send } from "lucide-react";

type Entry = { id: string; guest_name: string; message: string; created_at: string };

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

      <form onSubmit={submit} className="mt-4 w-full rounded-[5px] border border-brand-line bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
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
        <div className="mt-5 w-full space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-[5px] border border-brand-line bg-white px-4 py-3 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.3)]">
              <p className="text-sm text-brand-ink">{entry.message}</p>
              <p className="mt-1.5 text-xs font-medium text-brand-muted">— {entry.guest_name}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
