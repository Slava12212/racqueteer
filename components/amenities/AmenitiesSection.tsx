"use client";



import { useState, useRef, useEffect, useCallback } from "react";

import { amenities, TOTAL } from "./amenitiesData";

import { AmenityCard } from "./AmenityCard";

import ScrollReveal from "../ScrollReveal";

export function AmenitiesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardStep, setCardStep] = useState(596);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const measureCard = useCallback(() => {
    if (firstCardRef.current) {
      setCardStep(firstCardRef.current.offsetWidth + 16);
    }
  }, []);

  useEffect(() => {
    measureCard();
    window.addEventListener("resize", measureCard);
    return () => window.removeEventListener("resize", measureCard);
  }, [measureCard]);

  // Calculate max scroll index so the last card ends 80px from the right edge
  const [containerWidth, setContainerWidth] = useState(0);
  
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  
  const totalCardsWidth = TOTAL * cardStep;
  const visibleWidth = containerWidth;
  const maxScrollPx = Math.max(0, totalCardsWidth - visibleWidth + 16); // 16 = gap compensation
  const maxIndex = Math.max(0, Math.ceil(maxScrollPx / cardStep));
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < maxIndex;

  const goBack = () => {
    if (canGoBack) setCurrentIndex((prev) => prev - 1);
  };

  const goForward = () => {
    if (canGoForward) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <section data-header-theme="light" className="min-h-screen bg-[#F4F6F9] flex flex-col justify-center py-12 xl:py-16 overflow-hidden">
      {/* Header row */}
      <ScrollReveal from="bottom" delay={0}>
        <div className="flex justify-between items-center w-full max-w-[1920px] mx-auto px-5 sm:px-10 lg:px-[80px] mb-8 xl:mb-[100px]">
          <div className="flex flex-col gap-3 xl:gap-4">
            <p
              className="text-[#265090] font-medium uppercase"
              style={{ fontSize: "12px", letterSpacing: "2.4px", lineHeight: "120%" }}
            >
              amenities
            </p>
            <h2
              className="text-[#265090] uppercase"
              style={{
                fontFamily: '"Mona Sans", sans-serif',
                fontWeight: 800,
                fontStretch: '125%',
                fontSize: "clamp(20px, 4vw, 40px)",
                letterSpacing: "0.05em",
                lineHeight: "120%",
              }}
            >
              our amenities
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-3 items-center flex-shrink-0">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="btn-circle-arrow transition-all duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#265090]"
            style={{ opacity: canGoBack ? 1 : 0.35 }}
            aria-label="Previous amenity"
          >
            <span className="block w-10 h-10 sm:w-14 sm:h-14 xl:w-20 xl:h-20">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <rect x="0.5" y="0.5" width="79" height="79" rx="39.5" className="stroke-current" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M38.5297 33.4606C38.6701 33.6012 38.749 33.7918 38.749 33.9906C38.749 34.1893 38.6701 34.3799 38.5297 34.5206L33.8097 39.2406H47.9997C48.1986 39.2406 48.3894 39.3196 48.53 39.4602C48.6707 39.6009 48.7497 39.7916 48.7497 39.9906C48.7497 40.1895 48.6707 40.3802 48.53 40.5209C48.3894 40.6615 48.1986 40.7406 47.9997 40.7406H33.8097L38.5297 45.4606C38.6034 45.5292 38.6625 45.612 38.7035 45.704C38.7444 45.796 38.7665 45.8953 38.7683 45.996C38.77 46.0967 38.7515 46.1968 38.7138 46.2901C38.6761 46.3835 38.6199 46.4684 38.5487 46.5396C38.4775 46.6108 38.3927 46.667 38.2993 46.7047C38.2059 46.7424 38.1059 46.7609 38.0052 46.7591C37.9045 46.7574 37.8051 46.7353 37.7131 46.6943C37.6211 46.6533 37.5383 46.5942 37.4697 46.5206L31.4697 40.5206C31.3292 40.3799 31.2503 40.1893 31.2503 39.9906C31.2503 39.7918 31.3292 39.6012 31.4697 39.4606L37.4697 33.4606C37.6103 33.3201 37.8009 33.2412 37.9997 33.2412C38.1984 33.2412 38.3891 33.3201 38.5297 33.4606Z"
                />
              </svg>
            </span>
          </button>

          <button
            onClick={goForward}
            disabled={!canGoForward}
            className="btn-circle-arrow transition-all duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#265090]"
            style={{ opacity: canGoForward ? 1 : 0.35 }}
            aria-label="Next amenity"
          >
            <span className="block w-10 h-10 sm:w-14 sm:h-14 xl:w-20 xl:h-20">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <rect
                  x="-0.5"
                  y="0.5"
                  width="79"
                  height="79"
                  rx="39.5"
                  transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 79 6.95011e-06)"
                  className="stroke-current"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M41.4703 33.4606C41.3299 33.6012 41.251 33.7918 41.251 33.9906C41.251 34.1893 41.3299 34.3799 41.4703 34.5206L46.1903 39.2406L32.0003 39.2406C31.8014 39.2406 31.6107 39.3196 31.47 39.4602C31.3293 39.6009 31.2503 39.7916 31.2503 39.9906C31.2503 40.1895 31.3293 40.3802 31.47 40.5209C31.6107 40.6615 31.8014 40.7406 32.0003 40.7406L46.1903 40.7406L41.4703 45.4606C41.3966 45.5292 41.3375 45.612 41.2965 45.704C41.2556 45.796 41.2335 45.8953 41.2317 45.996C41.23 46.0967 41.2485 46.1968 41.2862 46.2902C41.3239 46.3835 41.3801 46.4684 41.4513 46.5396C41.5225 46.6108 41.6073 46.667 41.7007 46.7047C41.7941 46.7424 41.8941 46.7609 41.9949 46.7591C42.0956 46.7574 42.1949 46.7353 42.2869 46.6943C42.3789 46.6533 42.4617 46.5942 42.5303 46.5206L48.5303 40.5206C48.6708 40.3799 48.7497 40.1893 48.7497 39.9906C48.7497 39.7918 48.6708 39.6012 48.5303 39.4606L42.5303 33.4606C42.3897 33.3201 42.1991 33.2412 42.0003 33.2412C41.8016 33.2412 41.611 33.3201 41.4703 33.4606Z"
                />
              </svg>
            </span>
          </button>
        </div>
        </div>
      </ScrollReveal>

      {/* Cards carousel */}
      <ScrollReveal from="bottom" delay={200} distance={30}>
        <div
          ref={containerRef}
          className="overflow-x-auto snap-x snap-mandatory lg:overflow-hidden pl-5 sm:pl-10 lg:pl-[80px] scrollbar-hide"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            containerRef.current?.setAttribute('data-touch-start', String(touch.clientX));
          }}
          onTouchEnd={(e) => {
            const startX = Number(containerRef.current?.getAttribute('data-touch-start') || 0);
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
              if (diff > 0) goForward();
              else goBack();
            }
          }}
        >
          <div
            className="flex gap-4 items-stretch transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * cardStep}px)` }}
          >
            {amenities.map((amenity, index) => (
              <div
                key={amenity.id}
                ref={index === 0 ? firstCardRef : undefined}
                className="flex-shrink-0 self-stretch snap-center"
              >
                <AmenityCard amenity={amenity} total={TOTAL} />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
