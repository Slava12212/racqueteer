import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroMembership from "@/components/membership/HeroMembership";
import SubscriptionsSection from "@/components/membership/SubscriptionsSection";
import Footer from "@/components/Footer";
import { getNavbarContent, getFooterContent, getMembershipsPageContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Memberships - Racqueteer",
  description: "Choose the perfect membership plan for your pickleball and padel journey. Flexible options from casual players to serious athletes. Join Racqueteer today!",
};

export default async function MembershipsPage() {
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();
  const pageContent = await getMembershipsPageContent();

  return (
    <div className="overflow-x-hidden">
      <Navbar content={navbarContent} />
      <HeroMembership content={pageContent.hero} />
      {/* Hidden per Alex's request — don't delete yet */}
      {/* <MembershipSection className="pt-16 sm:pt-[120px]" /> */}
      <SubscriptionsSection content={pageContent.subscriptionsHeader} />
      {/* Hidden per Alex's request — don't delete yet */}
      {/* <PriceCompareSection /> */}
      <Footer content={footerContent} />
    </div>
  );
}
