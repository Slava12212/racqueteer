import { Metadata } from "next";
import HeroAbout from "@/components/about/HeroAbout";
import MissionSection from "@/components/about/MissionSection";
import LocationsSection from "@/components/LocationsSection";
import ContactSection from "@/components/about/ContactSection";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBlocks } from "@/lib/wp-api";
import { getAboutPageContent, getHomepageContent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us - Racqueteer",
  description: "Learn about Racqueteer's mission to build a thriving pickleball and padel community in Sydney. Discover our story, values, and commitment to excellence.",
};

export default async function AboutPage() {
  const blocks = await getPageBlocks("/about");

  if (blocks.length > 0) {
    return (
      <div className="overflow-x-hidden">
        <BlockRenderer blocks={blocks} />
      </div>
    );
  }

  // Fallback — hardcoded content
  const pageContent = await getAboutPageContent();
  const homepageContent = await getHomepageContent();
  return (
    <div className="overflow-x-hidden">
      <HeroAbout content={pageContent.hero} />
      <MissionSection content={pageContent.mission} />
      <LocationsSection content={homepageContent.locations} />
      <ContactSection content={pageContent.contact} />
    </div>
  );
}
