// Server Component — no "use client".
// Fetches amenities directly from the CPT via WPGraphQL.
import { AmenitiesSection } from "@/components/amenities/AmenitiesSection";
import { getAmenities } from "@/lib/wp-api";
import { resolveAmenityIcon } from "@/lib/amenity-resolver";
import type { WPAmenitiesAttributes } from "@/types/wp-blocks";
import type { Amenity } from "@/components/amenities/amenitiesData";

export default async function AmenitiesBlock(attrs: WPAmenitiesAttributes) {
  let frontendAmenities: Amenity[] | undefined;

  try {
    const cptAmenities = await getAmenities();
    if (cptAmenities.length > 0) {
      frontendAmenities = cptAmenities.map((item) => ({
        id:          item.id,
        title:       item.title,
        number:      item.number,
        imageLayout: item.imageLayout,
        images:      item.images,
        features: [
          { icon: resolveAmenityIcon(item.feature1Icon), text: item.feature1Text },
          { icon: resolveAmenityIcon(item.feature2Icon), text: item.feature2Text },
        ],
      } as Amenity));
    }
  } catch (err) {
    console.error('[AmenitiesBlock] CPT fetch failed:', err);
    // frontendAmenities stays undefined → AmenitiesSection uses hardcoded static data
  }

  return (
    <AmenitiesSection
      content={{ label: attrs.label, title: attrs.title }}
      amenities={frontendAmenities}
    />
  );
}