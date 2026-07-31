import type { AboutContent } from "@/types";
import ScrollReveal from "./ScrollReveal";

interface AboutSectionProps {
  content: AboutContent;
}

export default function AboutSection({ content }: AboutSectionProps) {
  return (
    <section
      data-header-theme="light"
      className="relative min-h-screen overflow-visible"
      style={{
        background:
          "linear-gradient(0deg, rgba(38, 80, 144, 0.05) 0%, rgba(38, 80, 144, 0.05) 100%), #ffffff",
      }}
    >
      {/* Mirrored animated mesh gradient at TOP — with red accent */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-0"
        style={{
          height: '700px',
          maskImage: 'linear-gradient(to top, transparent 0%, black 35%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 35%)',
        }}
      >
        <div
          className="absolute inset-[-80px]"
          style={{
            filter: 'blur(80px)',
            '--c-0': 'hsla(198,63%,80%,1)',
            '--s-start-0': '2%',
            '--s-end-0': '29%',
            '--x-0': '50%',
            '--y-0': '8%',
            '--c-1': 'hsla(216,58%,35%,1)',
            '--s-start-1': '2%',
            '--s-end-1': '32%',
            '--x-1': '10%',
            '--y-1': '5%',
            '--c-2': 'hsla(215,73%,42%,1)',
            '--s-start-2': '2%',
            '--s-end-2': '23%',
            '--x-2': '25%',
            '--y-2': '12%',
            '--c-3': 'hsla(348,100%,35%,1)',
            '--s-start-3': '1%',
            '--s-end-3': '20%',
            '--x-3': '92%',
            '--y-3': '3%',
            backgroundColor: 'hsla(0, 0%, 0%, 0)',
            backgroundImage: 'radial-gradient(circle at var(--x-0) var(--y-0), var(--c-0) var(--s-start-0), transparent var(--s-end-0)),radial-gradient(circle at var(--x-1) var(--y-1), var(--c-1) var(--s-start-1), transparent var(--s-end-1)),radial-gradient(circle at var(--x-2) var(--y-2), var(--c-2) var(--s-start-2), transparent var(--s-end-2)),radial-gradient(circle at var(--x-3) var(--y-3), var(--c-3) var(--s-start-3), transparent var(--s-end-3))',
            backgroundBlendMode: 'normal,normal,normal,normal',
            willChange: 'transform, opacity',
            animation: 'ani-animateMeshAbout 15s linear infinite alternate',
          } as React.CSSProperties}
        />
      </div>

      {/* 3-column layout: image | content | image */}
      <div className="relative flex w-full min-h-screen max-w-[1920px] mx-auto">
        {/* Left: Pickleball paddle — pinned to left edge and bottom, scales with screen */}
        <div className="hidden lg:block w-[35%] xl:w-[33%] flex-shrink-0 relative">
          <div className="absolute left-0 bottom-0 w-full h-full flex items-end justify-start">
            <ScrollReveal from="left" delay={200} distance={60} duration={1000}>
              <img
                src={content.leftImageUrl}
                alt="Pickleball Paddle"
                className="w-[85%] max-w-[450px] h-auto object-contain"
                style={{
                  filter:
                    "drop-shadow(8px 16px 40px rgba(0,0,0,0.10)) drop-shadow(0px 4px 20px rgba(0,0,0,0.06))",
                }}
              />
            </ScrollReveal>
          </div>
        </div>

        {/* Center: Content */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-16 lg:py-24 relative z-10">
          <div className="w-full max-w-[520px]">
            <div className="flex flex-col gap-10">
              {/* Label + Heading + Body */}
              <div className="flex flex-col gap-6">
                <ScrollReveal delay={0}>
                  <p className="text-[#265090] text-[11px] font-medium tracking-[0.2em] uppercase">
                    {content.label}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <h2
                    className="text-[#265090] uppercase text-[20px] sm:text-4xl xl:text-[40px]"
                    style={{
                      fontFamily: '"Mona Sans", sans-serif',
                      fontWeight: 800,
                      fontStretch: "125%",
                      lineHeight: "120%",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {content.title}
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <p className="text-[#011753] font-light leading-[1.6] max-w-[425px] text-base xl:text-[18px]">
                    {content.description}
                  </p>
                </ScrollReveal>
              </div>

              {/* Stats */}
              <ScrollReveal delay={300}>
                <div className="flex items-center gap-0">
                  <div className="flex flex-col items-start">
                    <span
                      className="text-[#265090] uppercase text-3xl sm:text-4xl xl:text-[40px]"
                      style={{
                        fontFamily: '"Mona Sans", sans-serif',
                        fontWeight: 800,
                        fontStretch: "125%",
                        lineHeight: "120%",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {content.stat1Number}
                    </span>
                    <span className="text-[#265090] text-[11px] font-medium tracking-[0.2em] uppercase mt-1">
                      {content.stat1Label}
                    </span>
                  </div>

                  <div className="mx-10 sm:mx-14">
                    <svg
                      width="1"
                      height="34"
                      viewBox="0 0 1 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="0.5"
                        y1="0"
                        x2="0.5"
                        y2="34"
                        stroke="#27508D"
                        strokeOpacity="0.2"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>

                  <div className="flex flex-col items-start">
                    <span
                      className="text-[#265090] uppercase text-3xl sm:text-4xl xl:text-[40px]"
                      style={{
                        fontFamily: '"Mona Sans", sans-serif',
                        fontWeight: 800,
                        fontStretch: "125%",
                        lineHeight: "120%",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {content.stat2Number}
                    </span>
                    <span className="text-[#265090] text-[11px] font-medium tracking-[0.2em] uppercase mt-1">
                      {content.stat2Label}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Right: Padel racket — pinned to right edge and top, scales with screen */}
        <div className="hidden lg:block w-[33%] xl:w-[34%] flex-shrink-0 relative">
          <div className="absolute right-0 top-0 w-full h-full flex items-start justify-end">
            <ScrollReveal from="right" delay={200} distance={60} duration={1000}>
              <img
                src={content.rightImageUrl}
                alt="Padel Racket"
                className="w-[85%] max-w-[450px] h-auto object-contain"
                style={{
                  filter:
                    "drop-shadow(-8px 16px 40px rgba(0,0,0,0.10)) drop-shadow(0px 4px 20px rgba(0,0,0,0.06))",
                }}
              />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Mobile: show single centered padel racket below content */}
      <div className="lg:hidden relative flex justify-center mt-8 overflow-hidden pb-0" style={{ marginBottom: '-40px' }}>
        <img
          src={content.mobileImageUrl}
          alt="Racqueteer Padel & Pickleball"
          className="w-[85%] max-w-[380px] h-auto object-contain"
          style={{
            filter: "drop-shadow(-8px 16px 40px rgba(0,0,0,0.10)) drop-shadow(0px 4px 20px rgba(0,0,0,0.06))",
          }}
        />
      </div>
    </section>
  );
}
