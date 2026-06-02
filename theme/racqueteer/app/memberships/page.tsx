import { Metadata } from "next";
import HeroMembership from "@/components/membership/HeroMembership";
import SubscriptionsSection from "@/components/membership/SubscriptionsSection";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBlocks } from "@/lib/wp-api";
import { getMembershipsPageContent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Memberships - Racqueteer",
  description: "Choose the perfect membership plan for your pickleball and padel journey. Flexible options from casual players to serious athletes. Join Racqueteer today!",
};

export default async function MembershipsPage() {
  const blocks = await getPageBlocks("/memberships");

  if (blocks.length > 0) {
    return (
      <div className="overflow-x-hidden">
        <BlockRenderer blocks={blocks} />
      </div>
    );
  }

  // Fallback — hardcoded content
  const pageContent = await getMembershipsPageContent();
  return (
    <div className="overflow-x-hidden">
      <HeroMembership content={pageContent.hero} />
      {/* Hidden per Alex's request — don't delete yet */}
      {/* <MembershipSection className="pt-16 sm:pt-[120px]" /> */}
      <SubscriptionsSection content={pageContent.subscriptionsHeader} />
      {/* Hidden per Alex's request — don't delete yet */}
      {/* <PriceCompareSection /> */}
    </div>
  );
}
