import Link from "next/link";
import Image from "next/image";

export default function MaintenancePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Same video/poster background as homepage */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&auto=format&fit=crop"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-happy-bride-walking-with-her-bouquet-40591-large.mp4"
          type="video/mp4"
        />
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-just-married-couple-40599-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Subtle admin gear — top right */}
      <div className="absolute top-5 right-5 z-20">
        <Link
          href="/admin/login"
          className="text-white/20 hover:text-white/50 transition-colors text-lg leading-none"
          title="Admin"
        >
          ⚙
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">

        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/storyvenue-light-logo.png"
            alt="StoryVenue"
            width={180}
            height={46}
            className="h-11 w-auto object-contain"
            priority
          />
        </div>

        {/* Icon — tools/wrench crossed with a ring */}
        <div className="mb-8 w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center">
          <svg
            className="w-9 h-9 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.4}
            stroke="currentColor"
          >
            {/* Wrench */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.654m5.879-4.43a3 3 0 00-4.243-4.243"
            />
            {/* Cog teeth overlay */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-normal text-white mb-4 leading-tight drop-shadow-lg"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Down for Maintenance
        </h1>

        {/* Sub */}
        <p className="text-white/65 text-base md:text-lg leading-relaxed mb-2"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          We&apos;re making some improvements to StoryVenue.
          <br />We&apos;ll be back shortly.
        </p>
        <p className="text-white/35 text-sm" style={{ fontFamily: "var(--font-open-sans)" }}>
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
}
