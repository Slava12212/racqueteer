import EventsSection from '@/components/EventsSection';
import type { WPEventsAttributes } from '@/types/wp-blocks';

export default function EventsBlock(attrs: WPEventsAttributes) {
  return (
    <EventsSection
      content={{
        title: attrs.title,
        description: attrs.description,
        ctaText: attrs.ctaText,
        ctaUrl: attrs.ctaUrl,
        imageUrl: attrs.image,
      }}
    />
  );
}

