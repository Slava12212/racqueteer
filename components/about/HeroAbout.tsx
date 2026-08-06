
import ScrollReveal from "../ScrollReveal";
import type { AboutHeroContent } from "@/types";
import { isImageMediaUrl } from "@/lib/utils";

interface HeroAboutProps {
  content: AboutHeroContent;
}

export default function HeroAbout({ content }: HeroAboutProps) {
  const mediaUrl = typeof content.videoUrl === "string" && content.videoUrl.trim()
    ? content.videoUrl.trim()
    : "/about-hero.png";
  const isImageMedia = isImageMediaUrl(mediaUrl);

  return (
    <div
      data-header-theme="dark"
      className="relative w-full h-[50vh] md:h-[55vw] md:max-h-[600px] min-h-[260px] bg-black flex items-end justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        {isImageMedia ? (
          <img
            src={mediaUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <video
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        )}
      </div>
      {/* Single gradient: darker on mobile/tablet (20% extra black), original on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 lg:from-black/50 lg:via-black/10 lg:to-transparent" />
      <ScrollReveal from="bottom" delay={200}>
        <h1
          className="relative z-10 text-white text-center mb-10 md:mb-14 text-[28px] sm:text-[36px] md:text-[44px] lg:text-[56px] uppercase leading-[120%] px-4 max-w-[800px] mx-auto"
          style={{
            fontFamily: '"Mona Sans", sans-serif',
            fontWeight: 800,
            letterSpacing: '0.05em',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {content.title}
        </h1>
      </ScrollReveal>
    </div>
  );
}
