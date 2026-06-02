
import ScrollReveal from "../ScrollReveal";
import type { AboutHeroContent } from "@/types";

interface HeroAboutProps {
  content: AboutHeroContent;
}

export default function HeroAbout({ content }: HeroAboutProps) {
  return (
    <div
      data-header-theme="dark"
      className="relative w-full h-[50vh] md:h-[55vw] md:max-h-[600px] min-h-[260px] bg-cover bg-center flex items-end justify-center"
      style={{
        backgroundImage: "url('/about-hero.png')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <ScrollReveal from="bottom" delay={200}>
        <h1
          className="relative z-10 text-white text-center mb-10 md:mb-14 text-[28px] sm:text-[36px] md:text-[44px] lg:text-[56px] uppercase leading-[120%] px-4 max-w-[800px] mx-auto"
          style={{
            fontFamily: '"Mona Sans", sans-serif',
            fontWeight: 800,
            fontStretch: '125%',
            letterSpacing: '0.05em',
          }}
        >
          {content.title}
        </h1>
      </ScrollReveal>
    </div>
  );
}
