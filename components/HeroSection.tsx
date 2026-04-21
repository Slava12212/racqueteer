"use client";

import { useState } from "react";
import type { HeroContent } from "@/types";
import ButtonArrow from "./ButtonArrow";
import ScrollReveal from "./ScrollReveal";

interface HeroSectionProps {
  content: HeroContent;
}

// Progressive blur component for bottom content (blur increases going DOWN)
const ContentProgressiveBlur = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(1px)",
        maskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(2px)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 50%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 50%, transparent 100%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(4px)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 75%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 75%, transparent 100%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(8px)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(16px)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 75%, black 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 75%, black 100%)",
      }}
    />
  </div>
);

export default function HeroSection({ content }: HeroSectionProps) {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section data-header-theme="dark" className="relative w-full min-h-screen overflow-hidden font-mona-sans flex flex-col">
      {/* Background Video */}
      <div className="absolute inset-0 bg-black">
        <video
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoReady(true)}
          style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
          className="w-full h-full object-cover object-[60%_center] md:object-center"
        >
          <source src={content.videoUrl} type="video/mp4" />
        </video>
        {/* Subtle gradient overlay for better text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Spacer — pushes content to bottom */}
      <div className="flex-1" />

      {/* Bottom content overlay */}
      <div
        className="relative z-20 w-full mt-auto"
        style={{ background: "rgba(210,212,223,0.01)" }}
      >
        <ContentProgressiveBlur />
        <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-[80px] pt-8 md:pt-[45px] pb-[75px] relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-0">
            {/* Left: Headline */}
            <div className="lg:flex-[3_0_0] lg:pr-0 xl:pr-0 lg:max-w-[65%]">
              <ScrollReveal delay={200} from="bottom" distance={40} duration={900}>
                <h1
                  className="text-white text-[28px] sm:text-[36px] md:text-[44px] lg:text-[56px] uppercase leading-[120%]"
                  style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em' }}
                >
                  {content.title}
                </h1>
              </ScrollReveal>
            </div>

            {/* Vertical divider — desktop only, centered between containers */}
            <div className="hidden lg:flex self-stretch items-center mx-8 xl:mx-12 flex-shrink-0">
              <div className="w-px h-full opacity-30 bg-gradient-to-b from-white to-transparent" />
            </div>

            {/* Right: Description + CTA buttons */}
            <div className="lg:flex-[2_0_0] flex flex-col gap-10 lg:gap-14">
              <ScrollReveal delay={400} from="bottom" distance={30} duration={800}>
                <p className="text-white text-base md:text-lg xl:text-xl font-medium leading-[150%]">
                  {content.description}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={600} from="bottom" distance={20} duration={700}>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={content.ctaPrimaryUrl}
                    className="btn-cta btn-cta-red flex flex-1 items-center justify-center gap-3 text-white text-sm font-bold uppercase tracking-wider px-6 xl:px-10 py-4 rounded-sm transition-colors"
                  >
                    {content.ctaPrimaryText}
                    <ButtonArrow color="white" />
                  </a>
                  <a
                    href={content.ctaSecondaryUrl}
                    className="btn-cta flex flex-1 items-center justify-center gap-3 border border-white/50 bg-white/[0.03] text-white text-sm font-bold uppercase tracking-wider px-6 xl:px-10 py-4 rounded-sm hover:bg-white/10 transition-colors"
                  >
                    {content.ctaSecondaryText}
                    <ButtonArrow color="white" />
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
