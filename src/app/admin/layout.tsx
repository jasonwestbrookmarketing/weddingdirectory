// Root admin layout — no auth check here so (auth) sub-routes are accessible.
// Auth gating is handled by (protected)/layout.tsx.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
