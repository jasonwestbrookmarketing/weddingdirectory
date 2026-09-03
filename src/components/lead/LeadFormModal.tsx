"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { BOOKING_TIMELINES } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

const MODAL_HEADER = "Get Pricing & Check Availability";
const SUBMIT_LABEL = "Download Pricing & Availability Guide";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueId: string;
  venueName?: string;
  venueSlug?: string;
  venueWebsite?: string;
}

export default function LeadFormModal({
  isOpen,
  onClose,
  venueId,
  venueName,
  venueSlug,
  venueWebsite,
}: LeadFormModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const formStarted = useRef(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [bookingTimeline, setBookingTimeline] = useState("");
  const [venueMatters, setVenueMatters] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  function handleFirstInteraction() {
    if (!formStarted.current) {
      formStarted.current = true;
      trackEvent("lead_form_started", { venue_id: venueId });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    const payload = {
      venue_id: venueId,
      first_name: firstName,
      last_name: lastName,
      // StoryPay's API also accepts a combined `name` field for compatibility
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      guest_count: guestCount ? Number(guestCount) : undefined,
      booking_timeline: bookingTimeline || undefined,
      venue_matters: venueMatters || undefined,
      // First-touch attribution (fbclid / UTMs / referrer) so StoryPay can
      // bucket this lead as Meta / Google instead of defaulting to Direct.
      ...getAttribution(venueId),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        trackEvent("lead_form_failed", { venue_id: venueId, status: res.status });
        return;
      }

      trackEvent("lead_form_submitted", {
        venue_id: venueId,
        lead_id: data.leadId,
      });
      const params = new URLSearchParams();
      if (venueWebsite) params.set("website", venueWebsite);
      if (venueName) params.set("name", venueName);
      // Per-venue thank-you page (fires the venue's own Meta Pixel for their
      // custom conversion). Falls back to the generic /confirmation page in
      // the rare case a caller doesn't have a venue slug on hand.
      if (venueSlug) {
        router.push(`/venue/${encodeURIComponent(venueSlug)}/thankyou?${params.toString()}`);
      } else {
        router.push(`/confirmation?${params.toString()}`);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
      trackEvent("lead_form_failed", { venue_id: venueId, status: 0 });
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]" />

      <div className="relative z-10 w-full max-w-lg bg-white md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden animate-[slide-up_0.25s_ease-out] md:animate-[fade-in_0.15s_ease-out]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-white px-6 py-4 md:rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              {MODAL_HEADER}
            </h2>
            {venueName && (
              <p className="text-sm text-stone-500 mt-0.5">{venueName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
          onFocus={handleFirstInteraction}
        >
          {/* First + Last name side by side */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="lead-first-name"
              label="First Name"
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              error={fieldErrors.first_name}
            />
            <Input
              id="lead-last-name"
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              error={fieldErrors.last_name}
            />
          </div>

          <Input
            id="lead-email"
            label="Email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={fieldErrors.email}
          />

          <Input
            id="lead-phone"
            label="Phone"
            type="tel"
            placeholder="(555) 555-5555"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            error={fieldErrors.phone}
          />

          <Input
            id="lead-guest-count"
            label="How many guests do you plan to host?"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="e.g. 120"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            required
            error={fieldErrors.guest_count}
          />

          <Select
            id="lead-timeline"
            label="When do you plan to start touring?"
            value={bookingTimeline}
            onChange={(e) => setBookingTimeline(e.target.value)}
            options={BOOKING_TIMELINES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
            placeholder="Select timeline"
            error={fieldErrors.booking_timeline}
          />

          <Input
            id="lead-venue-matters"
            label="What matters most when choosing a venue?"
            type="text"
            placeholder="e.g. outdoor ceremony space, all-inclusive pricing…"
            value={venueMatters}
            onChange={(e) => setVenueMatters(e.target.value)}
            required
            error={fieldErrors.venue_matters}
          />

          {error && (
            <p className="text-sm text-stone-700 bg-stone-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white"
            size="lg"
          >
            {SUBMIT_LABEL}
          </Button>

          <p className="text-xs text-stone-400 text-center">
            Your information is shared only with this venue.
          </p>
        </form>
      </div>
    </div>
  );
}
