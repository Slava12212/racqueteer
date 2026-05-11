"use client";

import ScrollReveal from "../ScrollReveal";
import ButtonArrow from "../ButtonArrow";
import type { MissionContent } from "@/types";
import { useCta } from "@/lib/navbar-cta";

interface MissionSectionProps {
  content: MissionContent;
}

interface StatBlockProps {
  color: "blue" | "red";
}

function StatBlock({ color }: StatBlockProps) {
  const isBlue = color === "blue";
  const textClass = isBlue ? "text-[#265090]" : "text-[#B40023]";
  const dividerColor = isBlue ? "bg-[#27508D]" : "bg-[#960005]";

  return (
    <div className="flex items-center shrink-0">
      <div className="flex flex-col items-center gap-0.5 flex-1">
        <span
          className={`text-4xl lg:text-[40px] font-extrabold leading-[1.2] tracking-[2px] uppercase ${textClass}`}
        >
          25
        </span>
        <span
          className={`text-[11px] font-medium tracking-[2.4px] uppercase ${textClass} text-center`}
        >
          Courts of art
        </span>
      </div>

      <div className={`h-[34px] w-px mx-6 lg:mx-10 shrink-0 ${dividerColor}`} />

      <div className="flex flex-col items-center gap-0.5 flex-1">
        <span
          className={`text-4xl lg:text-[40px] font-extrabold leading-[1.2] tracking-[2px] uppercase ${textClass}`}
        >
          8+
        </span>
        <span
          className={`text-[11px] font-medium tracking-[2.4px] uppercase ${textClass} text-center`}
        >
          Years of experience
        </span>
      </div>
    </div>
  );
}

export default function MissionSection({ content }: MissionSectionProps) {
  const { ctaText, ctaUrl, openBookModal } = useCta();
  return (
    <section data-header-theme="light" className="relative overflow-hidden bg-[#F4F6F9] min-h-[420px] lg:min-h-[641px] flex items-center py-20 lg:py-0">
      {/* Blue glow — left */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[145px] w-[55%] max-w-[780px] blur-[50px] bg-[linear-gradient(90deg,#ABD7EB_0%,rgba(244,246,249,0)_100%)]"
      />

      {/* Red glow — right */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[145px] w-[65%] max-w-[953px] blur-[50px] bg-[linear-gradient(270deg,rgba(255,108,111,0.8)_0%,rgba(244,246,249,0)_100%)]"
      />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
          {/* Left stats — blue */}
          <div className="lg:shrink-0 hidden lg:block order-1">
            <ScrollReveal from="left" delay={200}>
              <StatBlock color="blue" />
            </ScrollReveal>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center text-center px-4 lg:px-12 order-1 lg:order-2">
            <ScrollReveal from="bottom" delay={0}>
              <span className="text-[#265090] text-[11px] font-medium tracking-[2.4px] uppercase mb-5 block">
                {content.label}
              </span>
            </ScrollReveal>

            <ScrollReveal from="bottom" delay={100}>
              <h2
                className="text-[#265090] text-[20px] sm:text-4xl xl:text-[40px] leading-[120%] tracking-[2px] uppercase mb-7 max-w-[593px]"
                style={{
                  fontFamily: '"Mona Sans", sans-serif',
                  fontWeight: 800,
                  fontStretch: '125%',
                  letterSpacing: '0.05em',
                }}
              >
                {content.title}
              </h2>
            </ScrollReveal>

            <ScrollReveal from="bottom" delay={200}>
              <p className="text-[#6B7280] text-base leading-6 max-w-[423px] mb-10">
                {content.description}
              </p>
            </ScrollReveal>

            <ScrollReveal from="bottom" delay={300}>
              <button
                type="button"
                onClick={openBookModal}
                className="btn-cta btn-cta-red inline-flex items-center justify-center gap-3 text-white text-sm font-bold uppercase tracking-wider px-10 py-4 rounded-sm transition-colors"
              >
                {ctaText}
                <ButtonArrow color="white" />
              </button>
            </ScrollReveal>
          </div>

          {/* Right stats — red (desktop only, original position) */}
          <div className="lg:shrink-0 hidden lg:block order-3">
            <ScrollReveal from="right" delay={200}>
              <StatBlock color="red" />
            </ScrollReveal>
          </div>

          {/* Mobile: both stat blocks centered below button */}
          <div className="lg:hidden flex flex-col items-center gap-8 order-2 mt-2">
            <ScrollReveal from="bottom" delay={400}>
              <StatBlock color="blue" />
            </ScrollReveal>
            <ScrollReveal from="bottom" delay={500}>
              <StatBlock color="red" />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
