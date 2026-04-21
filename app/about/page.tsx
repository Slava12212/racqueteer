import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroAbout from "@/components/about/HeroAbout";
import MissionSection from "@/components/about/MissionSection";
import LocationsSection from "@/components/LocationsSection";
import ContactSection from "@/components/about/ContactSection";
import Footer from "@/components/Footer";
import { getNavbarContent, getFooterContent, getAboutPageContent, getHomepageContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "About Us - Racqueteer",
  description: "Learn about Racqueteer's mission to build a thriving pickleball and padel community in Sydney. Discover our story, values, and commitment to excellence.",
};

export default async function AboutPage() {
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();
  const pageContent = await getAboutPageContent();
  const homepageContent = await getHomepageContent();

  return (
    <div className="overflow-x-hidden">
      <Navbar content={navbarContent} />
      <HeroAbout content={pageContent.hero} />
      <MissionSection content={pageContent.mission} />
      <LocationsSection content={homepageContent.locations} />
      <ContactSection content={pageContent.contact} />
      <Footer content={footerContent} />
    </div>
  );
}
