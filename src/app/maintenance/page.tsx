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
