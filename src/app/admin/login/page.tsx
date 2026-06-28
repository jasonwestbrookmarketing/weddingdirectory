import { redirect } from "next/navigation";
import { isAdmin, adminConfigured } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin/funnels");

  return (
    <main className="min-h-[100svh] flex items-center justify-center bg-stone-100 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-stone-900">StoryVenue Admin</h1>
        <p className="mt-1 text-sm text-stone-500">Funnel experiments dashboard</p>
        {adminConfigured() ? (
          <AdminLoginForm />
        ) : (
          <p className="mt-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            Admin login is not configured yet. Set{" "}
            <code className="font-mono">FUNNEL_ADMIN_PASSWORD</code> in the
            environment to enable it.
          </p>
        )}
      </div>
    </main>
  );
}
