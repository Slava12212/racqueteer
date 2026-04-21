import LocationsSection from '@/components/LocationsSection';
import type { WPLocationsAttributes } from '@/types/wp-blocks';

export default function LocationsBlock(attrs: WPLocationsAttributes) {
  return (
    <LocationsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
    />
  );
}

