// Route group layout for admin auth pages (login, register, forgot-password).
// Next.js App Router composes layouts from root → here. The parent
// /admin/layout.tsx would gate with auth checks, so we need to intercept.
// Solution: this (auth) group has its OWN layout that renders children directly,
// and the parent /admin/layout.tsx is replaced with a non-gating version
// that delegates gating to individual protected-route layouts.
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
