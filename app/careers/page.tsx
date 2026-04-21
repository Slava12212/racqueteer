import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroCareers from "@/components/careers/HeroCareers";
import JobListingsSection from "@/components/careers/JobListingsSection";
import CareerContactSection from "@/components/careers/CareerContactSection";
import Footer from "@/components/Footer";
import { getNavbarContent, getFooterContent, getCareersPageContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Careers - Racqueteer",
  description: "Join the Racqueteer team! Explore career opportunities in coaching, club management, hospitality, and more. Be part of Sydney's premier sports community.",
};

export default async function CareersPage() {
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();
  const pageContent = await getCareersPageContent();

  return (
    <div className="overflow-x-hidden">
      <Navbar content={navbarContent} />
      <HeroCareers content={pageContent.hero} />
      <JobListingsSection content={pageContent.jobListingsHeader} />
      <CareerContactSection content={pageContent.careerContact} />
      <Footer content={footerContent} />
    </div>
  );
}
