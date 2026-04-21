import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroPrivateEvents from "@/components/private-events/HeroPrivateEvents";
import GallerySection from "@/components/private-events/GallerySection";
import LogoSection from "@/components/private-events/LogoSection";
import Footer from "@/components/Footer";
import { getNavbarContent, getFooterContent, getPrivateEventsPageContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Private Events - Racqueteer",
  description: "Host unforgettable private events at Racqueteer. Corporate functions, team building, birthday parties, and special celebrations on world-class courts.",
};

export default async function PrivateEventsPage() {
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();
  const pageContent = await getPrivateEventsPageContent();

  return (
    <div className="overflow-x-hidden">
      <Navbar content={navbarContent} />
      <HeroPrivateEvents content={pageContent.hero} />
      <GallerySection content={pageContent.gallery} />
      <LogoSection content={pageContent.logos} />
      <Footer content={footerContent} />
    </div>
  );
}
