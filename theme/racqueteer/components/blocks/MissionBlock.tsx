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
        stat1Number: attrs.stat1Number,
        stat1Label: attrs.stat1Label,
        stat2Number: attrs.stat2Number,
        stat2Label: attrs.stat2Label,
        stat3Number: attrs.stat3Number,
        stat3Label: attrs.stat3Label,
        stat4Number: attrs.stat4Number,
        stat4Label: attrs.stat4Label,
      }}
    />
  );
}

