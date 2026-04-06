import type { Metadata } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoryVenue — Find Your Perfect Wedding Venue",
  description:
    "Discover wedding venues that match your vision, guest count, and budget. Get pricing and check availability instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-open-sans)] bg-white text-stone-900">
        {children}
      </body>
    </html>
  );
}
