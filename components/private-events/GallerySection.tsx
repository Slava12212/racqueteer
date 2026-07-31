"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import ScrollReveal from "../ScrollReveal";
import type { GalleryContent } from "@/types";

interface GallerySectionProps {
  content: GalleryContent;
}

const galleryImages = [
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/51597700866739e8044babe5c1f1d84322ec708d?width=1320",
    alt: "Padel court event",
    aspectClass: "aspect-[33/20]",
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/cb74a101b3414de7ffce68a6b05850726a47c3f4?width=800",
    alt: "Ami Alexandre Mattiussi event",
    aspectClass: "aspect-square",
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/20295bcac05b7a3b4c26b634b26337aec9616397?width=1040",
    alt: "Tiffany & Co. event",
    aspectClass: "aspect-[13/10]",
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/aee92b2af441350c5947210d7a52cc7a9622d005?width=1320",
    alt: "Sports event",
    aspectClass: "aspect-[33/20]",
  },
];

const SCROLL_SPEED = 60; // px per second

export default function GallerySection({ content }: GallerySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const allImages = [...galleryImages, ...galleryImages, ...galleryImages];

  const startAnimation = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const animate = (timestamp: number) => {
      if (!isPausedRef.current && el) {
        const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 0;
        el.scrollLeft += (SCROLL_SPEED * delta) / 1000;

        // Seamless loop: when past the first copy, jump back
        const oneThird = el.scrollWidth / 3;
        if (el.scrollLeft >= oneThird * 2) {
          el.scrollLeft -= oneThird;
        }
        if (el.scrollLeft < oneThird) {
          el.scrollLeft = oneThird;
        }
      }
      lastTimeRef.current = timestamp;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Start from middle copy for seamless prev/next
    el.scrollLeft = el.scrollWidth / 3;
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    startAnimation();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [startAnimation]);

  const scrollByAmount = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = 440;
    const oneThird = el.scrollWidth / 3;

    if (direction === "next") {
      el.scrollLeft += amount;
      if (el.scrollLeft >= oneThird * 2) el.scrollLeft -= oneThird;
    } else {
      el.scrollLeft -= amount;
      if (el.scrollLeft < oneThird) el.scrollLeft += oneThird;
    }
  };

  const handleMobilePrev = () => {
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleMobileNext = () => {
    setMobileIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <section data-header-theme="light" className="bg-[#F4F6F9] pt-16 pb-0 overflow-hidden">
      {/* Header row */}
      <ScrollReveal from="bottom" delay={0}>
        <div className="flex items-start justify-between px-5 sm:px-10 lg:px-[80px] max-w-[1920px] mx-auto mb-8 sm:mb-10">
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="text-[#265090] text-[11px] sm:text-xs font-medium tracking-[2.4px] uppercase">
              {content.label}
            </p>
            <h2
              className="text-[#265090] text-[20px] sm:text-4xl lg:text-[40px] uppercase leading-[120%]"
              style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em' }}
            >
              {content.title}
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3 sm:gap-6 mt-3 sm:mt-4">
            <button
              onClick={() => {
                handleMobilePrev();
                scrollByAmount("prev");
              }}
              aria-label="Previous"
              className="btn-circle-arrow flex items-center justify-center rounded-full transition-colors duration-200"
            >
              <span className="block w-10 h-10 sm:w-14 sm:h-14 xl:w-[86px] xl:h-[86px]">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="0.5" y="0.5" width="79" height="79" rx="39.5" className="stroke-current" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M38.5297 33.4606C38.6701 33.6012 38.749 33.7918 38.749 33.9906C38.749 34.1893 38.6701 34.3799 38.5297 34.5206L33.8097 39.2406H47.9997C48.1986 39.2406 48.3894 39.3196 48.53 39.4602C48.6707 39.6009 48.7497 39.7916 48.7497 39.9906C48.7497 40.1895 48.6707 40.3802 48.53 40.5209C48.3894 40.6615 48.1986 40.7406 47.9997 40.7406H33.8097L38.5297 45.4606C38.6034 45.5292 38.6625 45.612 38.7035 45.704C38.7444 45.796 38.7665 45.8953 38.7683 45.996C38.77 46.0967 38.7515 46.1968 38.7138 46.2901C38.6761 46.3835 38.6199 46.4684 38.5487 46.5396C38.4775 46.6108 38.3927 46.667 38.2993 46.7047C38.2059 46.7424 38.1059 46.7609 38.0052 46.7591C37.9045 46.7574 37.8051 46.7353 37.7131 46.6943C37.6211 46.6533 37.5383 46.5942 37.4697 46.5206L31.4697 40.5206C31.3292 40.3799 31.2503 40.1893 31.2503 39.9906C31.2503 39.7918 31.3292 39.6012 31.4697 39.4606L37.4697 33.4606C37.6103 33.3201 37.8009 33.2412 37.9997 33.2412C38.1984 33.2412 38.3891 33.3201 38.5297 33.4606Z" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => {
                handleMobileNext();
                scrollByAmount("next");
              }}
              aria-label="Next"
              className="btn-circle-arrow flex items-center justify-center rounded-full transition-colors duration-200"
            >
              <span className="block w-10 h-10 sm:w-14 sm:h-14 xl:w-[86px] xl:h-[86px]">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="-0.5" y="0.5" width="79" height="79" rx="39.5" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 79 6.95011e-06)" className="stroke-current" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M41.4703 33.4606C41.3299 33.6012 41.251 33.7918 41.251 33.9906C41.251 34.1893 41.3299 34.3799 41.4703 34.5206L46.1903 39.2406L32.0003 39.2406C31.8014 39.2406 31.6107 39.3196 31.47 39.4602C31.3293 39.6009 31.2503 39.7916 31.2503 39.9906C31.2503 40.1895 31.3293 40.3802 31.47 40.5209C31.6107 40.6615 31.8014 40.7406 32.0003 40.7406L46.1903 40.7406L41.4703 45.4606C41.3966 45.5292 41.3375 45.612 41.2965 45.704C41.2556 45.796 41.2335 45.8953 41.2317 45.996C41.23 46.0967 41.2485 46.1968 41.2862 46.2902C41.3239 46.3835 41.3801 46.4684 41.4513 46.5396C41.5225 46.6108 41.6073 46.667 41.7007 46.7047C41.7941 46.7424 41.8941 46.7609 41.9949 46.7591C42.0956 46.7574 42.1949 46.7353 42.2869 46.6943C42.3789 46.6533 42.4617 46.5942 42.5303 46.5206L48.5303 40.5206C48.6708 40.3799 48.7497 40.1893 48.7497 39.9906C48.7497 39.7918 48.6708 39.6012 48.5303 39.4606L42.5303 33.4606C42.3897 33.3201 42.1991 33.2412 42.0003 33.2412C41.8016 33.2412 41.611 33.3201 41.4703 33.4606Z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Desktop: Scrolling gallery strip */}
      <div
        ref={scrollRef}
        className="hidden md:flex gap-2 overflow-x-scroll scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        {allImages.map((img, i) => (
          <div
            key={i}
            className={cn(
              "flex-shrink-0 overflow-hidden",
              "h-[260px] lg:h-[400px]",
              img.aspectClass
            )}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Single image with arrow navigation */}
      <div className="md:hidden px-5">
        <div className="w-full overflow-hidden rounded-lg">
          <img
            src={galleryImages[mobileIndex].src}
            alt={galleryImages[mobileIndex].alt}
            className="w-full h-[60vh] object-cover transition-opacity duration-300"
            draggable={false}
          />
        </div>
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 pb-4">
          {galleryImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setMobileIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === mobileIndex
                  ? "bg-[#265090] w-6"
                  : "bg-[#265090]/30 hover:bg-[#265090]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
