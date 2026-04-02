"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Venue } from "@/types/database";

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-lg animate-slide-up">
      {message}
    </div>
  );
}

export default function SettingsPage() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [accountEmail, setAccountEmail] = useState<string>("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setAccountEmail(user.email ?? "");

      const { data } = await supabase
        .from("venues")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (data) {
        setVenue(data);
        setNotificationEmail(data.notification_email ?? user.email ?? "");
        setEmailNotifications(data.email_notifications ?? true);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleSave() {
    if (!venue) return;
    setSaving(true);

    const { error } = await supabase
      .from("venues")
      .update({
        notification_email: notificationEmail,
        email_notifications: emailNotifications,
      })
      .eq("id", venue.id);

    setSaving(false);

    if (error) {
      setToast("Failed to save settings");
    } else {
      setToast("Settings saved");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Settings</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage notification preferences for your venue.
        </p>
      </div>

      <div className="max-w-lg space-y-8">
        {/* Account info */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-stone-700">Account</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Email
            </label>
            <p className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
              {accountEmail}
            </p>
          </div>
        </section>

        {/* Notification settings */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-stone-700">
            Notifications
          </h2>
          <Input
            id="notification-email"
            label="Notification Email"
            type="email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            placeholder="Where to send lead notifications"
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
            />
            <span className="text-sm text-stone-700">
              Email me when a new lead comes in
            </span>
          </label>
        </section>

        <Button onClick={handleSave} loading={saving} size="md">
          Save Changes
        </Button>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
