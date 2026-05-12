// Server Component — no "use client".
// Fetches amenities directly from the CPT via WPGraphQL.
import { AmenitiesSection } from "@/components/amenities/AmenitiesSection";
import { amenities as fallbackAmenities } from "@/components/amenities/amenitiesData";
import { getAmenities } from "@/lib/wp-api";
import { resolveAmenityIcon } from "@/lib/amenity-resolver";
import type { WPAmenitiesAttributes } from "@/types/wp-blocks";
import type { Amenity } from "@/components/amenities/amenitiesData";

// Fallback images per layout used when CPT amenity has no images yet
const FALLBACK_IMAGES: Record<string, string[]> = {
  split:  ['/amenity-courts-1.jpg', '/amenity-courts-2.jpg'],
  single: ['/amenity-lounge-1.jpg'],
};

export default async function AmenitiesBlock(attrs: WPAmenitiesAttributes) {
  let frontendAmenities: Amenity[] | undefined;

  try {
    const cptAmenities = await getAmenities();
    if (cptAmenities.length > 0) {
      frontendAmenities = cptAmenities.map((item, index) => {
        // Use hardcoded images for same-index item if CPT returns no images
        const hardcodedImages = fallbackAmenities[index]?.images ?? FALLBACK_IMAGES[item.imageLayout] ?? ['/placeholder.svg'];
        return {
          id:          item.id,
          title:       item.title,
          number:      item.number,
          imageLayout: item.imageLayout,
          images:      hardcodedImages,
          features: [
            { icon: resolveAmenityIcon(item.feature1Icon), text: item.feature1Text },
            { icon: resolveAmenityIcon(item.feature2Icon), text: item.feature2Text },
          ],
        } as Amenity;
      });
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