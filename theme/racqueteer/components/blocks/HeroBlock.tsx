import HeroSection from '@/components/HeroSection';
import type { WPHeroAttributes } from '@/types/wp-blocks';

export default function HeroBlock(attrs: WPHeroAttributes) {
  return (
    <HeroSection
      content={{
        title: attrs.title,
        description: attrs.description,
        ctaPrimaryText: attrs.ctaPrimaryText,
        ctaPrimaryUrl: attrs.ctaPrimaryUrl,
        ctaSecondaryText: attrs.ctaSecondaryText,
        ctaSecondaryUrl: attrs.ctaSecondaryUrl,
        videoUrl: attrs.videoUrl,
      }}
    />
  );
}

