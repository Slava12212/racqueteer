"use client";

import Link from "next/link";
import ButtonArrow from "./ButtonArrow";
import ScrollReveal from "./ScrollReveal";
import type { HomeSubscriptionsContent } from "@/types";

interface HomeSubscriptionsSectionProps {
  content: HomeSubscriptionsContent;
}

interface Plan {
  name: string;
  shortDescription: string;
  features: string[];
  price: string;
  buttonVariant: "blue" | "red";
  hasImage?: boolean;
  bgClass: string;
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.875 5.625L8.125 14.3746L3.75 10" stroke="#B40023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const plans: Plan[] = [
  {
    name: "STARTER",
    shortDescription: "Access to courts during non-peak hours with basic booking privileges. A great entry point for casual players looking to join our community.",
    features: [
      "Basic court booking access",
      "Non-peak hour availability",
      "2-day advance booking",
      "Community events access",
    ],
    price: "$89",
    buttonVariant: "blue",
    bgClass: "bg-white",
  },
  {
    name: "LIGHT",
    shortDescription: "Extended court access with guest passes and gym entry. Ideal for regular players looking for more flexibility and amenities to enhance their experience.",
    features: [
      "Unlimited free bookings",
      "4-day advance booking",
      "4 annual guest passes",
      "Gym & wellness access",
      "Standard availability",
    ],
    price: "$135",
    buttonVariant: "blue",
    bgClass: "bg-white",
  },
  {
    name: "PRO",
    shortDescription: "Priority booking, full-week availability, and premium perks including wellness center access, concierge service, and exclusive member benefits.",
    features: [
      "Priority booking access",
      "7-day advance booking",
      "10 annual guest passes",
      "Full wellness center access",
      "Premium concierge service",
      "Member-only events",
    ],
    price: "$189",
    buttonVariant: "red",
    hasImage: true,
    bgClass: "bg-white",
  },
  {
    name: "PRO+",
    shortDescription: "The ultimate membership — unlimited everything, maximum guest passes, 14-day advance booking, premium concierge, and VIP treatment across all facilities.",
    features: [
      "VIP priority booking",
      "14-day advance booking",
      "12 annual guest passes",
      "Full amenity access",
      "Dedicated concierge team",
      "Exclusive VIP events",
    ],
    price: "$397",
    buttonVariant: "red",
    bgClass: "bg-white",
  },
];

function MobilePlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden relative">
      {plan.hasImage && (
        <div className="absolute inset-x-0 top-0 h-28 overflow-hidden pointer-events-none">
          <img src="https://api.builder.io/api/v1/image/assets/TEMP/3790c42ed93ac41d4734a0fc6c6f3d6d70513e9d?width=678" alt="" className="w-full object-cover object-top opacity-80" />
        </div>
      )}
      <div className="relative z-10 p-8">
        <div className="text-[20px] font-bold text-black leading-6 mb-3">{plan.name}</div>
        <div className="text-[17px] text-[#6B7280] leading-5 mb-5">{plan.shortDescription}</div>
        
        {/* Features list */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-black uppercase tracking-[1.2px] mb-3">Plan Features</p>
          <div className="flex flex-col gap-2.5">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5"><CheckIcon /></span>
                <span className="text-[17px] text-[#6B7280] leading-5">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/memberships"
          className="flex items-center gap-2 group"
        >
          <span className="text-[#B40023] font-semibold text-sm uppercase tracking-wider group-hover:underline">Learn more</span>
          <ButtonArrow color="#B40023" />
        </Link>
      </div>
    </div>
  );
}

export default function HomeSubscriptionsSection({ content }: HomeSubscriptionsSectionProps) {
  return (
    <section data-header-theme="light" className="relative overflow-hidden bg-[#F4F6F9] pt-16 sm:pt-[120px] pb-16 sm:pb-[180px] px-6 sm:px-8 lg:px-[80px]">
      {/* Left racket - pickleball paddle (same layout as Membership Amenities block) */}
      <div
        className="absolute pointer-events-none z-10 hidden lg:block"
        style={{
          left: 'calc(311 / 1920 * 100%)',
          top: 'calc(24 / 1080 * 100%)',
          width: '302px',
          height: '400px',
        }}
      >
        <ScrollReveal from="left" delay={200} distance={40} duration={900}>
          <img
            src="/membership-racket-pickleball.png"
            alt="Pickleball paddle"
            className="w-full h-full object-contain"
            style={{
              filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.12)) drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
            }}
          />
        </ScrollReveal>
      </div>

      {/* Right racket - padel racket (same layout as Membership Amenities block) */}
      <div
        className="absolute pointer-events-none z-10 hidden lg:block"
        style={{
          right: 'calc(298 / 1920 * 100%)',
          top: 'calc(140 / 1080 * 100%)',
          width: '302px',
          height: '400px',
        }}
      >
        <ScrollReveal from="right" delay={200} distance={40} duration={900}>
          <img
            src="/membership-racket-padel.png"
            alt="Padel racket"
            className="w-full h-full object-contain"
            style={{
              filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.12)) drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
            }}
          />
        </ScrollReveal>
      </div>

      <div className="max-w-[1920px] mx-auto relative z-20">
        {/* Header */}
        <div className="max-w-3xl sm:mx-auto text-left sm:text-center mb-10 sm:mb-16">
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
            <p className="text-sm sm:text-base text-[#6B7280] leading-6 max-w-xl sm:mx-auto">
              {content.description}
            </p>
          </ScrollReveal>
        </div>

        {/* ──── Mobile: stacked cards (Starter first) ──── */}
        <div className="md:hidden flex flex-col gap-4">
          {plans.map((plan, i) => (
            <ScrollReveal key={i} from="bottom" delay={300 + i * 80}>
              <MobilePlanCard plan={plan} />
            </ScrollReveal>
          ))}
        </div>

        {/* ──── Desktop: plan cards grid ──── */}
        <ScrollReveal from="bottom" delay={300}>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, i) => (
              <div key={i} className={`flex flex-col border border-[#E5E7EB] rounded-lg ${plan.bgClass} overflow-hidden relative`}>
                {plan.hasImage && (
                  <div className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none">
                    <img src="https://api.builder.io/api/v1/image/assets/TEMP/3790c42ed93ac41d4734a0fc6c6f3d6d70513e9d?width=678" alt="" className="w-full object-cover object-top opacity-80" />
                  </div>
                )}
                <div className="flex flex-col gap-4 p-8 relative z-10">
                  <div className="text-[24px] font-bold text-black leading-6">{plan.name}</div>
                  <div className="text-[17px] text-[#6B7280] leading-6">{plan.shortDescription}</div>
                  
                  {/* Features list */}
                  <div className="mt-1">
                    <p className="text-[10px] font-semibold text-black uppercase tracking-[1.2px] mb-3">Plan Features</p>
                    <div className="flex flex-col gap-2.5">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="flex-shrink-0 mt-0.5"><CheckIcon /></span>
                          <span className="text-[17px] text-[#6B7280] leading-5">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-8 pb-8 relative z-10 mt-auto">
                  <Link
                    href="/memberships"
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-[#B40023] font-semibold text-sm uppercase tracking-wider group-hover:underline">Learn more</span>
                    <ButtonArrow color="#B40023" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Explore Membership Options button */}
        <ScrollReveal from="bottom" delay={400}>
          <div className="flex justify-center mt-8">
            <Link
              href="/memberships"
              className="btn-cta btn-cta-red group flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 text-white text-sm font-bold uppercase tracking-wider transition-colors active:scale-95 cursor-pointer rounded-sm"
            >
              <span>Explore Membership Options</span>
              <ButtonArrow color="white" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Animated mesh gradient at bottom — crop bottom, fade overlay at top */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
        style={{
          height: '700px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)',
        }}
      >
        <div
          className="absolute inset-[-80px]"
          style={{
            filter: 'blur(80px)',
            '--c-0': 'hsla(198,63%,80%,1)',
            '--s-start-0': '2%',
            '--s-end-0': '29%',
            '--y-0': '88.6960669210449%',
            '--x-0': '63.874599631175386%',
            '--x-1': '6.348415629860031%',
            '--y-1': '90.47943691037736%',
            '--s-start-1': '2%',
            '--s-end-1': '32%',
            '--c-1': 'hsla(216,58%,35%,1)',
            '--c-2': 'hsla(215,73%,42%,1)',
            '--s-start-2': '2%',
            '--s-end-2': '23%',
            '--y-2': '85.23548054245283%',
            '--x-2': '4.275612363919129%',
            '--c-3': 'hsla(198,60%,79%,1)',
            '--s-start-3': '1%',
            '--s-end-3': '35%',
            '--y-3': '97.93079304245283%',
            '--x-3': '94.50694984447901%',
            backgroundColor: 'hsla(0, 0%, 0%, 0)',
            backgroundImage: 'radial-gradient(circle at var(--x-0) var(--y-0), var(--c-0) var(--s-start-0), transparent var(--s-end-0)),radial-gradient(circle at var(--x-1) var(--y-1), var(--c-1) var(--s-start-1), transparent var(--s-end-1)),radial-gradient(circle at var(--x-2) var(--y-2), var(--c-2) var(--s-start-2), transparent var(--s-end-2)),radial-gradient(circle at var(--x-3) var(--y-3), var(--c-3) var(--s-start-3), transparent var(--s-end-3))',
            backgroundBlendMode: 'normal,normal,normal,normal',
            willChange: 'transform, opacity',
            animation: 'ani-animateMesh 15s linear infinite alternate',
          } as React.CSSProperties}
        />
      </div>
    </section>
  );
}
