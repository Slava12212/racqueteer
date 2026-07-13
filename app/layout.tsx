import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteOptions } from "@/lib/wp-api";
import { getNavbarContent, getFooterContent } from "@/lib/api";
import type { NavbarContent, FooterContent } from "@/types";
import { CtaProvider } from "@/lib/navbar-cta";

export const metadata: Metadata = {
  metadataBase: new URL('https://racqueteer.vercel.app'),
  title: "Racqueteer - Premier Pickleball & Padel Club",
  description: "Experience world-class pickleball and padel at Racqueteer. Premium courts, expert coaching, luxury amenities, and vibrant community in Sydney, Australia.",
  keywords: ["pickleball", "padel", "sports club", "Sydney", "fitness", "membership"],
  authors: [{ name: "Racqueteer" }],
  openGraph: {
    title: "Racqueteer - Premier Pickleball & Padel Club",
    description: "Experience world-class pickleball and padel at Racqueteer. Premium courts, expert coaching, luxury amenities, and vibrant community.",
    url: "https://racqueteer.com",
    siteName: "Racqueteer",
    images: [
      {
        url: "https://cdn.builder.io/api/v1/image/assets/1e8c7b62118c49ceb84fba99d4c44471/44e9d92b87a543418f5003c61070b2df?format=webp&width=1200",
        width: 1200,
        height: 630,
        alt: "Racqueteer - Pickleball & Padel Club",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Racqueteer - Premier Pickleball & Padel Club",
    description: "Experience world-class pickleball and padel. Premium courts, expert coaching, luxury amenities.",
    images: ["https://cdn.builder.io/api/v1/image/assets/1e8c7b62118c49ceb84fba99d4c44471/44e9d92b87a543418f5003c61070b2df?format=webp&width=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch WP Options (navbar/footer/bookModal). Falls back to null on error.
  const { navbar, footer, bookModal } = await getSiteOptions();

  // Convert WP data → NavbarContent, OR use hardcoded fallback
  const hardcodedNavbar = await getNavbarContent();
  let navbarContent: NavbarContent;
  if (navbar && navbar.navLinks && navbar.navLinks.length > 0) {
    // Prefer WP logo URL; fall back to hardcoded logo (not the sponsor /logo2.svg)
    const wpLogoUrl = navbar.navLogo?.sourceUrl;
    const wpLogoIconUrl = navbar.navLogoIcon?.sourceUrl;

    // Normalise WP navLinks: strip full domain → relative path for Next.js <Link>
    const wpNavLinks = navbar.navLinks.map((link) => {
      let url = link.url;
      try {
        const parsed = new URL(url);
        url = parsed.pathname; // strip domain, keep path only
      } catch {
        // already relative — leave as-is
      }
      return { label: link.label, url };
    });

    // Build a lookup from WP links by label (lowercased)
    const wpLookup = new Map(wpNavLinks.map((l) => [l.label.toLowerCase(), l.url]));

    // Use the hardcoded menuLinks order as the base, but pull URLs from WP when available.
    // This ensures the correct order and all desired links, even if WP is incomplete.
    const mergedLinks = hardcodedNavbar.menuLinks.map((link) => {
      const wpUrl = wpLookup.get(link.label.toLowerCase());
      return { label: link.label, url: wpUrl ?? link.url };
    });

    navbarContent = {
      logoUrl:     wpLogoUrl     || hardcodedNavbar.logoUrl,
      logoAlt:     navbar.navLogo?.altText ?? "Racqueteer",
      logoIconUrl: wpLogoIconUrl || hardcodedNavbar.logoIconUrl,
      ctaText:     navbar.navCtaText ?? "Book a Court",
      ctaUrl:      navbar.navCtaUrl  ?? "#",
      menuLinks:   mergedLinks,
    };
  } else {
    navbarContent = hardcodedNavbar;
  }

  // Convert WP data → FooterContent, OR use hardcoded fallback
  const hardcodedFooter = await getFooterContent();
  let footerContent: FooterContent;
  if (footer && footer.footerEmail) {
    const wpFooterLogoUrl = footer.footerLogo?.sourceUrl;
    footerContent = {
      logoUrl: wpFooterLogoUrl || hardcodedFooter.logoUrl,
      logoAlt: footer.footerLogo?.altText ?? "Racqueteer",
      contactLabel: "Contact Us",
      email: footer.footerEmail ?? "",
      phone: footer.footerPhone ?? "",
      ctaText: footer.footerCtaText ?? "Book a Court",
      ctaUrl: footer.footerCtaUrl ?? "#",
      menuLabel: "Menu",
      menuLinks: footer.footerMenuLinks ?? [],
      locationsLabel: "Locations",
      locations: footer.footerLocations ?? [],
      copyrightText: footer.footerCopyright ?? `© ${new Date().getFullYear()} Racqueteer. All rights reserved.`,
      legalLinks: footer.footerLegalLinks ?? [],
    };
  } else {
    footerContent = hardcodedFooter;
  }

  return (
    <html lang="en">
      <body className="font-mona-sans antialiased">
        <CtaProvider ctaText={navbarContent.ctaText} ctaUrl={navbarContent.ctaUrl} bookModalOptions={bookModal}>
          <Navbar content={navbarContent} />
          {children}
          <Footer content={footerContent} />
        </CtaProvider>
      </body>
    </html>
  );
}
