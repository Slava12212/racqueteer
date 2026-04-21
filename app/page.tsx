import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import LocationsSection from "@/components/LocationsSection";
import ProgramsSection from "@/components/ProgramsSection";
import MembershipSection from "@/components/MembershipSection";
import HomeSubscriptionsSection from "@/components/HomeSubscriptionsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import { getHomepageContent, getNavbarContent, getFooterContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Racqueteer - Premier Pickleball & Padel Club in Sydney",
  description: "Join Sydney's premier pickleball and padel club. State-of-the-art courts, expert coaching, luxury amenities, and vibrant community. Book your court today!",
};

export default async function HomePage() {
  const homepageContent = await getHomepageContent();
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();

  return (
    <div className="overflow-x-hidden">
      <Navbar content={navbarContent} />
      <HeroSection content={homepageContent.hero} />
      <AboutSection content={homepageContent.about} />
      <LocationsSection content={homepageContent.locations} />
      <ProgramsSection content={homepageContent.programs} />
      {/* Hidden per Alex's request */}
      {/* <AmenitiesSection /> */}
      {/* Hidden per Alex's request */}
      {/* <MembershipSection content={homepageContent.membership} /> */}
      <HomeSubscriptionsSection content={homepageContent.subscriptions} />
      <TestimonialsSection content={homepageContent.testimonials} />
      <EventsSection content={homepageContent.events} />
      <Footer content={footerContent} />
    </div>
  );
}
