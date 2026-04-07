"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      <Sidebar currentPath={pathname} />
      <main className="lg:pl-60">
        <div className={`py-8 pt-16 lg:pt-8 ${
          pathname.startsWith("/dashboard/leads")
            ? "w-full overflow-x-hidden"
            : "mx-auto max-w-5xl px-4"
        }`}>
          {children}
        </div>
      </main>
    </div>
  );
}
