import LocationsSection from '@/components/LocationsSection';
import { getLocations } from '@/lib/wp-api';
import type { WPLocationsAttributes } from '@/types/wp-blocks';

export default async function LocationsBlock(attrs: WPLocationsAttributes) {
  const locations = await getLocations();
  return (
    <LocationsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
      locations={locations.length > 0 ? locations : undefined}
    />
  );
}

