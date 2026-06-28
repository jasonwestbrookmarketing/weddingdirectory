import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getExperimentView } from "@/lib/experiments";
import FunnelDashboard from "@/components/admin/FunnelDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Funnel Experiments",
  robots: { index: false, follow: false },
};

const PAGE_KEY = "bride-booking-system";

export default async function FunnelsAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const view = await getExperimentView(PAGE_KEY);

  return (
    <main className="min-h-[100svh] bg-stone-100">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <FunnelDashboard pageKey={PAGE_KEY} initialView={view} />
      </div>
    </main>
  );
}
