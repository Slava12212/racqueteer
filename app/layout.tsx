import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mona-sans antialiased">
        {children}
      </body>
    </html>
  );
}
