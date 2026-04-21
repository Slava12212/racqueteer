import JobListingsSection from '@/components/careers/JobListingsSection';
import type { WPJobListingsAttributes } from '@/types/wp-blocks';

export default function JobListingsBlock(attrs: WPJobListingsAttributes) {
  return (
    <JobListingsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
    />
  );
}

