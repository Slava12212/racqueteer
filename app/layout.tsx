import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteOptions } from "@/lib/wp-api";
import { getNavbarContent, getFooterContent } from "@/lib/api";
import type { NavbarContent, FooterContent } from "@/types";
import { CtaProvider } from "@/lib/navbar-cta";
import BookModal from "@/components/BookModal";

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
        url: "/og-image.jpg", // You'll need to add this image to public/
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
    images: ["/og-image.jpg"],
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
  // Fetch WP Options (navbar/footer). Falls back to null on error.
  const { navbar, footer } = await getSiteOptions();

  // Convert WP data → NavbarContent, OR use hardcoded fallback
  const hardcodedNavbar = await getNavbarContent();
  let navbarContent: NavbarContent;
  if (navbar && navbar.navLinks && navbar.navLinks.length > 0) {
    // Prefer WP logo URL; fall back to hardcoded logo (not the sponsor /logo2.svg)
    const wpLogoUrl = navbar.navLogo?.sourceUrl;
    const wpLogoIconUrl = navbar.navLogoIcon?.sourceUrl;
    navbarContent = {
      logoUrl:     wpLogoUrl     || hardcodedNavbar.logoUrl,
      logoAlt:     navbar.navLogo?.altText ?? "Racqueteer",
      logoIconUrl: wpLogoIconUrl || hardcodedNavbar.logoIconUrl,
      ctaText:     navbar.navCtaText ?? "Book a Court",
      ctaUrl:      navbar.navCtaUrl  ?? "#",
      menuLinks:   navbar.navLinks,
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
        <CtaProvider ctaText={navbarContent.ctaText} ctaUrl={navbarContent.ctaUrl}>
          <Navbar content={navbarContent} />
          {children}
          <Footer content={footerContent} />
        </CtaProvider>
      </body>
    </html>
  );
}
