"use client";

import { useState, useEffect } from "react";

import ScrollReveal from "../ScrollReveal";

import ButtonArrow from "../ButtonArrow";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
}

interface JobListingsSectionProps {
  content: {
    label: string;
    title: string;
    description: string;
  };
  /** Jobs from WordPress. If omitted, falls back to placeholder data. */
  jobs?: Job[];
}

const FALLBACK_JOBS: Job[] = [
  {
    id: 1,
    title: "Club Operations Manager",
    description: "Lead daily operations, manage staff scheduling, oversee member relations, and ensure an exceptional experience across all club facilities.",
    category: "Manager",
    date: "Apr 1, 2026",
  },
  {
    id: 2,
    title: "Assistant Club Operations Manager",
    description: "Support the Club Manager in daily operations, coordinate events, handle member inquiries, and step in as acting manager when needed.",
    category: "Manager",
    date: "Apr 1, 2026",
  },
  {
    id: 3,
    title: "Head Pickleball & Padel Coach",
    description: "Design and lead pickleball training programs for all skill levels. Conduct private lessons, group clinics, and competitive development sessions.",
    category: "Trainer",
    date: "Mar 28, 2026",
  },
  {
    id: 4,
    title: "Padel Training Specialist",
    description: "Deliver high-energy padel coaching sessions, develop player technique, and help grow the padel community at the club through engaging programs.",
    category: "Trainer",
    date: "Mar 25, 2026",
  },
  {
    id: 5,
    title: "Youth Development Program Coach",
    description: "Run junior development programs, create age-appropriate training plans, and build a fun and encouraging environment for young players.",
    category: "Trainer",
    date: "Mar 20, 2026",
  },
  {
    id: 6,
    title: "Lead Barista & Café Manager",
    description: "Manage the club café, craft specialty coffee and drinks, maintain quality standards, and train new barista team members.",
    category: "Barista",
    date: "Apr 3, 2026",
  },
  {
    id: 7,
    title: "Barista",
    description: "Prepare and serve premium beverages, maintain a clean and welcoming café space, and provide excellent customer service to members and guests.",
    category: "Barista",
    date: "Apr 3, 2026",
  },
  {
    id: 8,
    title: "Front Desk & Member Services Associate",
    description: "Welcome members and guests, handle court bookings, answer questions, and ensure smooth check-in and check-out experiences daily.",
    category: "Manager",
    date: "Mar 15, 2026",
  },
];

const categories = ["All", "Manager", "Trainer", "Barista"];

export default function JobListingsSection({ content, jobs: jobsProp }: JobListingsSectionProps) {
  const [jobs, setJobs] = useState<Job[]>(jobsProp && jobsProp.length > 0 ? jobsProp : FALLBACK_JOBS);

  // If server didn't pass jobs (old deployment / fallback path), fetch from API
  useEffect(() => {
    if (!jobsProp || jobsProp.length === 0) {
      fetch("/api/debug-jobs")
        .then((r) => r.json())
        .then((data) => {
          if (data.jobs && data.jobs.length > 0) {
            setJobs(data.jobs);
          }
        })
        .catch(() => {/* keep fallback */});
    }
  }, [jobsProp]);

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredJobs = activeCategory === "All" ? jobs : jobs.filter((j) => j.category === activeCategory);

  return (
    <section data-header-theme="light" className="bg-[#F4F6F9] py-16 sm:py-[120px] px-6 sm:px-8 lg:px-[80px]">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <ScrollReveal from="bottom" delay={0}>
            <p className="text-[12px] font-medium text-[#265090] tracking-[2.4px] uppercase mb-4">
              {content.label}
            </p>
          </ScrollReveal>
          <ScrollReveal from="bottom" delay={100}>
            <h2
              className="text-[20px] sm:text-[32px] lg:text-[40px] text-[#265090] uppercase leading-[120%] mb-6"
              style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: "125%", letterSpacing: "0.05em" }}
            >
              {content.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal from="bottom" delay={200}>
            <p className="text-sm sm:text-base text-[#6B7280] leading-6 max-w-xl mx-auto">
              {content.description}
            </p>
          </ScrollReveal>
        </div>

        {/* Filter tabs */}
        <ScrollReveal from="bottom" delay={250}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-sm text-xs sm:text-sm font-bold uppercase tracking-[1.2px] transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#265090] text-white"
                    : "bg-white text-[#265090] border border-[#E5E7EB] hover:border-[#265090]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Job cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredJobs.map((job, i) => (
            <ScrollReveal key={job.id} from="bottom" delay={300 + i * 80}>
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 sm:p-8 flex flex-col h-full hover:shadow-md hover:border-[#265090]/20 transition-all duration-300">
                {/* Top row: tag + date */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-[1px] bg-[#265090]/10 text-[#265090]">
                    {job.category}
                  </span>
                  <span className="text-xs text-[#6B7280]">{job.date}</span>
                </div>

                {/* Title — fixed 2-line height */}
                <h3
                  className="text-lg sm:text-xl font-bold text-black leading-[130%] line-clamp-2 mb-4"
                  style={{ 
                    fontFamily: '"Mona Sans", sans-serif', 
                    fontWeight: 700, 
                    fontStretch: "125%",
                    minHeight: '2.6em'
                  }}
                >
                  {job.title}
                </h3>

                {/* Description — fixed 3-line height */}
                <p 
                  className="text-[17px] text-[#6B7280] leading-6 line-clamp-3 mb-4"
                  style={{ minHeight: '4.5em' }}
                >
                  {job.description}
                </p>

                {/* CTA */}
                <button className="btn-cta btn-cta-blue flex items-center justify-center gap-3 w-full py-3.5 rounded-sm font-bold text-sm uppercase tracking-wider text-white transition-colors mt-auto">
                  <span>View Details</span>
                  <ButtonArrow color="white" />
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty state */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#6B7280] text-lg">No open positions in this category right now. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
