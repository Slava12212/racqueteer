
import ScrollReveal from "../ScrollReveal";
import ButtonArrow from "../ButtonArrow";
import type { LogoContent } from "@/types";

interface LogoSectionProps {
  content: LogoContent;
}

const logos = [
  { src: "/logo1.svg", alt: "Toyota" },
  { src: "/logo2.svg", alt: "Nvidia" },
  { src: "/logo3.svg", alt: "Brand 3" },
  { src: "/logo4.svg", alt: "Brand 4" },
  { src: "/logo5.svg", alt: "Brand 5" },
  { src: "/logo6.svg", alt: "Brand 6" },
  { src: "/logo7.svg", alt: "Brand 7" },
  { src: "/logo8.svg", alt: "Brand 8" },
];

export default function LogoSection({ content }: LogoSectionProps) {
  return (
    <div
      data-header-theme="dark"
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/ee1938ed88d2b24601b7c8804d2307c1b96f79f7?width=3840')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-56 md:pb-56">
        <ScrollReveal from="bottom" delay={0}>
          <p className="text-[#265090] text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase mb-6 md:mb-8">
            {content.label}
          </p>
        </ScrollReveal>

        <ScrollReveal from="bottom" delay={100}>
          <h2
            className="text-[#265090] text-[20px] sm:text-[36px] md:text-5xl uppercase leading-[120%] max-w-xs sm:max-w-xl md:max-w-2xl mb-6 md:mb-8"
            style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em' }}
          >
            {content.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal from="bottom" delay={200}>
          <p className="text-[#003E6B] text-sm sm:text-base md:text-lg font-light leading-[1.6] max-w-sm sm:max-w-md mb-10 md:mb-14">
            {content.description}
          </p>
        </ScrollReveal>

        <ScrollReveal from="bottom" delay={300}>
          <button className="btn-cta btn-cta-red flex items-center justify-center gap-3 text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-sm transition-colors">
            Inquire Now
            <ButtonArrow color="white" />
          </button>
        </ScrollReveal>
      </div>

      {/* Logos section — pinned to bottom with more spacing on mobile */}
      <div className="absolute bottom-0 left-0 right-0" style={{ paddingBottom: '60px' }}>
        <p className="text-center text-white text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase mb-4 sm:mb-6">
          Brands we&apos;ve working with
        </p>

        {/* Infinite marquee — individual SVG logos at 64% opacity */}
        <div className="overflow-hidden w-full">
          <div
            className="flex w-max items-center"
            style={{
              opacity: 0.64,
              animation: 'marquee 40s linear infinite',
            }}
          >
            {/* 4 copies for seamless coverage */}
            {[0, 1, 2, 3].map((setIdx) =>
              logos.map((logo, i) => (
                <img
                  key={`${setIdx}-${i}`}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-12 sm:h-14 md:h-14 w-auto flex-shrink-0 mx-6 sm:mx-8 md:mx-12"
                  draggable={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
