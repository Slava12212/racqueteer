import HeroCareers from '@/components/careers/HeroCareers';
import type { WPCareersHeroAttributes } from '@/types/wp-blocks';

export default function CareersHeroBlock(attrs: WPCareersHeroAttributes) {
  return (
    <HeroCareers
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        videoUrl: attrs.videoUrl,
      }}
    />
  );
}

