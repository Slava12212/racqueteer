"use client";

import React, { useState } from "react";
import ScrollReveal from "../ScrollReveal";
import ButtonArrow from "../ButtonArrow";
import type { PrivateEventsHeroContent } from "@/types";

interface HeroPrivateEventsProps {
  content: PrivateEventsHeroContent;
}

export default function HeroPrivateEvents({ content }: HeroPrivateEventsProps) {
  const [videoReady, setVideoReady] = useState(false);

  const FALLBACK_ITEMS: Array<{ text: string; icon: string }> = [
    { text: "private event packages for any occasion", icon: "box" },
    { text: "exclusive access to our courts, lounges, coaching", icon: "vip" },
  ];

  const whatIncludes =
    content.whatIncludes && content.whatIncludes.length > 0
      ? content.whatIncludes
      : FALLBACK_ITEMS;

  return (
    <div>
      {/* Hero banner */}
      <div
        data-header-theme="dark"
        className="relative w-full h-[50vh] md:h-[55vw] md:max-h-[600px] min-h-[260px] flex items-end justify-center overflow-hidden"
      >
        {/* Video background */}
        <div className="absolute inset-0 bg-black">
          <video
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            onCanPlayThrough={() => setVideoReady(true)}
            style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
            className="w-full h-full object-cover"
          >
            <source src={content.videoUrl} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <ScrollReveal from="bottom" delay={200}>
          <h1
            className="relative z-10 text-white uppercase text-center mb-10 md:mb-14 text-[28px] sm:text-[36px] md:text-[44px] lg:text-[56px] leading-[120%] px-4"
            style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em' }}
          >
            {content.title}
          </h1>
        </ScrollReveal>
      </div>

      {/* Content section */}
      <div data-header-theme="light" className="bg-[#F4F6F9] px-6 sm:px-10 lg:px-20 py-14 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[104px] items-start max-w-[1760px] mx-auto">
          {/* Left: Logo + Text + CTA */}
          <ScrollReveal from="bottom" delay={100}>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 lg:gap-[201px] items-center sm:items-start flex-1 min-w-0">
              {/* Logo icon */}
              <div className="flex-shrink-0 mt-1">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/eabcf5e396454bc3030d9499c934f8eff1aa3e64?width=190"
                  alt="Racqueteer Homebush Club"
                  className="w-[70px] sm:w-[60px] md:w-[80px] lg:w-[95px] h-auto"
                />
              </div>

              {/* Text + CTA (button hidden on mobile — shown after What Includes) */}
              <div className="flex flex-col gap-5 min-w-0 items-center sm:items-start text-center sm:text-left">
                <p className="text-black font-normal text-xl md:text-2xl leading-[1.3] max-w-[494px]">
                  {content.description}
                </p>
                <p className="text-[#6B7280] text-base leading-6 max-w-[309px]">
                  {content.label}
                </p>
                {/* Desktop button */}
                <a
                  href={content.ctaUrl}
                  className="btn-cta btn-cta-red hidden sm:inline-flex items-center justify-center gap-3 text-white font-bold text-sm uppercase tracking-wider rounded-sm px-10 py-4 mt-3 w-fit transition-colors"
                >
                  {content.ctaText}
                  <ButtonArrow color="white" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: What Includes panel */}
          <ScrollReveal from="bottom" delay={300}>
            <div className="bg-[#EDF3F8] p-8 md:p-12 flex flex-col gap-4 w-full lg:w-[718px] lg:flex-shrink-0">
              <p className="text-[#6B7280] text-xs font-medium uppercase tracking-[2.4px]">
                What includes
              </p>
              <div className="flex flex-col gap-4">
                {whatIncludes.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-black text-sm font-extrabold uppercase tracking-[0.7px] leading-[1.2]">
                        {item.text}
                      </p>
                      <IconBadge icon={item.icon === "vip" ? <VipIcon /> : <BoxIcon />} />
                    </div>
                    <div className="h-px bg-[#DDE3E7]" />
                  </div>
                ))}
              </div>
              <p className="text-[#6B7280] text-base leading-6 max-w-[496px]">
                With premium amenities and tailored experiences, we&apos;ll make your event
                unforgettable.
              </p>
            </div>
          </ScrollReveal>

          {/* Mobile-only full-width button — after What Includes */}
          <a
            href={content.ctaUrl}
            className="btn-cta btn-cta-red sm:hidden flex items-center justify-center gap-3 text-white font-bold text-sm uppercase tracking-wider rounded-sm px-10 py-4 w-full transition-colors"
          >
            {content.ctaText}
            <ButtonArrow color="white" />
          </a>
        </div>
      </div>
    </div>
  );
}

function IconBadge({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between w-[100px] flex-shrink-0">
      <SpikeLeftSvg />
      <span className="flex items-center justify-center">{icon}</span>
      <SpikeRightSvg />
    </div>
  );
}

function SpikeLeftSvg() {
  return (
    <svg width="19" height="48" viewBox="0 0 19 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <g clipPath="url(#spikecl-pe)">
        <path d="M8.56891 32.7734C8.06101 33.4631 7.70711 34.2538 7.53111 35.0921C7.35501 35.9303 7.36101 36.7966 7.54851 37.6323C7.63581 38.0644 7.76321 38.4873 7.92921 38.8956C7.62141 38.5717 7.34611 38.2397 7.01411 37.94C5.66231 36.6897 4.07721 35.7183 2.34951 35.0814C2.73371 37.2191 3.84001 39.1602 5.48351 40.5801C6.17491 41.1998 6.98531 41.6723 7.86521 41.9688C8.74501 42.2653 9.67606 42.3797 10.6016 42.305C10.9184 40.6543 10.8908 38.956 10.5206 37.3165C10.1779 35.6876 9.51444 34.1433 8.56891 32.7734Z" fill="#265090"/>
        <path d="M5.41375 34.0053C6.32175 32.6024 6.94185 31.033 7.23795 29.3884C7.53405 27.7437 7.50035 26.0566 7.13865 24.4251C6.42315 24.8713 5.80875 25.4618 5.33455 26.1591C4.86045 26.8563 4.53715 27.6449 4.38525 28.4742C4.29755 28.906 4.25415 29.3456 4.25565 29.7861C4.09375 29.3731 3.96415 28.9763 3.76985 28.5552C2.99365 26.8907 1.89225 25.3984 0.530555 24.166C0.0775548 26.2786 0.363454 28.4826 1.34035 30.4097C1.73825 31.2551 2.30485 32.0102 3.00535 32.6286C3.70585 33.2469 4.52545 33.7154 5.41375 34.0053Z" fill="#265090"/>
        <path d="M3.76337 24.2796C5.15687 23.3254 6.32577 22.0791 7.18887 20.6273C8.06937 19.2171 8.65867 17.6448 8.92188 16.0033C8.08908 16.1541 7.29767 16.4796 6.59977 16.9584C5.90187 17.4371 5.31327 18.0583 4.87277 18.781C4.63537 19.1533 4.43207 19.5463 4.26547 19.9552C4.26547 19.5179 4.30597 19.0806 4.26547 18.6352C4.15087 16.8036 3.67767 15.0124 2.87257 13.3633C2.29747 14.2543 1.85807 15.2259 1.56877 16.2462C1.30497 17.3044 1.22007 18.3993 1.31767 19.4855C1.38557 20.4072 1.63697 21.306 2.05687 22.1293C2.47687 22.9525 3.05707 23.6836 3.76337 24.2796Z" fill="#265090"/>
        <path d="M10.3366 12.585C11.676 11.5997 12.8003 10.3514 13.6406 8.9165C12.807 8.75005 11.9477 8.76139 11.1188 8.94978C10.2899 9.13816 9.51008 9.49936 8.83029 10.0097C8.46929 10.2756 8.13568 10.5767 7.83428 10.9086C7.99618 10.4956 8.19059 10.0988 8.32819 9.67773C8.90879 7.93159 9.12653 6.08524 8.96799 4.25195C8.11989 4.8851 7.35998 5.62859 6.70858 6.46275C6.07508 7.34284 5.59329 8.32276 5.28329 9.3619C5.00759 10.2479 4.91209 11.1802 5.00249 12.1037C5.09289 13.0273 5.36728 13.9234 5.80968 14.7391C7.45538 14.3531 8.99907 13.6186 10.3366 12.585Z" fill="#265090"/>
        <path d="M13.8459 1.71805C12.2898 2.85338 11.2128 4.52807 10.8253 6.41499C12.4653 6.03695 14.0058 5.31363 15.3441 4.29327C16.6817 3.30683 17.808 2.06217 18.6562 0.63289C17.8232 0.464789 16.9641 0.474559 16.1352 0.661564C15.3062 0.84857 14.5261 1.20859 13.8459 1.71805Z" fill="#265090"/>
        <path d="M14.1942 46.5387C13.9583 46.3094 13.7366 46.066 13.5301 45.8098C13.1009 45.2835 12.7203 44.7247 12.2992 44.1902L12.0968 43.9473C11.8943 43.6962 11.5056 43.2508 11.1574 43.2184C10.8092 43.186 10.8173 43.6395 10.8982 43.9068C11.0253 44.2997 11.2383 44.6593 11.5218 44.9595C11.8999 45.3353 12.306 45.6818 12.7365 45.9961C13.131 46.323 13.5507 46.6181 13.9917 46.8788L14.4938 47.1541C14.5777 47.2022 14.6642 47.2454 14.753 47.2837C14.8178 47.2837 15.0121 47.2837 14.9068 47.1298L14.5991 46.895L14.1942 46.5387Z" fill="#265090"/>
      </g>
      <defs>
        <clipPath id="spikecl-pe"><rect width="19" height="48" fill="white" transform="matrix(-1 0 0 1 19 0)"/></clipPath>
      </defs>
    </svg>
  );
}

function SpikeRightSvg() {
  return (
    <svg width="19" height="48" viewBox="0 0 19 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <g clipPath="url(#spikecr-pe)">
        <path d="M10.4311 32.7734C10.939 33.4631 11.2929 34.2538 11.4689 35.0921C11.645 35.9303 11.639 36.7966 11.4515 37.6323C11.3642 38.0644 11.2368 38.4873 11.0708 38.8956C11.3786 38.5717 11.6539 38.2397 11.9859 37.94C13.3377 36.6897 14.9228 35.7183 16.6505 35.0814C16.2663 37.2191 15.16 39.1602 13.5165 40.5801C12.8251 41.1998 12.0147 41.6723 11.1348 41.9688C10.255 42.2653 9.32394 42.3797 8.39844 42.305C8.08163 40.6543 8.1092 38.956 8.47942 37.3165C8.82212 35.6876 9.48556 34.1433 10.4311 32.7734Z" fill="#265090"/>
        <path d="M13.5862 34.0053C12.6782 32.6024 12.0581 31.033 11.762 29.3884C11.4659 27.7437 11.4996 26.0566 11.8613 24.4251C12.5768 24.8713 13.1912 25.4618 13.6654 26.1591C14.1395 26.8563 14.4628 27.6449 14.6147 28.4742C14.7024 28.906 14.7458 29.3456 14.7443 29.7861C14.9062 29.3731 15.0358 28.9763 15.2301 28.5552C16.0063 26.8907 17.1077 25.3984 18.4694 24.166C18.9224 26.2786 18.6365 28.4826 17.6596 30.4097C17.2617 31.2551 16.6951 32.0102 15.9946 32.6286C15.2941 33.2469 14.4745 33.7154 13.5862 34.0053Z" fill="#265090"/>
        <path d="M15.2366 24.2796C13.8431 23.3254 12.6742 22.0791 11.8111 20.6273C10.9306 19.2171 10.3413 17.6448 10.0781 16.0033C10.9109 16.1541 11.7023 16.4796 12.4002 16.9584C13.0981 17.4371 13.6867 18.0583 14.1272 18.781C14.3646 19.1533 14.5679 19.5463 14.7345 19.9552C14.7345 19.5179 14.694 19.0806 14.7345 18.6352C14.8491 16.8036 15.3223 15.0124 16.1274 13.3633C16.7025 14.2543 17.1419 15.2259 17.4312 16.2462C17.695 17.3044 17.7799 18.3993 17.6823 19.4855C17.6144 20.4072 17.363 21.306 16.9431 22.1293C16.5231 22.9525 15.9429 23.6836 15.2366 24.2796Z" fill="#265090"/>
        <path d="M8.66343 12.585C7.32396 11.5997 6.19967 10.3514 5.35938 8.9165C6.19296 8.75005 7.0523 8.76139 7.88121 8.94978C8.71011 9.13816 9.48992 9.49936 10.1697 10.0097C10.5307 10.2756 10.8643 10.5767 11.1657 10.9086C11.0038 10.4956 10.8094 10.0988 10.6718 9.67773C10.0912 7.93159 9.87347 6.08524 10.032 4.25195C10.8801 4.8851 11.64 5.62859 12.2914 6.46275C12.9249 7.34284 13.4067 8.32276 13.7167 9.3619C13.9924 10.2479 14.0879 11.1802 13.9975 12.1037C13.9071 13.0273 13.6327 13.9234 13.1903 14.7391C11.5446 14.3531 10.0009 13.6186 8.66343 12.585Z" fill="#265090"/>
        <path d="M5.15406 1.71805C6.71021 2.85338 7.78721 4.52807 8.17468 6.41499C6.53474 6.03695 4.99424 5.31363 3.6559 4.29327C2.31825 3.30683 1.19199 2.06217 0.34375 0.63289C1.17675 0.464789 2.03587 0.474559 2.86484 0.661564C3.6938 0.84857 4.47391 1.20859 5.15406 1.71805Z" fill="#265090"/>
        <path d="M4.80581 46.5387C5.04166 46.3094 5.26341 46.066 5.46986 45.8098C5.89906 45.2835 6.27968 44.7247 6.70078 44.1902L6.90324 43.9473C7.10569 43.6962 7.4944 43.2508 7.84263 43.2184C8.19085 43.186 8.18275 43.6395 8.10177 43.9068C7.97475 44.2997 7.76173 44.6593 7.47821 44.9595C7.10013 45.3353 6.69405 45.6818 6.26348 45.9961C5.869 46.323 5.44928 46.6181 5.00827 46.8788L4.50618 47.1541C4.4223 47.2022 4.33578 47.2454 4.24703 47.2837C4.18225 47.2837 3.98789 47.2837 4.09317 47.1298L4.4009 46.895L4.80581 46.5387Z" fill="#265090"/>
      </g>
      <defs>
        <clipPath id="spikecr-pe"><rect width="19" height="48" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.578 4.432L15.578 3.382C13.822 2.461 12.944 2 12 2C11.056 2 10.178 2.46 8.422 3.382L8.101 3.551L17.024 8.65L21.04 6.64C20.394 5.908 19.352 5.361 17.578 4.43M21.748 7.964L17.75 9.964V13C17.75 13.1989 17.671 13.3897 17.5303 13.5303C17.3897 13.671 17.1989 13.75 17 13.75C16.8011 13.75 16.6103 13.671 16.4697 13.5303C16.329 13.3897 16.25 13.1989 16.25 13V10.714L12.75 12.464V21.904C13.468 21.725 14.285 21.297 15.578 20.618L17.578 19.568C19.729 18.439 20.805 17.875 21.403 16.86C22 15.846 22 14.583 22 12.06V11.943C22 10.05 22 8.866 21.748 7.964ZM11.25 21.904V12.464L2.252 7.964C2 8.866 2 10.05 2 11.941V12.058C2 14.583 2 15.846 2.597 16.86C3.195 17.875 4.271 18.44 6.422 19.569L8.422 20.618C9.715 21.297 10.532 21.725 11.25 21.904ZM2.96 6.641L12 11.161L15.411 9.456L6.525 4.378L6.422 4.432C4.649 5.362 3.606 5.909 2.96 6.642" fill="#265090"/>
    </svg>
  );
}

function VipIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.9863 5.73962C13.3705 5.52167 13.6718 5.18264 13.8431 4.77545C14.0143 4.36826 14.046 3.91582 13.9331 3.48875C13.8201 3.06168 13.569 2.68401 13.2189 2.41469C12.8687 2.14537 12.4392 1.99955 11.9975 2C11.5557 2.00045 11.1266 2.14714 10.777 2.41717C10.4274 2.6872 10.177 3.06538 10.0649 3.49267C9.95287 3.91997 9.98544 4.37235 10.1575 4.77919C10.3296 5.18604 10.6316 5.52445 11.0163 5.74162L11.0063 5.75962C10.3513 7.12662 9.44128 9.08462 8.03628 9.81962C6.88228 10.4226 5.22628 10.1196 3.99628 9.89362C3.97655 9.61393 3.87882 9.34538 3.71419 9.11842C3.54955 8.89146 3.3246 8.71519 3.06486 8.6096C2.80511 8.50402 2.52097 8.47335 2.24468 8.52107C1.96839 8.5688 1.711 8.693 1.50173 8.8796C1.29246 9.0662 1.13967 9.30772 1.06071 9.57676C0.981749 9.84579 0.979774 10.1316 1.05501 10.4017C1.13024 10.6718 1.27968 10.9154 1.48635 11.1049C1.69303 11.2943 1.94867 11.4221 2.22428 11.4736L5.17228 19.0836C5.39091 19.6478 5.77501 20.1327 6.27418 20.4746C6.77334 20.8166 7.36423 20.9996 7.96928 20.9996H16.0293C16.6343 20.9996 17.2252 20.8166 17.7244 20.4746C18.2236 20.1327 18.6077 19.6478 18.8263 19.0836L21.7733 11.4736C22.0472 11.4227 22.3014 11.2964 22.5076 11.1091C22.7138 10.9217 22.8637 10.6807 22.9406 10.4129C23.0175 10.1452 23.0183 9.86131 22.9429 9.59313C22.8675 9.32494 22.719 9.08304 22.5139 8.89454C22.3088 8.70603 22.0552 8.57837 21.7816 8.52585C21.5081 8.47332 21.2253 8.49803 20.9649 8.59718C20.7046 8.69633 20.477 8.86602 20.3077 9.08723C20.1384 9.30844 20.034 9.57244 20.0063 9.84962C18.7473 10.0126 17.1243 10.2206 15.9623 9.61362C14.5853 8.89362 13.6623 7.07062 12.9863 5.73962Z" fill="#265090"/>
    </svg>
  );
}
