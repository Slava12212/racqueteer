"use client";

import React, { useState } from "react";
import ButtonArrow from "../ButtonArrow";
import ScrollReveal from "../ScrollReveal";
import type { SubscriptionsHeaderContent, MembershipPlan } from "@/types";

interface SubscriptionsSectionProps {
  content: SubscriptionsHeaderContent;
  /** Plans from WordPress. If omitted, falls back to hardcoded data. */
  plans?: MembershipPlan[];
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.875 5.625L8.125 14.3746L3.75 10" stroke="#B40023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.75 14.25L14.2527 4.75M4.75 4.75L14.2527 14.25" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

type FeatureValue = "check" | "cross" | string;

interface Plan {
  name: string;
  description: string;
  price: string;
  buttonVariant: "blue" | "red";
  hasImage?: boolean;
  bgClass: string;
  borderClass: string;
  values: FeatureValue[];
}

const features = [
  "UNLIMITED FREE BOOKINGS",
  "BOOKING WINDOW",
  "ANNUAL GUEST PASSES",
  "ACCESS TO GYM & WELLNESS CENTER",
  "AVAILABILITY",
  "PRIORITY BOOKING",
  "PREMIUM CONCIERGE",
  "ANNUAL GUEST PASSES",
  "ACCESS TO GYM & WELLNESS CENTER",
];

const FALLBACK_PLANS: Plan[] = [
  {
    name: "STARTER",
    description: "Perfect for getting started",
    price: "$89",
    buttonVariant: "blue",
    bgClass: "bg-transparent",
    borderClass: "border-[#E5E7EB]",
    values: ["check", "check", "check", "cross", "cross", "cross", "cross", "0", "2 days"],
  },
  {
    name: "LIGHT",
    description: "Great choice to begin your journey",
    price: "$135",
    buttonVariant: "blue",
    bgClass: "bg-white",
    borderClass: "border-[#E5E7EB]",
    values: ["check", "check", "check", "check", "check", "cross", "cross", "4", "4 days"],
  },
  {
    name: "PRO",
    description: "Ideal for launching your experience",
    price: "$189",
    buttonVariant: "red",
    hasImage: true,
    bgClass: "bg-white",
    borderClass: "border-[#E5E7EB]",
    values: ["check", "check", "check", "check", "check", "check", "cross", "10", "7 days"],
  },
  {
    name: "PRO+",
    description: "Best suited for your first steps",
    price: "$397",
    buttonVariant: "red",
    bgClass: "bg-white",
    borderClass: "border-[#E5E7EB]",
    values: ["check", "check", "check", "check", "check", "check", "check", "12", "14 days"],
  },
];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === "check") return <CheckIcon />;
  if (value === "cross") return <CrossIcon />;
  return <span className="text-base font-semibold text-black leading-5">{value}</span>;
}

/* ──────── Mobile card for a single plan ──────── */
function MobilePlanCard({ plan }: { plan: Plan }) {
  return (
    <div className={`${plan.bgClass} rounded-lg border border-[#E5E7EB] overflow-hidden relative`}>
      {plan.hasImage && (
        <div className="absolute inset-x-0 top-0 h-28 overflow-hidden pointer-events-none">
          <img src="https://api.builder.io/api/v1/image/assets/TEMP/3790c42ed93ac41d4734a0fc6c6f3d6d70513e9d?width=678" alt="" className="w-full object-cover object-top opacity-80" />
        </div>
      )}
      {/* Header */}
      <div className="relative z-10 p-6 pb-0">
        <div className="text-[20px] font-bold text-black leading-6 mb-1">{plan.name}</div>
        <div className="text-sm text-[#6B7280] leading-5 mb-4">{plan.description}</div>
        <div className="mb-4">
          <span className="text-[28px] font-bold text-black">{plan.price}</span>
          <span className="text-xs text-[#6B7280]"> / per month</span>
        </div>
        <button className={`btn-cta flex items-center justify-center gap-3 w-full py-4 rounded-sm font-bold text-sm uppercase tracking-wider text-white transition-colors ${plan.buttonVariant === "red" ? "btn-cta-red" : "btn-cta-blue"}`}>
          <span>JOIN NOW</span>
          <ButtonArrow color="white" />
        </button>
      </div>
      {/* Features list */}
      <div className="p-6 pt-4">
        {features.map((label, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-b-0">
            <span className="text-xs font-semibold text-black uppercase leading-4 flex-1 pr-4">{label}</span>
            <FeatureCell value={plan.values[i]} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SubscriptionsSection({ content, plans: plansProp }: SubscriptionsSectionProps) {
  const plans = plansProp && plansProp.length > 0 ? plansProp : FALLBACK_PLANS;
  const [mobileIndex, setMobileIndex] = useState(0);

  return (
    <section data-header-theme="light" className="bg-[#F4F6F9] min-h-screen pt-[120px] pb-16 px-6 sm:px-8 lg:px-[80px]">
      <div className="max-w-[1920px] mx-auto relative z-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <ScrollReveal from="bottom" delay={0}>
            <p className="text-[12px] font-medium text-[#265090] tracking-[2.4px] uppercase mb-4">
              {content.label}
            </p>
          </ScrollReveal>
          <ScrollReveal from="bottom" delay={100}>
            <h2
              className="text-[20px] sm:text-[32px] lg:text-[40px] text-[#265090] uppercase leading-[120%] mb-6"
              style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em' }}
            >
              {content.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal from="bottom" delay={200}>
            <p className="text-sm sm:text-base text-[#6B7280] leading-6 max-w-xl mx-auto">
              {content.description}
            </p>
          </ScrollReveal>
        </div>

        {/* ──── Mobile: swipeable cards with arrows ──── */}
        <ScrollReveal from="bottom" delay={300}>
        <div className="md:hidden">
          <MobilePlanCard plan={plans[mobileIndex]} />
          {/* Navigation arrows + dots */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setMobileIndex((p) => (p > 0 ? p - 1 : plans.length - 1))}
              aria-label="Previous plan"
              className="btn-circle-arrow flex items-center justify-center rounded-full transition-colors"
            >
              <span className="block w-10 h-10">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="0.5" y="0.5" width="79" height="79" rx="39.5" className="stroke-current" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M38.5297 33.4606C38.6701 33.6012 38.749 33.7918 38.749 33.9906C38.749 34.1893 38.6701 34.3799 38.5297 34.5206L33.8097 39.2406H47.9997C48.1986 39.2406 48.3894 39.3196 48.53 39.4602C48.6707 39.6009 48.7497 39.7916 48.7497 39.9906C48.7497 40.1895 48.6707 40.3802 48.53 40.5209C48.3894 40.6615 48.1986 40.7406 47.9997 40.7406H33.8097L38.5297 45.4606C38.6034 45.5292 38.6625 45.612 38.7035 45.704C38.7444 45.796 38.7665 45.8953 38.7683 45.996C38.77 46.0967 38.7515 46.1968 38.7138 46.2901C38.6761 46.3835 38.6199 46.4684 38.5487 46.5396C38.4775 46.6108 38.3927 46.667 38.2993 46.7047C38.2059 46.7424 38.1059 46.7609 38.0052 46.7591C37.9045 46.7574 37.8051 46.7353 37.7131 46.6943C37.6211 46.6533 37.5383 46.5942 37.4697 46.5206L31.4697 40.5206C31.3292 40.3799 31.2503 40.1893 31.2503 39.9906C31.2503 39.7918 31.3292 39.6012 31.4697 39.4606L37.4697 33.4606C37.6103 33.3201 37.8009 33.2412 37.9997 33.2412C38.1984 33.2412 38.3891 33.3201 38.5297 33.4606Z" />
                </svg>
              </span>
            </button>
            <div className="flex items-center gap-2">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to plan ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === mobileIndex ? "bg-[#265090] w-6" : "bg-[#265090]/30 hover:bg-[#265090]/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setMobileIndex((p) => (p < plans.length - 1 ? p + 1 : 0))}
              aria-label="Next plan"
              className="btn-circle-arrow flex items-center justify-center rounded-full transition-colors"
            >
              <span className="block w-10 h-10">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="-0.5" y="0.5" width="79" height="79" rx="39.5" transform="matrix(-1 0 0 1 79 0)" className="stroke-current" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M41.4703 33.4606C41.3299 33.6012 41.251 33.7918 41.251 33.9906C41.251 34.1893 41.3299 34.3799 41.4703 34.5206L46.1903 39.2406L32.0003 39.2406C31.8014 39.2406 31.6107 39.3196 31.47 39.4602C31.3293 39.6009 31.2503 39.7916 31.2503 39.9906C31.2503 40.1895 31.3293 40.3802 31.47 40.5209C31.6107 40.6615 31.8014 40.7406 32.0003 40.7406L46.1903 40.7406L41.4703 45.4606C41.3966 45.5292 41.3375 45.612 41.2965 45.704C41.2556 45.796 41.2335 45.8953 41.2317 45.996C41.23 46.0967 41.2485 46.1968 41.2862 46.2902C41.3239 46.3835 41.3801 46.4684 41.4513 46.5396C41.5225 46.6108 41.6073 46.667 41.7007 46.7047C41.7941 46.7424 41.8941 46.7609 41.9949 46.7591C42.0956 46.7574 42.1949 46.7353 42.2869 46.6943C42.3789 46.6533 42.4617 46.5942 42.5303 46.5206L48.5303 40.5206C48.6708 40.3799 48.7497 40.1893 48.7497 39.9906C48.7497 39.7918 48.6708 39.6012 48.5303 39.4606L42.5303 33.4606C42.3897 33.3201 42.1991 33.2412 42.0003 33.2412C41.8016 33.2412 41.611 33.3201 41.4703 33.4606Z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
        </ScrollReveal>

        {/* ──── Desktop: original grid table ──── */}
        <ScrollReveal from="bottom" delay={300}>
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[minmax(180px,280px)_repeat(4,1fr)]">
              <div className="bg-transparent" />
              {plans.map((plan, i) => (
                <div key={i} className={`flex flex-col border border-b-0 border-[#E5E7EB] ${plan.bgClass} overflow-hidden relative`}>
                  {plan.hasImage && (
                    <div className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none">
                      <img src="https://api.builder.io/api/v1/image/assets/TEMP/3790c42ed93ac41d4734a0fc6c6f3d6d70513e9d?width=678" alt="" className="w-full object-cover object-top opacity-80" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2.5 p-6 relative z-10">
                    <div className="text-[24px] font-bold text-black leading-6">{plan.name}</div>
                    <div className="text-base text-[#6B7280] leading-6">{plan.description}</div>
                  </div>
                  <div className="flex flex-col gap-2 px-6 pb-6 relative z-10">
                    <div>
                      <span className="text-[24px] font-bold text-black">{plan.price}</span>
                      <span className="text-[12px] text-[#6B7280]"> / per month</span>
                    </div>
                    <button className={`btn-cta flex items-center justify-center gap-3 w-full py-4 rounded-sm font-bold text-sm uppercase tracking-wider text-white transition-colors ${plan.buttonVariant === "red" ? "btn-cta-red" : "btn-cta-blue"}`}>
                      <span>JOIN NOW</span>
                      <ButtonArrow color="white" />
                    </button>
                  </div>
                </div>
              ))}
              {features.map((label, rowIdx) => (
                <React.Fragment key={`row-${rowIdx}`}>
                  <div className="flex items-center pr-6 py-6 border-b border-[#E5E7EB] bg-transparent">
                    <span className="text-[14px] font-semibold text-black leading-5 uppercase">{label}</span>
                  </div>
                  {plans.map((plan, planIdx) => (
                    <div key={`cell-${rowIdx}-${planIdx}`} className={`flex items-center justify-center px-6 py-6 border border-t-0 border-[#E5E7EB] ${plan.bgClass}`}>
                      <FeatureCell value={plan.values[rowIdx]} />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>

      {/* Animated gradient removed per Alex's request */}
    </section>
  );
}
