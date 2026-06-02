"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavbarContent } from "@/types";
import ButtonArrow from "./ButtonArrow";
import { useCta } from "@/lib/navbar-cta";

interface NavbarProps {
  content: NavbarContent;
}

// Progressive blur component for navigation (blur increases going UP)
const NavProgressiveBlur = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(1px)",
        maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(2px)",
        maskImage: "linear-gradient(to bottom, black 15%, transparent 85%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 15%, transparent 85%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(4px)",
        maskImage: "linear-gradient(to bottom, black 25%, transparent 90%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 25%, transparent 90%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(8px)",
        maskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(16px)",
        maskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
      }}
    />
  </div>
);

export default function Navbar({ content }: NavbarProps) {
  const [visible, setVisible] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const { openBookModal } = useCta();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 100) {
        setVisible(true);
      } else if (currentY < lastScrollY.current) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for theme detection
  useEffect(() => {
    const sections = document.querySelectorAll("[data-header-theme]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const theme = (entry.target as HTMLElement).dataset.headerTheme;
            setIsDark(theme === "dark");
          }
        }
      },
      {
        rootMargin: "0px 0px -95% 0px",
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const textColor = isDark ? "text-white" : "text-black";
  const hoverClass = isDark ? "hover:opacity-70" : "hover:opacity-60";
  const linkClasses = `${textColor} text-[11px] lg:text-[14px] font-bold uppercase tracking-[1.4px] ${hoverClass} transition-all duration-300`;
  
  const ctaBg = isDark ? "btn-cta-white text-[#003E6B]" : "btn-cta-red text-white";
  const ctaArrowColor = isDark ? "#003E6B" : "white";
  
  const logoStyle = isDark ? {} : { filter: "brightness(0)" };

  // Burger/close icon color
  const iconColor = menuOpen ? "white" : (isDark ? "white" : "black");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 ease-in-out ${menuOpen ? "z-[60]" : "z-50"}`}
        style={{
          background: menuOpen ? "transparent" : "rgba(210,212,223,0.01)",
          transform: visible || menuOpen ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        {!menuOpen && <NavProgressiveBlur />}
        <div className="flex items-center justify-between max-w-[1920px] mx-auto px-6 md:px-10 lg:px-[80px] py-5 md:py-[55px] relative min-h-[80px] md:min-h-[139px]">
          {/* Left: Logo (mobile) / nav links (desktop) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {content.menuLinks.slice(1, 4).map((link) => {
              const LinkEl = link.url.startsWith("#") ? "a" : Link;
              return (
                <LinkEl key={link.label} href={link.url} className={linkClasses}>
                  {link.label}
                </LinkEl>
              );
            })}
          </div>

          {/* Mobile: Logo icon left (provided icon, recolorable) */}
          <Link href="/" className="md:hidden relative z-[60]" onClick={() => setMenuOpen(false)}>
            <img
              src={content.logoIconUrl}
              alt={content.logoAlt}
              className="h-10 w-auto transition-all duration-300"
              style={menuOpen ? {} : (isDark ? {} : { filter: "brightness(0)" })}
            />
          </Link>

          {/* Desktop: Center logo only on 3xl+ (1920px+) to prevent overlap at <1600px */}
          <Link href="/" className="hidden md:block 2xl:absolute 2xl:left-1/2 2xl:-translate-x-1/2">
            <img
              src={content.logoUrl}
              alt={content.logoAlt}
              className="h-6 md:h-8 w-auto transition-all duration-300"
              style={logoStyle}
            />
          </Link>

          {/* Mobile: Centered CTA button */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-[60]">
            {!menuOpen && (
              <button
                type="button"
                onClick={openBookModal}
                className={`btn-cta flex items-center gap-2 ${ctaBg} text-[11px] font-bold uppercase tracking-[1.4px] px-4 py-2 rounded-sm transition-all duration-300`}
              >
                {content.ctaText}
                <ButtonArrow color={ctaArrowColor} />
              </button>
            )}
          </div>

          {/* Right nav links + CTA (desktop) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {content.menuLinks.slice(4, 7).map((link) => {
              const LinkEl = link.url.startsWith("#") ? "a" : Link;
              return (
                <LinkEl key={link.label} href={link.url} className={linkClasses}>
                  {link.label}
                </LinkEl>
              );
            })}
            <button
              type="button"
              onClick={openBookModal}
              className={`btn-cta flex items-center gap-3 ${ctaBg} text-[11px] lg:text-[14px] font-bold uppercase px-4 lg:px-6 py-2 rounded-sm transition-all duration-300`}
            >
              {content.ctaText}
              <ButtonArrow color={ctaArrowColor} />
            </button>
          </div>

          {/* Mobile: Burger / Close button */}
          <button
            className="md:hidden relative z-[60] flex items-center justify-center w-10 h-10"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              /* Close (X) icon */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              /* Burger icon */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21M3 12H21M3 18H21" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ──── Fullscreen Mobile Menu ──── */}
      <div
        className={`fixed inset-0 z-[55] md:hidden flex flex-col transition-all duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          backgroundColor: "rgba(0, 0, 0, 0.50)",
        }}
      >
        {/* Spacer for nav height */}
        <div className="min-h-[80px] shrink-0" />

        {/* Full logo + Links — centered in remaining space */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6">
          {content.menuLinks.map((link) => {
            const isActive = pathname === link.url;
            const LinkEl = link.url.startsWith("#") ? "a" : Link;
            const props = link.url.startsWith("#")
              ? { href: link.url, onClick: () => setMenuOpen(false) }
              : { href: link.url, onClick: () => setMenuOpen(false) };

            return (
              <LinkEl
                key={link.label}
                {...(props as any)}
                className={`text-white transition-opacity ${
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  fontFamily: '"Mona Sans", sans-serif',
                  fontWeight: 500,
                  fontStretch: '125%',
                  fontSize: '24px',
                  lineHeight: '120%',
                  letterSpacing: '0',
                }}
              >
                {link.label}
              </LinkEl>
            );
          })}
        </div>

        {/* Bottom: Book a Court button */}
        <div className="px-6 pb-10">
          <button
            type="button"
            onClick={() => {
              openBookModal();
              setMenuOpen(false);
            }}
            className="btn-cta btn-cta-red flex items-center justify-center gap-3 text-white text-sm font-bold uppercase tracking-wider px-10 py-4 rounded-sm w-full transition-colors"
          >
            {content.ctaText}
            <ButtonArrow color="white" />
          </button>
        </div>
      </div>
    </>
  );
}
