import { Metadata } from "next";
import HeroPrivateEvents from "@/components/private-events/HeroPrivateEvents";
import GallerySection from "@/components/private-events/GallerySection";
import LogoSection from "@/components/private-events/LogoSection";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBlocks } from "@/lib/wp-api";
import { getPrivateEventsPageContent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Private Events - Racqueteer",
  description: "Host unforgettable private events at Racqueteer. Corporate functions, team building, birthday parties, and special celebrations on world-class courts.",
};

export default async function PrivateEventsPage() {
  const blocks = await getPageBlocks("/private-events");

  if (blocks.length > 0) {
    return (
      <div className="overflow-x-hidden">
        <BlockRenderer blocks={blocks} />
      </div>
    );
  }

  // Fallback — hardcoded content
  const pageContent = await getPrivateEventsPageContent();
  return (
    <div className="overflow-x-hidden">
      <HeroPrivateEvents content={pageContent.hero} />
      <GallerySection content={pageContent.gallery} />
      <LogoSection content={pageContent.logos} />
    </div>
  );
}
