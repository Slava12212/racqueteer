import MissionSection from '@/components/about/MissionSection';
import type { WPMissionAttributes } from '@/types/wp-blocks';

export default function MissionBlock(attrs: WPMissionAttributes) {
  return (
    <MissionSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        imageUrl: attrs.image,
      }}
    />
  );
}

