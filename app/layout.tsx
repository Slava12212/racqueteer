import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteOptions } from "@/lib/wp-api";
import { getNavbarContent, getFooterContent } from "@/lib/api";
import type { NavbarContent, FooterContent } from "@/types";

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
  let navbarContent: NavbarContent;
  if (navbar && navbar.navLinks && navbar.navLinks.length > 0) {
    navbarContent = {
      logoUrl: navbar.navLogo?.sourceUrl ?? "/logo2.svg",
      logoAlt: navbar.navLogo?.altText ?? "Racqueteer",
      logoIconUrl: navbar.navLogoIcon?.sourceUrl ?? "/logo-icon.png",
      ctaText: navbar.navCtaText ?? "Book a Court",
      ctaUrl: navbar.navCtaUrl ?? "#",
      menuLinks: navbar.navLinks,
    };
  } else {
    navbarContent = await getNavbarContent();
  }

  // Convert WP data → FooterContent, OR use hardcoded fallback
  let footerContent: FooterContent;
  if (footer && footer.footerEmail) {
    footerContent = {
      logoUrl: footer.footerLogo?.sourceUrl ?? "/logo2.svg",
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
    footerContent = await getFooterContent();
  }

  return (
    <html lang="en">
      <body className="font-mona-sans antialiased">
        <Navbar content={navbarContent} />
        {children}
        <Footer content={footerContent} />
      </body>
    </html>
  );
}
