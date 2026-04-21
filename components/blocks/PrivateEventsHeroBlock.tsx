import HeroPrivateEvents from '@/components/private-events/HeroPrivateEvents';
import type { WPPrivateEventsHeroAttributes } from '@/types/wp-blocks';

export default function PrivateEventsHeroBlock(attrs: WPPrivateEventsHeroAttributes) {
  return (
    <HeroPrivateEvents
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        ctaText: attrs.ctaText,
        ctaUrl: attrs.ctaUrl,
        videoUrl: attrs.videoUrl,
      }}
    />
  );
}

