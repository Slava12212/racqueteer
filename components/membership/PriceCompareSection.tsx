"use client";



import { useState } from "react";

import ButtonArrow from "../ButtonArrow";

import ScrollReveal from "../ScrollReveal";

const programs = [
  "90-Minute Prime Time Booking",
  "90-Minute Non Prime Time Booking",
  "Open Play",
  "Private One-on-One Lesson",
  "Two-Person Lesson (Per Person)",
  "Three-Person Lesson (Per Person)",
  "Four-Person Lesson (Per Person)",
  "Clinic (Per Person)",
];

const nonMemberPrices = ["$45", "$30", "$45", "$175", "$100", "$80", "$70", "$45"];

type TierKey = "STARTER" | "LIGHT" | "PRO" | "PRO+";

const tiers: Record<TierKey, { label: string; prices: string[] }> = {
  STARTER: { label: "Starter", prices: ["$20", "$10", "$35", "$150", "$85", "$65", "$55", "$30"] },
  LIGHT: { label: "Light", prices: ["$10", "$5", "$25", "$140", "$80", "$60", "$50", "$25"] },
  PRO: { label: "Pro", prices: ["$5", "$0", "$15", "$130", "$75", "$57", "$48", "$22"] },
  "PRO+": { label: "PRO+", prices: ["$0", "$0", "$10", "$125", "$70", "$55", "$45", "$20"] },
};

const tierKeys: TierKey[] = ["STARTER", "LIGHT", "PRO", "PRO+"];

export default function PriceCompareSection() {
  const [activeTier, setActiveTier] = useState<TierKey>("PRO+");
  const currentTier = tiers[activeTier];

  return (
    <section data-header-theme="dark" className="relative min-h-screen overflow-hidden font-['Mona_Sans',_-apple-system,_Roboto,_Helvetica,_sans-serif]">
      {/* Background — mobile-specific image, desktop original */}
      <img
        src="/price-compare-mobile-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover sm:hidden"
      />
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/abdde78f97bddb5ab2a74ed28c91e664a3427290?width=3840"
        alt=""
        className="absolute inset-0 w-full h-full object-cover hidden sm:block"
      />

      <div className="relative z-10 flex flex-col items-center pt-20 sm:pt-32 lg:pt-48 pb-10 sm:pb-[80px]">
        {/* Heading + Tabs — shared */}
        <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-[80px]">
          <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
            <ScrollReveal from="bottom" delay={0}>
              <p className="text-white text-[10px] sm:text-xs font-medium tracking-[2.4px] uppercase text-center">membership</p>
            </ScrollReveal>
            <ScrollReveal from="bottom" delay={100}>
              <h2 className="text-white text-[20px] sm:text-4xl lg:text-[40px] uppercase text-center leading-[120%]" style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em' }}>price compare</h2>
            </ScrollReveal>
          </div>
          <ScrollReveal from="bottom" delay={200}>
            <div className="flex items-center justify-center gap-2 sm:gap-7 lg:gap-9 mb-8 sm:mb-10">
              {tierKeys.map((key) => (
                <button key={key} onClick={() => setActiveTier(key)} className={["text-white text-[11px] sm:text-sm lg:text-base font-bold tracking-[1px] sm:tracking-[1.6px] uppercase transition-all py-2 px-3 sm:py-2.5 sm:px-2.5", activeTier === key ? "bg-[rgba(0,0,64,0.50)] backdrop-blur-[50px]" : "bg-transparent"].join(" ")}>
                  {tiers[key].label}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* ════════ DESKTOP VERSION (sm+) — original layout ════════ */}
        <div className="hidden sm:block w-full">
          <ScrollReveal from="bottom" delay={300}>
            {/* Blue header bar — FULL WIDTH */}
            <div className="w-full bg-[rgba(0,0,64,0.10)]">
              <div className="max-w-[1920px] mx-auto px-8 lg:px-[80px]">
                <div className="flex items-stretch">
                  <div className="flex-1 py-6">
                    <span className="text-white text-sm lg:text-base font-medium tracking-[1.6px] uppercase">Programs</span>
                  </div>
                  <div className="w-[200px] lg:w-[520px] flex items-center justify-center py-6 bg-[rgba(0,0,64,0.50)] backdrop-blur-[50px]">
                    <span className="text-white text-xs lg:text-base font-bold tracking-[1.6px] uppercase text-center leading-tight">Racqueteer {currentTier.label}</span>
                  </div>
                  <div className="hidden lg:flex w-[520px] items-center justify-center py-6">
                    <span className="text-white/70 text-sm lg:text-base font-medium tracking-[1.6px] uppercase">Non Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table body */}
            <div className="w-full max-w-[1920px] mx-auto px-8 lg:px-[80px]">
              <div className="flex flex-col gap-0">
                {programs.map((program, i) => (
                  <div key={i} className="flex items-stretch border-b border-white/20">
                    <div className="flex-1 flex items-center py-6 pr-6">
                      <span className="text-white text-base lg:text-xl font-extrabold tracking-[1px] uppercase leading-[130%]">{program}</span>
                    </div>
                    <div className="w-[200px] lg:w-[520px] flex items-center justify-center py-6 bg-[rgba(0,0,64,0.35)] backdrop-blur-[50px]">
                      <span className="text-white text-2xl lg:text-[32px] font-semibold leading-[120%]">{currentTier.prices[i]}</span>
                    </div>
                    <div className="hidden lg:flex w-[520px] items-center justify-center py-6">
                      <span className="text-white/70 text-2xl font-semibold leading-[120%]">{nonMemberPrices[i]}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* CTA row — under member price column */}
              <div className="flex">
                <div className="flex-1 hidden lg:block" />
                <div className="w-full lg:w-[520px] bg-[rgba(0,0,64,0.35)] backdrop-blur-[50px] lg:bg-transparent">
                  <a href="#" className="btn-cta btn-cta-lightblue flex items-center justify-center gap-3 text-[#265090] text-sm font-bold uppercase tracking-wider py-4 px-10 w-full rounded-sm">
                    <span>join now</span>
                    <ButtonArrow color="#265090" />
                  </a>
                </div>
                <div className="hidden lg:block w-[520px]" />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ════════ MOBILE VERSION (below sm) — adapted layout ════════ */}
        <div className="sm:hidden w-full">
          <ScrollReveal from="bottom" delay={300}>
            {/* Column header — full bleed */}
            <div className="w-full border-b border-white/20 bg-[rgba(0,0,64,0.10)]">
              <div className="pl-6 pr-0">
                <div className="grid grid-cols-[1fr_96px_96px]">
                  <div className="py-4 flex items-center">
                    <span className="text-white text-[11px] font-medium tracking-[1px] uppercase">Programs</span>
                  </div>
                  <div className="py-4 flex items-center justify-center bg-[rgba(0,0,64,0.50)] backdrop-blur-[50px]">
                    <span className="text-white text-[10px] font-bold tracking-[0.5px] uppercase text-center leading-tight">{currentTier.label}</span>
                  </div>
                  <div className="py-4 flex items-center justify-center">
                    <span className="text-white/70 text-[10px] font-medium tracking-[0.5px] uppercase text-center leading-tight">Non Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table rows */}
            {programs.map((program, i) => (
              <div key={i} className="w-full border-b border-white/20">
                <div className="pl-6 pr-0">
                  <div className="grid grid-cols-[1fr_96px_96px]">
                    <div className="py-3.5 pr-3 flex items-center">
                      <span className="text-white text-[11px] font-extrabold tracking-[0.3px] uppercase leading-[150%]">{program}</span>
                    </div>
                    <div className="py-3.5 flex items-center justify-center bg-[rgba(0,0,64,0.35)] backdrop-blur-[50px]">
                      <span className="text-white text-sm font-semibold leading-[120%]">{currentTier.prices[i]}</span>
                    </div>
                    <div className="py-3.5 flex items-center justify-center">
                      <span className="text-white/70 text-sm font-semibold leading-[120%]">{nonMemberPrices[i]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA button — full width below table */}
            <div className="px-6 pt-8 pb-6">
              <a href="#" className="btn-cta btn-cta-lightblue flex items-center justify-center gap-3 text-[#265090] text-sm font-bold uppercase tracking-wider py-4 px-10 w-full rounded-sm">
                <span>join now</span>
                <ButtonArrow color="#265090" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
