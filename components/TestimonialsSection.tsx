"use client";

import { useState } from "react";
import TestimonialCard, { Testimonial } from "./TestimonialCard";
import ScrollReveal from "./ScrollReveal";
import type { TestimonialsContent } from "@/types";

interface TestimonialsSectionProps {
  content: TestimonialsContent;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    category: "Beginner Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cThe training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I\u2019m excited to come back and keep improving!\u201d",
    authorName: "Martin Goutry",
    authorSubtitle: "Beginner Training",
  },
  {
    id: 2,
    category: "Beginner Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cThe training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I\u2019m excited to come back and keep improving!\u201d",
    authorName: "Martin Goutry",
    authorSubtitle: "Beginner Training",
  },
  {
    id: 3,
    category: "Beginner Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cThe training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I\u2019m excited to come back and keep improving!\u201d",
    authorName: "Martin Goutry",
    authorSubtitle: "Beginner Training",
  },
  {
    id: 4,
    category: "Advanced Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cIncredible coaching and a very supportive environment. The drills were intense but effective. My serve has improved tremendously since joining. Highly recommend to anyone serious about the sport!\u201d",
    authorName: "Sarah Chen",
    authorSubtitle: "Advanced Training",
  },
  {
    id: 5,
    category: "Intermediate Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cExactly what I needed to level up my game. The coaches are attentive and the class sizes are perfect. I feel a genuine improvement after every session.\u201d",
    authorName: "James Okafor",
    authorSubtitle: "Intermediate Training",
  },
  {
    id: 6,
    category: "Beginner Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cFriendly instructors who truly care about your progress. The beginner program was perfectly paced and I never felt overwhelmed. Best decision I made this year!\u201d",
    authorName: "Emma Larsson",
    authorSubtitle: "Beginner Training",
  },
  {
    id: 7,
    category: "Advanced Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cWorld-class facility and coaching staff. The structured curriculum helped me identify weaknesses I didn\u2019t even know I had. My overall game has elevated significantly.\u201d",
    authorName: "Lucas Ferreira",
    authorSubtitle: "Advanced Training",
  },
  {
    id: 8,
    category: "Intermediate Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cThe community here is fantastic \u2014 everyone encourages each other. The coaches strike the perfect balance between pushing you and keeping it fun. I look forward to every session!\u201d",
    authorName: "Priya Sharma",
    authorSubtitle: "Intermediate Training",
  },
  {
    id: 9,
    category: "Beginner Training",
    rating: 5.0,
    maxRating: 5.0,
    quote:
      "\u201cFrom zero experience to hitting confidently in just a few weeks. The structure of the program is excellent and the coaches are incredibly patient and encouraging.\u201d",
    authorName: "Tom Eriksson",
    authorSubtitle: "Beginner Training",
  },
];

const CARDS_PER_PAGE = 3;

const ArrowLeftIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="79" height="79" rx="39.5" stroke="#265090" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38.5297 33.4606C38.6702 33.6012 38.749 33.7918 38.749 33.9906C38.749 34.1893 38.6702 34.3799 38.5297 34.5206L33.8097 39.2406H47.9997C48.1986 39.2406 48.3894 39.3196 48.53 39.4602C48.6707 39.6009 48.7497 39.7916 48.7497 39.9906C48.7497 40.1895 48.6707 40.3802 48.53 40.5209C48.3894 40.6615 48.1986 40.7406 47.9997 40.7406H33.8097L38.5297 45.4606C38.6034 45.5292 38.6625 45.612 38.7035 45.704C38.7445 45.796 38.7665 45.8953 38.7683 45.996C38.7701 46.0967 38.7516 46.1968 38.7138 46.2901C38.6761 46.3835 38.62 46.4684 38.5487 46.5396C38.4775 46.6108 38.3927 46.667 38.2993 46.7047C38.2059 46.7424 38.1059 46.7609 38.0052 46.7591C37.9045 46.7574 37.8052 46.7353 37.7132 46.6943C37.6212 46.6533 37.5384 46.5942 37.4697 46.5206L31.4697 40.5206C31.3293 40.3799 31.2504 40.1893 31.2504 39.9906C31.2504 39.7918 31.3293 39.6012 31.4697 39.4606L37.4697 33.4606C37.6103 33.3201 37.801 33.2412 37.9997 33.2412C38.1985 33.2412 38.3891 33.3201 38.5297 33.4606Z"
      fill="#265090"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="-0.5"
      y="0.5"
      width="79"
      height="79"
      rx="39.5"
      transform="matrix(-1 0 0 1 79 0)"
      stroke="#265090"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M41.4703 33.4606C41.3299 33.6012 41.251 33.7918 41.251 33.9906C41.251 34.1893 41.3299 34.3799 41.4703 34.5206L46.1903 39.2406L32.0003 39.2406C31.8014 39.2406 31.6106 39.3196 31.47 39.4602C31.3293 39.6009 31.2503 39.7916 31.2503 39.9906C31.2503 40.1895 31.3293 40.3802 31.47 40.5209C31.6106 40.6615 31.8014 40.7406 32.0003 40.7406L46.1903 40.7406L41.4703 45.4606C41.3966 45.5292 41.3375 45.612 41.2965 45.704C41.2555 45.796 41.2335 45.8953 41.2317 45.996C41.2299 46.0967 41.2485 46.1968 41.2862 46.2902C41.3239 46.3835 41.38 46.4684 41.4513 46.5396C41.5225 46.6108 41.6073 46.667 41.7007 46.7047C41.7941 46.7424 41.8941 46.7609 41.9948 46.7591C42.0955 46.7574 42.1948 46.7353 42.2868 46.6943C42.3788 46.6533 42.4616 46.5942 42.5303 46.5206L48.5303 40.5206C48.6708 40.3799 48.7496 40.1893 48.7496 39.9906C48.7496 39.7918 48.6708 39.6012 48.5303 39.4606L42.5303 33.4606C42.3897 33.3201 42.1991 33.2412 42.0003 33.2412C41.8016 33.2412 41.6109 33.3201 41.4703 33.4606Z"
      fill="#265090"
    />
  </svg>
);

export default function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const [page, setPage] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE);

  const visibleTestimonials = testimonials.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    setMobileIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  return (
    <section data-header-theme="light" className="relative z-10 w-full bg-[#F4F6F9] py-16">
      <div className="max-w-[1920px] mx-auto px-5 sm:px-10 lg:px-[80px]">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-10">
        {/* Title */}
        <ScrollReveal>
          <div className="flex flex-col gap-4">
            <span className="text-[#265090] text-xs font-medium tracking-[2.4px] uppercase leading-[120%]">
              {content.label}
            </span>
            <h2
              className="text-[#265090] text-[20px] lg:text-4xl uppercase"
              style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em', lineHeight: '120%' }}
            >
              {content.title}
            </h2>
          </div>
        </ScrollReveal>

        {/* Navigation Buttons */}
        <div className="flex gap-3 items-center shrink-0">
          <button
            onClick={handlePrev}
            aria-label="Previous testimonials"
            className="btn-circle-arrow transition-all duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#265090]"
          >
            <span className="block w-10 h-10 sm:w-14 sm:h-14 xl:w-20 xl:h-20">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="0.5" y="0.5" width="79" height="79" rx="39.5" className="stroke-current" />
                <path fillRule="evenodd" clipRule="evenodd" d="M38.5297 33.4606C38.6701 33.6012 38.749 33.7918 38.749 33.9906C38.749 34.1893 38.6701 34.3799 38.5297 34.5206L33.8097 39.2406H47.9997C48.1986 39.2406 48.3894 39.3196 48.53 39.4602C48.6707 39.6009 48.7497 39.7916 48.7497 39.9906C48.7497 40.1895 48.6707 40.3802 48.53 40.5209C48.3894 40.6615 48.1986 40.7406 47.9997 40.7406H33.8097L38.5297 45.4606C38.6034 45.5292 38.6625 45.612 38.7035 45.704C38.7444 45.796 38.7665 45.8953 38.7683 45.996C38.77 46.0967 38.7515 46.1968 38.7138 46.2901C38.6761 46.3835 38.6199 46.4684 38.5487 46.5396C38.4775 46.6108 38.3927 46.667 38.2993 46.7047C38.2059 46.7424 38.1059 46.7609 38.0052 46.7591C37.9045 46.7574 37.8051 46.7353 37.7131 46.6943C37.6211 46.6533 37.5383 46.5942 37.4697 46.5206L31.4697 40.5206C31.3292 40.3799 31.2503 40.1893 31.2503 39.9906C31.2503 39.7918 31.3292 39.6012 31.4697 39.4606L37.4697 33.4606C37.6103 33.3201 37.8009 33.2412 37.9997 33.2412C38.1984 33.2412 38.3891 33.3201 38.5297 33.4606Z" />
              </svg>
            </span>
          </button>
          <button
            onClick={handleNext}
            aria-label="Next testimonials"
            className="btn-circle-arrow transition-all duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#265090]"
          >
            <span className="block w-10 h-10 sm:w-14 sm:h-14 xl:w-20 xl:h-20">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="-0.5" y="0.5" width="79" height="79" rx="39.5" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 79 6.95011e-06)" className="stroke-current" />
                <path fillRule="evenodd" clipRule="evenodd" d="M41.4703 33.4606C41.3299 33.6012 41.251 33.7918 41.251 33.9906C41.251 34.1893 41.3299 34.3799 41.4703 34.5206L46.1903 39.2406L32.0003 39.2406C31.8014 39.2406 31.6107 39.3196 31.47 39.4602C31.3293 39.6009 31.2503 39.7916 31.2503 39.9906C31.2503 40.1895 31.3293 40.3802 31.47 40.5209C31.6107 40.6615 31.8014 40.7406 32.0003 40.7406L46.1903 40.7406L41.4703 45.4606C41.3966 45.5292 41.3375 45.612 41.2965 45.704C41.2556 45.796 41.2335 45.8953 41.2317 45.996C41.23 46.0967 41.2485 46.1968 41.2862 46.2902C41.3239 46.3835 41.3801 46.4684 41.4513 46.5396C41.5225 46.6108 41.6073 46.667 41.7007 46.7047C41.7941 46.7424 41.8941 46.7609 41.9949 46.7591C42.0956 46.7574 42.1949 46.7353 42.2869 46.6943C42.3789 46.6533 42.4617 46.5942 42.5303 46.5206L48.5303 40.5206C48.6708 40.3799 48.7497 40.1893 48.7497 39.9906C48.7497 39.7918 48.6708 39.6012 48.5303 39.4606L42.5303 33.4606C42.3897 33.3201 42.1991 33.2412 42.0003 33.2412C41.8016 33.2412 41.611 33.3201 41.4703 33.4606Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Cards - swipeable on mobile, grid on desktop */}
      <ScrollReveal delay={200}>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </ScrollReveal>
      <div className="md:hidden">
        <TestimonialCard testimonial={testimonials[mobileIndex]} />
      </div>

      {/* Page Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {/* Mobile: one dot per testimonial */}
        <div className="md:hidden flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setMobileIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === mobileIndex
                  ? "bg-[#265090] w-6"
                  : "bg-[#265090]/30 hover:bg-[#265090]/50"
              }`}
            />
          ))}
        </div>
        {/* Desktop: one dot per page */}
        <div className="hidden md:flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === page
                  ? "bg-[#265090] w-6"
                  : "bg-[#265090]/30 hover:bg-[#265090]/50"
              }`}
            />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
