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

const SCROLL_SPEED = 40; // seconds for one complete cycle

export default function GallerySection({ content }: GallerySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobileStartIndex, setMobileStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileCardWidth, setMobileCardWidth] = useState(0);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileObserverRef = useRef<ResizeObserver | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartScroll = useRef<number>(0);
  const SWIPE_THRESHOLD = 30;

  const allImages = [...galleryImages, ...galleryImages, ...galleryImages];

  // Desktop auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let lastTime = performance.now();
    const scrollAmount = 1;

    const animate = (time: number) => {
      if (el) {
        const delta = time - lastTime;
        lastTime = time;
        el.scrollLeft += scrollAmount * (delta / 16);
        
        const oneThird = el.scrollWidth / 3;
        if (el.scrollLeft >= oneThird * 2) {
          el.scrollLeft -= oneThird;
        }
        if (el.scrollLeft < oneThird) {
          el.scrollLeft = oneThird;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    el.scrollLeft = el.scrollWidth / 3;
    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Measure mobile card width — use callback ref to handle conditional rendering
  const mobileContainerCallbackRef = useCallback((el: HTMLDivElement | null) => {
    if (mobileObserverRef.current) {
      mobileObserverRef.current.disconnect();
      mobileObserverRef.current = null;
    }
    
    (mobileContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (!el) return;
    
    const update = () => {
      const style = window.getComputedStyle(el);
      const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      setMobileCardWidth(el.offsetWidth - padX);
    };
    update();
    const observer = new ResizeObserver(update);
    mobileObserverRef.current = observer;
    observer.observe(el);
  }, []);

  const scrollByAmount = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstImageElement = el.querySelector(".flex-shrink-0");
    const amount = firstImageElement ? (firstImageElement.clientWidth + 8) : 440;
    const oneThird = el.scrollWidth / 3;
    if (direction === "next") {
      el.scrollLeft += amount;
      if (el.scrollLeft >= oneThird * 2) el.scrollLeft -= oneThird;
    } else {
      el.scrollLeft -= amount;
      if (el.scrollLeft < oneThird) el.scrollLeft += oneThird;
    }
  };

  // Mobile wrapping logic (mimicking TestimonialsSection)
  const mobileMaxIndex = galleryImages.length - 1;

  const goBackMobile = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setMobileStartIndex((prev) => (prev > 0 ? prev - 1 : mobileMaxIndex));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goForwardMobile = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setMobileStartIndex((prev) => (prev < mobileMaxIndex ? prev + 1 : 0));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Touch swipe
  const handleMobileTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartScroll.current = mobileStartIndex;
  };

  const handleMobileTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !mobileTrackRef.current) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    const baseOffset = -(touchStartScroll.current * (mobileCardWidth + 8)); // gap-2 = 8px
    mobileTrackRef.current.style.transform = `translateX(${baseOffset - diff}px)`;
    mobileTrackRef.current.style.transition = 'none';
  };

  const handleMobileTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !mobileTrackRef.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    mobileTrackRef.current.style.transform = '';
    mobileTrackRef.current.style.transition = '';

    if (diff < -SWIPE_THRESHOLD) {
      goBackMobile();
    } else if (diff > SWIPE_THRESHOLD) {
      goForwardMobile();
    }
    
    touchStartX.current = null;
  };

  const slideOffset = -(mobileStartIndex * (mobileCardWidth + 8)); // gap-2 = 8px

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
                if (window.innerWidth < 768) {
                  goBackMobile();
                } else {
                  scrollByAmount("prev");
                }
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
                if (window.innerWidth < 768) {
                  goForwardMobile();
                } else {
                  scrollByAmount("next");
                }
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

      {/* Mobile: Sliding image carousel (matching TestimonialsSection logic) */}
      <div className="md:hidden px-5" ref={mobileContainerCallbackRef}
        onTouchStart={handleMobileTouchStart}
        onTouchMove={handleMobileTouchMove}
        onTouchEnd={handleMobileTouchEnd}>
        <div
          ref={mobileTrackRef}
          className="flex gap-2 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${slideOffset}px)` }}
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden rounded-lg"
              style={{ width: mobileCardWidth > 0 ? `${mobileCardWidth}px` : 'auto' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-[60vh] object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 pb-4">
          {galleryImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setMobileStartIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === mobileStartIndex
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
