"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Building2,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/admin/metrics", label: "Metrics", icon: LayoutDashboard },
  { href: "/admin/venues", label: "Venues", icon: Building2 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-stone-700" />
          <span className="text-base font-semibold text-stone-900">
            Admin
          </span>
        </div>
        <p className="text-xs text-stone-400 mt-0.5">StoryVenue</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-200 px-3 py-4 space-y-0.5">
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          Venue Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5 text-stone-700" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 border-r border-stone-200 bg-white transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-stone-500 hover:text-stone-700"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-60 lg:border-r lg:border-stone-200 lg:bg-white">
        {sidebarContent}
      </aside>

      <main className="lg:pl-60">
        <div className="mx-auto max-w-7xl px-4 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
