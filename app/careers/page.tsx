import { Metadata } from "next";
import HeroCareers from "@/components/careers/HeroCareers";
import JobListingsSection from "@/components/careers/JobListingsSection";
import CareerContactSection from "@/components/careers/CareerContactSection";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBlocks } from "@/lib/wp-api";
import { getCareersPageContent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers - Racqueteer",
  description: "Join the Racqueteer team! Explore career opportunities in coaching, club management, hospitality, and more. Be part of Sydney's premier sports community.",
};

export default async function CareersPage() {
  const blocks = await getPageBlocks("/careers");

  if (blocks.length > 0) {
    return (
      <div className="overflow-x-hidden">
        <BlockRenderer blocks={blocks} />
      </div>
    );
  }

  // Fallback — hardcoded content
  const pageContent = await getCareersPageContent();
  return (
    <div className="overflow-x-hidden">
      <HeroCareers content={pageContent.hero} />
      <JobListingsSection content={pageContent.jobListingsHeader} />
      <CareerContactSection content={pageContent.careerContact} />
    </div>
  );
}
