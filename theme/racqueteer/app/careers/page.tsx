import { Metadata } from "next";
import HeroCareers from "@/components/careers/HeroCareers";
import JobListingsSection from "@/components/careers/JobListingsSection";
import CareerContactSection from "@/components/careers/CareerContactSection";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBlocks, getJobs } from "@/lib/wp-api";
import { getCareersPageContent } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers - Racqueteer",
  description: "Join the Racqueteer team! Explore career opportunities in coaching, club management, hospitality, and more. Be part of Sydney's premier sports community.",
};

export default async function CareersPage() {
  // Fetch blocks and jobs in parallel — jobs pre-fetched so they are always from WP
  const [blocks, wpJobs] = await Promise.all([
    getPageBlocks("/careers"),
    getJobs(),
  ]);

  if (blocks.length > 0) {
    // Inject pre-fetched WP jobs into the JobListings block so it never double-fetches
    const enrichedBlocks = blocks.map((block) => {
      if (
        block.name === "AcfRacqueteerJobListingsBlock" ||
        block.name === "acf/racqueteer-job-listings"
      ) {
        return {
          ...block,
          attributes: { ...block.attributes, preloadedJobs: wpJobs },
        };
      }
      return block;
    });
    return (
      <div className="overflow-x-hidden">
        <BlockRenderer blocks={enrichedBlocks} />
      </div>
    );
  }

  // Fallback — use WP jobs (not hardcoded) so the count is always correct
  const pageContent = await getCareersPageContent();
  return (
    <div className="overflow-x-hidden">
      <HeroCareers content={pageContent.hero} />
      <JobListingsSection content={pageContent.jobListingsHeader} jobs={wpJobs} />
      <CareerContactSection content={pageContent.careerContact} />
    </div>
  );
}
