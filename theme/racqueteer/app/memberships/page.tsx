import { Metadata } from "next";
import { notFound } from "next/navigation";
import HeroMembership from "@/components/membership/HeroMembership";
import SubscriptionsSection from "@/components/membership/SubscriptionsSection";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageLookup } from "@/lib/wp-api";
import { getMembershipsPageContent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Memberships - Racqueteer",
  description: "Choose the perfect membership plan for your pickleball and padel journey. Flexible options from casual players to serious athletes. Join Racqueteer today!",
};

export default async function MembershipsPage() {
  const pageLookup = await getPageLookup("/memberships");

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
