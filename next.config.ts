import type { NextConfig } from "next";

const APP_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.wasabisys.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    // The marketing site has no auth/admin UI of its own — every authenticated
    // surface (super admin, venue dashboard, couple account) lives on the app
    // subdomain. Forward the natural URLs venue owners type into the bar so
    // storyvenue.com/admin etc. lands them on the correct portal instead of
    // showing a 404.
    return [
      {
        source: "/admin",
        destination: `${APP_URL}/admin`,
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: `${APP_URL}/admin/:path*`,
        permanent: false,
      },
      {
        source: "/login",
        destination: `${APP_URL}/login`,
        permanent: false,
      },
      {
        source: "/signup",
        destination: `${APP_URL}/signup`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
