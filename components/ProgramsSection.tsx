"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import ButtonArrow from "./ButtonArrow";
import type { ProgramsContent, Program } from "@/types";

interface ProgramsSectionProps {
  content: ProgramsContent;
  /** Programs from WordPress. Falls back to hardcoded if omitted or empty. */
  programs?: Program[];
}


const FALLBACK_PROGRAMS: Program[] = [
  {
    title: "Women's Beginnersad",
    color: "red" as const,
    price: "$40",
    unit: "per game",
    description:
      "This introductory session is the perfect way to get started! We'll cover the basics of the game, from the rules and scoring to essential techniques like grip, positioning, and basic shots. Whether you're completely new or have some experience, this fun and informative session will help you build confidence on the court and develop a solid foundation in padel.",
  },
  {
    title: "Mens Beginner",
    color: "blue" as const,
    price: "$40",
    unit: "per game",
    description:
      "Join our fun and supportive group clinic designed specifically for beginners! Whether you're new to padel or just starting to play, this clinic will help you master the fundamentals. Our experienced coaches will guide you through the essential techniques and strategies of the game.",
  },
  {
    title: "Group Beginner",
    color: "red" as const,
    price: "$60",
    unit: "per game",
    description:
      "Take your padel skills to the next level in our intermediate clinic! Perfect for those who already know the basics, this clinic focuses on refining your technique, improving shot placement, and enhancing court awareness. Our coaches will push you to improve every aspect of your game.",
  },
  {
    title: "Women's Intermediate",
    color: "blue" as const,
    price: "$80",
    unit: "per game",
    description:
      "This clinic is designed for top players looking to perfect their game and get an edge on their opponents. Focus will be on very advanced techniques/shots, precision, and strategic play. You'll work on improving complex shot combinations and court positioning.",
  },
];

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.03638 16.8926L16.4645 7.46447M16.4645 7.46447L16.4645 14.5355M16.4645 7.46447L9.3934 7.46447"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProgramRow({
  program,
}: {
  program: Program;
}) {
  const [hovered, setHovered] = useState(false);
  const isRed = program.color === "red";

  const bgClass = hovered
    ? isRed
      ? "bg-brand-red"
      : "bg-brand-blue"
    : "bg-transparent";

  const titleColorClass = hovered
    ? "text-white"
    : isRed
      ? "text-brand-red"
      : "text-brand-blue";

  const descColor = hovered ? "text-white/90" : "text-brand-gray";
  const priceColor = hovered ? "text-white" : "text-brand-blue";
  const unitColor = hovered ? "text-white/80" : "text-brand-gray";
  const sepColor = hovered ? "text-white/50" : "text-brand-gray/50";

  return (
    <div
      className={`flex flex-col lg:flex-row px-5 md:px-10 lg:px-[80px] py-8 md:py-9 items-start lg:items-center gap-4 lg:gap-6 md:gap-10 border-t border-brand-border transition-colors duration-300 cursor-pointer ${bgClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title */}
      <div
        className={`lg:flex-1 lg:min-w-0 font-bold text-base md:text-2xl lg:text-[32px] uppercase leading-tight tracking-wide transition-colors duration-300 ${titleColorClass}`}
        style={{ fontFamily: '"Mona Sans", sans-serif' }}
      >
        {program.title}
      </div>

      {/* Details: description + price + arrow - below title on mobile, right on desktop */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-10 lg:w-[870px] flex-shrink-0 w-full">
        {/* Description - shown below title on mobile/tablet, right on desktop */}
        <div
          className={`md:block w-full text-sm font-medium leading-6 line-clamp-3 transition-colors duration-300 ${descColor}`}
          style={{ fontFamily: '"Mona Sans", sans-serif' }}
        >
          {program.description}
        </div>

        {/* Price - always visible on right */}
        <div className="flex items-center gap-2 flex-shrink-0 lg:ml-auto">
          <span
            className={`text-xl md:text-3xl lg:text-4xl font-semibold leading-tight transition-colors duration-300 ${priceColor}`}
            style={{ fontFamily: '"Mona Sans", sans-serif' }}
          >
            {program.price}
          </span>
          <span className={`text-base transition-colors duration-300 ${sepColor}`}>
            /
          </span>
          <span
            className={`text-xs uppercase tracking-wide transition-colors duration-300 ${unitColor}`}
            style={{ fontFamily: '"Mona Sans", sans-serif' }}
          >
            {program.unit}
          </span>
        </div>

        {/* Arrow (visible on hover) */}
        <div
          className={`flex-shrink-0 transition-all duration-300 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
        >
          <ArrowIcon className="text-white w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function ProgramsSection({ content, programs: programsProp }: ProgramsSectionProps) {
  const programs = programsProp && programsProp.length > 0 ? programsProp : FALLBACK_PROGRAMS;
  const [activeTab, setActiveTab] = useState(content.tabs[0] || "Programming");

  return (
    <section data-header-theme="light" className="min-h-screen bg-brand-bg">
      {/* Top header section */}
      <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto px-5 md:px-10 lg:px-[80px] pt-16 lg:pt-20 pb-0 gap-6 lg:gap-0">
        {/* Tag - always first on mobile */}
        <div className="lg:hidden">
          <ScrollReveal>
            <span
              className="text-brand-blue text-xs font-medium tracking-[2.4px] uppercase"
              style={{ fontFamily: '"Mona Sans", sans-serif' }}
            >
              {content.label}
            </span>
          </ScrollReveal>
        </div>

        {/* Left column - desktop only shows tag + tabs */}
        <div className="hidden lg:flex lg:w-1/2 flex-col">
          <ScrollReveal>
            <span
              className="text-brand-blue text-xs font-medium tracking-[2.4px] uppercase"
              style={{ fontFamily: '"Mona Sans", sans-serif' }}
            >
              {content.label}
            </span>
          </ScrollReveal>

          {/* Tab filters — pushed to bottom on desktop */}
          <div className="mt-8 lg:mt-auto lg:pt-40 pb-8 lg:pb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/40 p-[5px]">
              {content.tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-0.5 rounded-full text-xs font-semibold leading-6 tracking-[1.08px] uppercase transition-colors duration-200 ${
                    activeTab === tab
                      ? "bg-brand-blue text-[#F4F4ED]"
                      : "text-brand-blue hover:bg-brand-blue/10"
                  }`}
                  style={{ fontFamily: '"Mona Sans", sans-serif' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="lg:w-1/2 flex flex-col gap-8 lg:gap-10">
          <h2
            className="text-brand-blue text-[20px] md:text-3xl lg:text-[32px] xl:text-[40px] uppercase leading-tight"
            style={{
              fontFamily: '"Mona Sans", sans-serif',
              fontWeight: 800,
              fontStretch: '125%',
              lineHeight: '120%',
              letterSpacing: '0.05em'
            }}
          >
            {content.title}
          </h2>

          {/* Button - desktop only */}
          <div className="hidden lg:block">
            <button
              className="btn-cta btn-cta-red inline-flex items-center justify-center gap-3 text-white px-10 py-4 rounded-sm font-bold text-sm uppercase tracking-wider transition-colors w-fit"
              style={{ fontFamily: '"Mona Sans", sans-serif' }}
            >
              Book a Court
              <ButtonArrow color="white" />
            </button>
          </div>
        </div>

        {/* Tabs - mobile only, after title */}
        <div className="lg:hidden">
          <div className="inline-flex items-center gap-1 rounded-full border border-brand-blue/40 p-[5px]">
            {content.tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-0.5 rounded-full text-[10px] whitespace-nowrap font-semibold leading-6 tracking-[1.08px] uppercase transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-brand-blue text-[#F4F4ED]"
                    : "text-brand-blue hover:bg-brand-blue/10"
                }`}
                style={{ fontFamily: '"Mona Sans", sans-serif' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Programs list */}
      <div className="mt-6 lg:mt-10 flex flex-col">
        {programs.map((program, index) => (
          <ScrollReveal key={program.title} delay={index * 100}>
            <ProgramRow program={program} />
          </ScrollReveal>
        ))}
      </div>

      {/* Mobile button after programs list */}
      <div className="lg:hidden px-5 md:px-10 py-8">
        <button
          className="btn-cta btn-cta-red flex items-center justify-center gap-3 text-white w-full py-4 rounded-sm font-bold text-sm uppercase tracking-wider transition-colors"
          style={{ fontFamily: '"Mona Sans", sans-serif' }}
        >
          Book a Court
          <ButtonArrow color="white" />
        </button>
      </div>
    </section>
  );
}
