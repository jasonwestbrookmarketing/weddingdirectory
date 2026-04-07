import Link from "next/link";
import Image from "next/image";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center px-6 relative">

      {/* Subtle admin link — top right, very unobtrusive */}
      <div className="absolute top-5 right-5">
        <Link
          href="/admin/login"
          className="text-[11px] font-medium text-stone-700 hover:text-stone-400 transition-colors tracking-wide"
        >
          ⚙
        </Link>
      </div>

      {/* Logo */}
      <div className="mb-10">
        <Image
          src="/storyvenue-light-logo.png"
          alt="StoryVenue"
          width={160}
          height={40}
          className="h-10 w-auto object-contain opacity-80"
          priority
        />
      </div>

      {/* Icon */}
      <div className="mb-8 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <svg className="w-7 h-7 text-white/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.654m5.879-4.43a3 3 0 00-4.243-4.243" />
        </svg>
      </div>

      {/* Message */}
      <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 text-center tracking-tight">
        Down for Maintenance
      </h1>
      <p className="text-stone-400 text-base md:text-lg text-center max-w-md leading-relaxed mb-2">
        We&apos;re making some improvements to StoryVenue. We&apos;ll be back shortly.
      </p>
      <p className="text-stone-600 text-sm text-center">
        Thank you for your patience.
      </p>
    </div>
  );
}
