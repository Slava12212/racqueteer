
import ScrollReveal from "../ScrollReveal";
import ButtonArrow from "../ButtonArrow";
import type { ContactContent } from "@/types";

interface ContactSectionProps {
  content: ContactContent;
}

export default function ContactSection({ content }: ContactSectionProps) {
  return (
    <div
      data-header-theme="dark"
      className="min-h-screen w-full relative overflow-hidden flex items-center"
    >
      {/* Background image — bottom layer */}
      <img
        src="/contact-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 xl:gap-24">
          {/* Left: Text */}
          <div className="flex-1 max-w-lg flex flex-col gap-10 text-center lg:text-left items-center lg:items-start">
            <ScrollReveal from="bottom" delay={0}>
              <div className="flex flex-col gap-6 items-center lg:items-start">
                <p className="text-[#265090] text-xs font-medium tracking-[2.4px] uppercase">
                  {content.label}
                </p>
                <h2
                  className="text-[#265090] text-[20px] sm:text-4xl md:text-5xl tracking-[2px] uppercase"
                  style={{
                    fontFamily: '"Mona Sans", sans-serif',
                    fontWeight: 800,
                    fontStretch: '125%',
                    letterSpacing: '0.05em',
                    lineHeight: '130%',
                  }}
                >
                  {content.title}
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal from="bottom" delay={200}>
              <p className="text-[#011753] text-sm sm:text-lg font-light leading-[160%] text-center lg:text-left">
                {content.description}
              </p>
            </ScrollReveal>
          </div>

          {/* Right: Card with centered racquet logo behind it */}
          <ScrollReveal from="bottom" delay={300} className="w-full lg:w-auto">
            <div className="relative w-full lg:w-auto lg:min-w-[480px] xl:min-w-[560px]">
              {/* Racquet silhouette — centered on card, above bg image */}
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/c0160883a3bb8b597307b4ca08fcc924ea204a2b?width=1548"
                alt=""
                className="absolute pointer-events-none select-none hidden lg:block z-[1]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) scale(1.2)',
                  opacity: 0.5,
                  mixBlendMode: 'soft-light',
                }}
                aria-hidden="true"
              />

              {/* White card */}
              <div
                className="relative z-[2] bg-white rounded-lg flex flex-col gap-6 sm:gap-8 px-6 py-8 sm:px-8 sm:py-8 md:p-10"
                style={{
                  boxShadow:
                    "0 32px 71px 0 rgba(0,0,0,0.02), 0 130px 130px 0 rgba(0,0,0,0.02), 0 292px 175px 0 rgba(0,0,0,0.01)",
                }}
              >
                <div className="flex flex-col gap-4 sm:gap-5 text-center">
                  <h3
                    className="text-lg sm:text-2xl text-black"
                    style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontStretch: '125%', lineHeight: '120%', letterSpacing: '0' }}
                  >
                    Get in Touch with Us
                  </h3>
                  <p className="text-sm sm:text-lg font-light text-[#6B7280] leading-[160%]">
                    Our specialists will contact you within an hour and answer all
                    your questions.
                  </p>
                </div>

                <a
                  href={content.ctaUrl}
                  className="btn-cta btn-cta-red w-full flex items-center justify-center gap-3 px-10 py-4 rounded-sm font-bold text-sm tracking-wider uppercase text-white transition-colors"
                >
                  <span>{content.ctaText}</span>
                  <ButtonArrow color="white" />
                </a>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(38,80,144,0) 0%, rgba(38,80,144,0.2) 50%, rgba(38,80,144,0) 100%)",
                    }}
                  />
                  <span className="relative bg-white px-4 text-[10px] font-medium tracking-[1px] uppercase text-[#6B7280]">
                    OR contact us via
                  </span>
                </div>

                {/* Contact details */}
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <a
                    href={`mailto:${content.email}`}
                    className="flex items-center gap-3 sm:gap-4 group"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5 h-5 sm:w-6 sm:h-6">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22H17V20H12C7.66 20 4 16.34 4 12C4 7.66 7.66 4 12 4C16.34 4 20 7.66 20 12V13.43C20 14.22 19.29 15 18.5 15C17.71 15 17 14.22 17 13.43V12C17 9.24 14.76 7 12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C13.38 17 14.64 16.44 15.54 15.53C16.19 16.42 17.31 17 18.5 17C20.47 17 22 15.4 22 13.43V12C22 6.48 17.52 2 12 2ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" fill="#B40023"/>
                    </svg>
                    <span
                      className="text-sm sm:text-xl md:text-2xl text-[#B40023] group-hover:underline break-all sm:break-normal"
                      style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontStretch: '125%', lineHeight: '120%', letterSpacing: '0' }}
                    >
                      {content.email}
                    </span>
                  </a>

                  <a href="tel:+61481234567" className="flex items-center gap-3 sm:gap-4 group">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5 h-5 sm:w-6 sm:h-6">
                      <path d="M3 5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H8.28C8.48979 3.00016 8.69422 3.0663 8.86436 3.18905C9.03449 3.3118 9.1617 3.48496 9.228 3.684L10.726 8.177C10.8019 8.40534 10.7929 8.65339 10.7007 8.87564C10.6085 9.0979 10.4393 9.27945 10.224 9.387L7.967 10.517C9.07341 12.9658 11.035 14.927 13.484 16.033L14.612 13.776C14.7195 13.5607 14.9011 13.3915 15.1234 13.2993C15.3456 13.2071 15.5937 13.1981 15.822 13.274L20.316 14.772C20.5152 14.8383 20.6885 14.9657 20.8112 15.136C20.934 15.3064 21.0001 15.511 21 15.721V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H18C9.716 21 3 14.284 3 6V5Z" stroke="#B40023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span
                      className="text-sm sm:text-xl md:text-2xl text-[#B40023] group-hover:underline"
                      style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontStretch: '125%', lineHeight: '120%', letterSpacing: '0' }}
                    >
                      +61 4 8123 4567
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
