"use client";

import { AmenitiesSection } from "@/components/amenities/AmenitiesSection";
import type { WPAmenitiesAttributes, WPAmenityItem } from "@/types/wp-blocks";
import type { Amenity } from "@/components/amenities/amenitiesData";

export default function AmenitiesBlock(attrs: WPAmenitiesAttributes) {
  // Parse amenities from WP (could be array or JSON string)
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

  // Convert WP amenities to frontend format only if populated
  let frontendAmenities: Amenity[] | undefined;
  
  if (wpAmenities.length > 0) {
    frontendAmenities = wpAmenities.map((item, index) => {
      // Parse images - could be array of URLs or string
      let images: string[] = [];
      if (Array.isArray(item.images)) {
        images = item.images as string[];
      } else if (typeof item.images === 'string' && item.images) {
        try {
          images = JSON.parse(item.images);
        } catch {
          images = [item.images];
        }
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
          {
            icon: item.feature1Icon || '',
            text: item.feature1Text || '',
          },
          {
            icon: item.feature2Icon || '',
            text: item.feature2Text || '',
          },
        ],
      } as Amenity;
    });
  }

  // When no WP amenities populated, AmenitiesSection falls back to hardcoded data
  return (
    <AmenitiesSection
      content={{ label: attrs.label, title: attrs.title }}
      amenities={frontendAmenities}
    />
  );
}