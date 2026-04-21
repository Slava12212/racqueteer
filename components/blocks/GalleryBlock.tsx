import GallerySection from '@/components/private-events/GallerySection';
import type { WPGalleryAttributes } from '@/types/wp-blocks';

export default function GalleryBlock(attrs: WPGalleryAttributes) {
  return (
    <GallerySection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        images: (attrs.images ?? []).map((img) => img.sourceUrl),
      }}
    />
  );
}

