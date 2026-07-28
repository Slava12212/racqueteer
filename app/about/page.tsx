import { Metadata } from "next";
import { notFound } from "next/navigation";
import HeroAbout from "@/components/about/HeroAbout";
import MissionSection from "@/components/about/MissionSection";
import LocationsSection from "@/components/LocationsSection";
import ContactSection from "@/components/about/ContactSection";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getLocations, getPageLookup } from "@/lib/wp-api";
import { getAboutPageContent, getHomepageContent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us - Racqueteer",
  description: "Learn about Racqueteer's mission to build a thriving pickleball and padel community in Sydney. Discover our story, values, and commitment to excellence.",
};

export default async function AboutPage() {
  const pageLookup = await getPageLookup("/about");

  if (!pageLookup.failed) {
    const page = pageLookup.page;

    if (!page || page.status !== "publish") {
      notFound();
    }

    if (page.blocks.length > 0) {
      return (
        <div className="overflow-x-hidden">
          <BlockRenderer blocks={page.blocks} />
        </div>
      );
    }
  }

  // Fallback — hardcoded content
  const [pageContent, homepageContent, locations] = await Promise.all([
    getAboutPageContent(),
    getHomepageContent(),
    getLocations(),
  ]);
  return (
    <div className="overflow-x-hidden">
      <HeroAbout content={pageContent.hero} />
      <MissionSection content={pageContent.mission} />
      <LocationsSection content={homepageContent.locations} locations={locations} />
      <ContactSection content={pageContent.contact} />
    </div>
  );
}
