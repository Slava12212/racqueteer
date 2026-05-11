import Link from "next/link";
import type { FooterContent } from "@/types";
import ScrollReveal from "./ScrollReveal";
import { useCta } from "@/lib/navbar-cta";

interface FooterProps {
  content: FooterContent;
}

export default function Footer({ content }: FooterProps) {
  const { openBookModal } = useCta();

  return (
    <footer data-header-theme="dark" className="w-full bg-[#003E6B]">
      {/* Main footer content — 580px height, max-width 1920px */}
      <div className="max-w-[1920px] mx-auto px-5 sm:px-10 lg:px-[80px] h-auto lg:h-[580px] flex flex-col">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 py-16 lg:py-0 lg:pt-[80px]">

          {/* Logo */}
          <div className="lg:w-[200px] xl:w-[240px] flex-shrink-0">
            <ScrollReveal from="bottom" delay={0}>
              <img
                src={content.logoUrl}
                alt={content.logoAlt}
                className="w-16 h-auto lg:w-20 brightness-0 invert"
              />
            </ScrollReveal>
          </div>

          {/* Contact Us */}
          <div className="flex-1 flex flex-col gap-5">
            <ScrollReveal from="bottom" delay={100}>
              <span className="text-white/50 text-[11px] font-medium uppercase tracking-[2.4px] leading-[120%]">
                {content.contactLabel}
              </span>
            </ScrollReveal>
            <ScrollReveal from="bottom" delay={150}>
              <div className="flex flex-col gap-2">
                <a
                  href={`mailto:${content.email}`}
                  className="text-white text-base lg:text-[24px] hover:text-white/80 transition-colors"
                  style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontStretch: '125%', lineHeight: '120%', letterSpacing: '0' }}
                >
                  {content.email}
                </a>
                <a
                  href={`tel:${content.phone.replace(/\s/g, '')}`}
                  className="text-white text-base lg:text-[24px] hover:text-white/80 transition-colors"
                  style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontStretch: '125%', lineHeight: '120%', letterSpacing: '0' }}
                >
                  {content.phone}
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal from="bottom" delay={200}>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={openBookModal}
                  className="btn-cta btn-cta-white inline-flex items-center justify-center gap-3 text-[#003E6B] text-sm font-bold uppercase tracking-wider px-10 py-4 rounded-sm transition-colors"
                >
                  {content.ctaText}
                  <svg className="btn-arrow shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7L16.9993 16.0526M17 7L7 7" stroke="#003E6B" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Menu */}
          <div className="flex-1 flex flex-col gap-5">
            <ScrollReveal from="bottom" delay={200}>
              <span className="text-white/50 text-[11px] font-medium uppercase tracking-[2.4px] leading-[120%]">
                {content.menuLabel}
              </span>
            </ScrollReveal>
            <ScrollReveal from="bottom" delay={250}>
              <nav className="flex flex-col gap-3">
                {content.menuLinks.map((item) => {
                  const LinkEl = item.url.startsWith("#") ? "a" : Link;
                  return (
                    <LinkEl
                      key={item.label}
                      href={item.url}
                      className="text-white text-base lg:text-[24px] hover:text-white/80 transition-colors"
                      style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontStretch: '125%', lineHeight: '120%', letterSpacing: '0' }}
                    >
                      {item.label}
                    </LinkEl>
                  );
                })}
              </nav>
            </ScrollReveal>
          </div>

          {/* Locations */}
          <div className="flex-1 flex flex-col gap-5 lg:max-w-[300px]">
            <ScrollReveal from="bottom" delay={300}>
              <span className="text-white/50 text-[11px] font-medium uppercase tracking-[2.4px] leading-[120%]">
                {content.locationsLabel}
              </span>
            </ScrollReveal>
            <ScrollReveal from="bottom" delay={350}>
              <div className="flex flex-col gap-5">
                {content.locations.map((location) => (
                  <div key={location.name}>
                    <h4
                      className="text-white text-base lg:text-[24px]"
                      style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontStretch: '125%', lineHeight: '120%', letterSpacing: '0' }}
                    >
                      {location.name}
                    </h4>
                    <p className="text-white/60 text-sm font-normal leading-[150%] mt-1">
                      {location.address}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-10 lg:px-[80px] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm font-normal">
            {content.copyrightText}
          </p>
          <div className="flex items-center gap-6">
            {content.legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="text-white/40 text-sm font-normal hover:text-white/60 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
