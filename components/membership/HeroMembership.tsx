"use client";

import { useState } from "react";
import ButtonArrow from "../ButtonArrow";
import ScrollReveal from "../ScrollReveal";
import type { MembershipHeroContent } from "@/types";

interface HeroMembershipProps {
  content: MembershipHeroContent;
}

/* Progressive blur — same as homepage hero */
const ProgressiveBlur = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0" style={{ backdropFilter: "blur(1px)", maskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)" }} />
    <div className="absolute inset-0" style={{ backdropFilter: "blur(2px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 50%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 50%, transparent 100%)" }} />
    <div className="absolute inset-0" style={{ backdropFilter: "blur(4px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 75%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 75%, transparent 100%)" }} />
    <div className="absolute inset-0" style={{ backdropFilter: "blur(8px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)" }} />
    <div className="absolute inset-0" style={{ backdropFilter: "blur(16px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 75%, black 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 75%, black 100%)" }} />
  </div>
);

export default function HeroMembership({ content }: HeroMembershipProps) {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div data-header-theme="dark" className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Background video — always full height */}
      <div className="absolute inset-0 bg-black">
        <video
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoReady(true)}
          style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
          className="w-full h-full object-cover object-center"
        >
          <source src={content.videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-black/20" />

      {/* Progressive blur — bottom half, same as homepage */}
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
                style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em' }}
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
          <ScrollReveal from="bottom" delay={300}>
          <div className="relative w-full max-w-[545px] px-0 sm:px-0 mt-2 sm:mt-0">
            <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0 z-10 flex items-center justify-center px-3 py-1.5 bg-white rounded-[2px]">
              <span className="text-black text-[11px] font-bold tracking-[0.6px] uppercase leading-[120%]">
                start from
              </span>
            </div>
            <div className="rounded-xl bg-white/[0.15] backdrop-blur-[50px] px-4 pt-6 pb-4 sm:px-6 sm:py-6 md:px-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-7">
              <div className="flex items-baseline gap-1 flex-1">
                <span className="text-white text-4xl md:text-[48px] font-bold leading-none">
                  {content.priceStarting}
                </span>
                <span className="text-white/50 text-sm md:text-base font-normal ml-1">
                  {content.priceUnit}
                </span>
              </div>
              <div className="hidden sm:block self-stretch">
                <svg height="68" viewBox="0 0 1 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-px h-full">
                  <path d="M0.5 0L0.5 68" stroke="url(#divGrad)" strokeOpacity="1" />
                  <defs>
                    <linearGradient id="divGrad" x1="0.5" y1="68" x2="0.5" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#CBD5E4" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#CBD5E4" />
                      <stop offset="1" stopColor="#CBD5E4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="block sm:hidden w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <button className="btn-cta btn-cta-red flex items-center justify-center gap-3 text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-sm w-full sm:w-auto whitespace-nowrap transition-colors">
                {content.ctaText}
                <ButtonArrow color="white" />
              </button>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
