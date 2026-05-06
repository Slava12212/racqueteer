import { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import LocationsSection from "@/components/LocationsSection";
import ProgramsSection from "@/components/ProgramsSection";
import HomeSubscriptionsSection from "@/components/HomeSubscriptionsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import EventsSection from "@/components/EventsSection";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBlocks } from "@/lib/wp-api";
import { getHomepageContent, getLocations } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Racqueteer - Premier Pickleball & Padel Club in Sydney",
  description: "Join Sydney's premier pickleball and padel club. State-of-the-art courts, expert coaching, luxury amenities, and vibrant community. Book your court today!",
};

export default async function HomePage() {
  const blocks = await getPageBlocks("/");

  // If WP blocks available — render via BlockRenderer
  if (blocks.length > 0) {
    return (
      <div className="overflow-x-hidden">
        <BlockRenderer blocks={blocks} />
      </div>
    );
  }

  // Fallback — hardcoded content while WP isn't configured yet
  const [content, locations] = await Promise.all([
    getHomepageContent(),
    getLocations(),
  ]);
  return (
    <div className="overflow-x-hidden">
      <HeroSection content={content.hero} />
      <AboutSection content={content.about} />
      <LocationsSection content={content.locations} locations={locations} />
      <ProgramsSection content={content.programs} />
      {/* Hidden per Alex's request */}
      {/* <MembershipSection content={content.membership} /> */}
      <HomeSubscriptionsSection content={content.subscriptions} />
      <TestimonialsSection content={content.testimonials} />
      <EventsSection content={content.events} />
    </div>
  );
}
