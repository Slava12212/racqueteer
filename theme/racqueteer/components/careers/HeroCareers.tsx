"use client";

import { useState } from "react";
import ScrollReveal from "../ScrollReveal";
import type { CareersHeroContent } from "@/types";

interface HeroCareersProps {
  content: CareersHeroContent;
}

const ProgressiveBlur = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0" style={{ backdropFilter: "blur(1px)", maskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)" }} />
    <div className="absolute inset-0" style={{ backdropFilter: "blur(2px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 50%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 50%, transparent 100%)" }} />
    <div className="absolute inset-0" style={{ backdropFilter: "blur(4px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 75%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 75%, transparent 100%)" }} />
    <div className="absolute inset-0" style={{ backdropFilter: "blur(8px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)" }} />
    <div className="absolute inset-0" style={{ backdropFilter: "blur(16px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 75%, black 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 75%, black 100%)" }} />
  </div>
);

export default function HeroCareers({ content }: HeroCareersProps) {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div data-header-theme="dark" className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Background video */}
      <div className="absolute inset-0 bg-black">
        <video
          preload="metadata"
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoReady(true)}
          style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.5s ease-in" }}
          className="w-full h-full object-cover object-center"
        >
          <source src={content.videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-black/30" />

      {/* Progressive blur — bottom half */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%]">
        <ProgressiveBlur />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-end">
        <div className="w-full flex flex-col items-center px-6 sm:px-4 pb-8 md:pb-16">
          <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-2xl w-full mb-8 md:mb-10">
            <ScrollReveal from="bottom" delay={0}>
              <span className="text-white text-[11px] md:text-xs font-medium tracking-[2.4px] uppercase text-center block">
                {content.label}
              </span>
            </ScrollReveal>
            <ScrollReveal from="bottom" delay={100}>
              <h1
                className="text-white text-center text-[28px] sm:text-[36px] md:text-[44px] lg:text-[56px] uppercase leading-[120%]"
                style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: "125%", letterSpacing: "0.05em" }}
              >
                {content.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal from="bottom" delay={200}>
              <p className="text-center max-w-[584px] text-base md:text-xl font-medium leading-relaxed text-white">
                {content.description}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
