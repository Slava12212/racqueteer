"use client";

import type { AboutHeroContent } from "@/types";

interface HeroAboutProps {
  content: AboutHeroContent;
}

export default function HeroAbout({ content }: HeroAboutProps) {
  const videoUrl = typeof content.videoUrl === "string" && content.videoUrl.trim()
    ? content.videoUrl.trim()
    : "/about-hero.png";

  return (
    <div style={{ position: "relative", width: "100%", background: "#000" }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "100%", display: "block" }}
      >
        <source src={videoUrl} />
      </video>
      <h1
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: '"Mona Sans", sans-serif',
          fontSize: "44px",
          color: "white",
          textAlign: "center",
        }}
      >
        {content.title}
      </h1>
    </div>
  );
}