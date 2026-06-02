import GallerySection from '@/components/private-events/GallerySection';
import type { WPGalleryAttributes } from '@/types/wp-blocks';

/** Parse images: may be JSON string, array of objects, or array of strings */
function parseImages(raw: unknown): string[] {
  let arr: unknown[] = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === 'string') {
    try { const p = JSON.parse(raw); if (Array.isArray(p)) arr = p; } catch { /* ignore */ }
  }
  return arr.map((item) =>
    typeof item === 'string' ? item : (item as Record<string, string>)?.sourceUrl ?? ''
  ).filter(Boolean);
}

export default function GalleryBlock(attrs: WPGalleryAttributes) {
  return (
    <GallerySection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        images: parseImages(attrs.images),
      }}
    />
  );
}

