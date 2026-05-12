// Server Component — no "use client".
// Can be async and call getAmenities() directly for CPT fallback.
import { AmenitiesSection } from "@/components/amenities/AmenitiesSection";
import { getAmenities } from "@/lib/wp-api";
import { resolveAmenityIcon } from "@/lib/amenity-icons";
import type { WPAmenitiesAttributes, WPAmenityItem } from "@/types/wp-blocks";
import type { Amenity } from "@/components/amenities/amenitiesData";

export default async function AmenitiesBlock(attrs: WPAmenitiesAttributes) {
  // ── Step 1: Try to use amenity items from the Gutenberg block repeater ──────
  let wpAmenities: WPAmenityItem[] = [];

  if (Array.isArray(attrs.amenities)) {
    wpAmenities = attrs.amenities as WPAmenityItem[];
  } else if (typeof attrs.amenities === 'string' && attrs.amenities) {
    try {
      wpAmenities = JSON.parse(attrs.amenities);
    } catch {
      wpAmenities = [];
    }
  }

  let frontendAmenities: Amenity[] | undefined;

  if (wpAmenities.length > 0) {
    // Convert block-repeater items → Amenity[]
    frontendAmenities = wpAmenities.map((item, index) => {
      let images: string[] = [];
      if (Array.isArray(item.images)) {
        images = item.images as string[];
      } else if (typeof item.images === 'string' && item.images) {
        try { images = JSON.parse(item.images); } catch { images = [item.images]; }
      } else if (item.images) {
        images = [item.images as string];
      }

      return {
        id: index + 1,
        title: item.title || '',
        number: item.number || String(index + 1).padStart(2, '0'),
        imageLayout: item.imageLayout === 'split' ? 'split' : 'single',
        images,
        features: [
          { icon: resolveAmenityIcon(item.feature1Icon), text: item.feature1Text || '' },
          { icon: resolveAmenityIcon(item.feature2Icon), text: item.feature2Text || '' },
        ],
      } as Amenity;
    });
  } else {
    // ── Step 2: Block repeater is empty — fetch from CPT amenities ─────────────
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
      console.error('[AmenitiesBlock] CPT fallback failed:', err);
      // frontendAmenities stays undefined → AmenitiesSection uses hardcoded static data
    }
  }

  // When no WP data is found, AmenitiesSection falls back to hardcoded amenitiesData.tsx
  return (
    <AmenitiesSection
      content={{ label: attrs.label, title: attrs.title }}
      amenities={frontendAmenities}
    />
  );
}