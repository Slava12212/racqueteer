import JobListingsSection from '@/components/careers/JobListingsSection';
import { getJobs } from '@/lib/wp-api';
import type { WPJobListingsAttributes } from '@/types/wp-blocks';
import type { Job } from '@/types';

interface Props extends WPJobListingsAttributes {
  /** Pre-fetched WP jobs passed from CareersPage to avoid a redundant fetch. */
  preloadedJobs?: Job[];
}

export default async function JobListingsBlock(attrs: Props) {
  // Use pre-fetched jobs if available (passed from page), otherwise fetch directly
  const jobs =
    attrs.preloadedJobs && attrs.preloadedJobs.length > 0
      ? attrs.preloadedJobs
      : await getJobs();

  return (
    <JobListingsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
      jobs={jobs}
    />
  );
}
