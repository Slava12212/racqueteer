"use client";

import type { AboutHeroContent } from "@/types";

interface HeroAboutProps {
  content: AboutHeroContent;
}

export default function HeroAbout({ content }: HeroAboutProps) {
  // Use optimized H.264 MP4 for streaming; fall back to WP video if needed
  const videoUrl = "/about-hero.mp4";

  return (
    <div
      data-header-theme="dark"
      className="relative w-full h-[50vh] md:h-[55vw] md:max-h-[600px] min-h-[260px] flex items-end justify-center overflow-hidden"
    >
      {/* Background video — no filter, no brightness, no transform */}
      <div className="absolute inset-0">
        <video
          preload="metadata"
          autoPlay
          loop
          muted
          playsInline
          poster="/about-hero.png"
          className="w-full h-full object-cover object-center"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Separate semi-transparent overlay — replaces filter: brightness() */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }} />

      {/* Title with independent stacking context */}
      <div className="relative" style={{ zIndex: 10, isolation: "isolate" }}>
        <h1
          className="text-white text-center mb-10 md:mb-14 text-[28px] sm:text-[36px] md:text-[44px] lg:text-[56px] uppercase leading-[120%] px-4 max-w-[800px] mx-auto"
          style={{
            fontFamily: '"Mona Sans", sans-serif',
            fontWeight: 800,
            letterSpacing: "0.05em",
          }}
        >
          {content.title}
        </h1>
      </div>
    </div>
  );
}